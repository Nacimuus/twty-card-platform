import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Webhooks run outside a user session, so we use the SERVICE ROLE key
// to update orders. This key bypasses RLS — keep it server-only, NEVER
// expose it with a NEXT_PUBLIC_ prefix.
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function POST(request: Request) {
  const body = await request.text(); // RAW body — required for signature check
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("WEBHOOK SIGNATURE ERROR:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (orderId) {
      const supabase = adminClient();

      // To reliably read the shipping address, re-fetch the session
      // expanded. Different Stripe API versions expose the address in
      // different spots; re-fetching gives us a stable shape.
      let shipName: string | null = null;
      let line1: string | null = null;
      let line2: string | null = null;
      let postal: string | null = null;
      let city: string | null = null;
      let country: string | null = null;

      try {
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["customer_details"],
        });

        // Newer API: collected_information.shipping_details
        // Older API: shipping_details / shipping
        const anySession = full as unknown as {
          collected_information?: {
            shipping_details?: {
              name?: string;
              address?: {
                line1?: string;
                line2?: string;
                postal_code?: string;
                city?: string;
                country?: string;
              };
            };
          };
          shipping_details?: {
            name?: string;
            address?: {
              line1?: string;
              line2?: string;
              postal_code?: string;
              city?: string;
              country?: string;
            };
          };
        };

        const ship =
          anySession.collected_information?.shipping_details ??
          anySession.shipping_details;

        if (ship) {
          shipName = ship.name ?? null;
          line1 = ship.address?.line1 ?? null;
          line2 = ship.address?.line2 ?? null;
          postal = ship.address?.postal_code ?? null;
          city = ship.address?.city ?? null;
          country = ship.address?.country ?? null;
        }
      } catch (e) {
        console.error("SHIPPING FETCH ERROR:", e);
        // Non-fatal — we still mark the order paid; you can read the
        // address in the Stripe dashboard if needed.
      }

      const { error } = await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_payment_intent:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
          ship_name: shipName,
          ship_line1: line1,
          ship_line2: line2,
          ship_postal_code: postal,
          ship_city: city,
          ship_country: country,
        })
        .eq("id", orderId);

      if (error) {
        console.error("ORDER UPDATE ERROR:", error);
        return new Response("DB update failed", { status: 500 });
      }
    }
  }

  return new Response("ok", { status: 200 });
}
