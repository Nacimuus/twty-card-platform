"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeCardPrice, type CardConfig } from "@/lib/card-pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// The cart is sent from the client, but we NEVER trust its prices.
// We recompute each line from its config server-side.
type IncomingItem = {
  sourceCardId: string;
  cardName: string;
  config: CardConfig;
};

export async function createCheckoutSession(items: IncomingItem[]) {
  // 1. Auth — must be logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  if (!items || items.length === 0) {
    redirect("/cart");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://palgonic.vercel.app";

  // 2. Recompute every price server-side (source of truth)
  const lineItems = items.map((item) => {
    const { total } = computeCardPrice(item.config);
    // Stripe wants the amount in cents (integer)
    const unitAmount = Math.round(total * 100);

    return {
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: unitAmount,
        product_data: {
          name: `Carte NFC — ${item.cardName}`,
          description: describeForStripe(item.config),
        },
      },
    };
  });

  // 3. Compute the server-side total (for our own order record)
  const serverTotal =
    Math.round(
      items.reduce((sum, i) => sum + computeCardPrice(i.config).total, 0) * 100,
    ) / 100;

  // 4. Create a pending order in our DB BEFORE payment.
  //    We attach its id to the Stripe session so the webhook can find it.
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      currency: "eur",
      subtotal: serverTotal,
      shipping: 0,
      total: serverTotal,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("ORDER CREATE ERROR:", orderError);
    redirect("/cart?error=order");
  }

  // 5. Insert the order_items (one per card)
  const orderItems = items.map((item) => {
    const { total } = computeCardPrice(item.config);
    return {
      order_id: order.id,
      source_card_id: item.sourceCardId,
      product_id: item.config.material,
      config: item.config as unknown as Record<string, unknown>,
      unit_price: total,
      quantity: 1,
      line_total: total,
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("ORDER ITEMS ERROR:", itemsError);
    redirect("/cart?error=items");
  }

  // 6. Create the Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    // Collect shipping address at checkout
    shipping_address_collection: {
      allowed_countries: ["FR", "BE", "CH", "LU", "MC"],
    },
    // Attach our order id so the webhook can match payment → order
    metadata: {
      order_id: order.id,
      user_id: user.id,
    },
    customer_email: user.email,
    success_url: `${baseUrl}/order/success?order=${order.id}`,
    cancel_url: `${baseUrl}/cart?canceled=1`,
  });

  // 7. Save the Stripe session id on the order
  await supabase
    .from("orders")
    .update({ stripe_session_id: session.id })
    .eq("id", order.id);

  if (!session.url) {
    redirect("/cart?error=stripe");
  }

  // 8. Send the user to Stripe's hosted checkout
  redirect(session.url);
}

// Compact description for the Stripe line item
function describeForStripe(config: CardConfig): string {
  const parts: string[] = [config.material];
  const front: string[] = [];
  if (config.front.contact) front.push("coordonnées");
  if (config.front.logo) front.push("logo");
  if (config.front.qr) front.push("QR");
  if (front.length) parts.push(`recto: ${front.join("/")}`);
  if (config.back.enabled) parts.push("verso");
  parts.push(config.finish === "printing" ? "impression" : "gravure");
  return parts.join(" · ");
}
