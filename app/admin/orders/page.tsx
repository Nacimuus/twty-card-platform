import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PalgonicLogo } from "@/components/PalgonicLogo";
import { formatEuros } from "@/lib/card-pricing";
import { describeConfig } from "@/lib/cart";
import { OrderStatusControls } from "@/components/OrderStatusControls";
import type { CardConfig } from "@/lib/card-pricing";

export const metadata = { title: "Commandes — Admin" };

type OrderItemRow = {
  id: string;
  source_card_id: string | null;
  product_id: string;
  config: CardConfig;
  unit_price: number;
  quantity: number;
};

type OrderRow = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  ship_name: string | null;
  ship_line1: string | null;
  ship_line2: string | null;
  ship_postal_code: string | null;
  ship_city: string | null;
  ship_country: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
  order_items: OrderItemRow[];
};

const STATUS_DISPLAY: Record<
  string,
  { label: string; className: string }
> = {
  paid: { label: "À traiter", className: "bg-corail/15 text-corail-deep" },
  shipped: { label: "Expédiée", className: "bg-blue-100 text-blue-700" },
  delivered: { label: "Livrée", className: "bg-foret/10 text-foret" },
  cancelled: { label: "Annulée", className: "bg-pierre-soft text-pierre" },
  returned: { label: "Retour", className: "bg-amber-100 text-amber-700" },
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  // Fetch ALL orders (every status) so admin sees the full history
  const { data: orders } = await supabase
    .from("orders")
    .select(
      `id, status, total, created_at,
       ship_name, ship_line1, ship_line2, ship_postal_code, ship_city, ship_country,
       tracking_number, tracking_carrier,
       order_items ( id, source_card_id, product_id, config, unit_price, quantity )`,
    )
    .neq("status", "pending")
    .order("created_at", { ascending: false });

  const rows = (orders as OrderRow[] | null) || [];

  const toProcess = rows.filter((o) => o.status === "paid").length;

  return (
    <main className="min-h-screen bg-creme-paper text-encre">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/dashboard" className="transition hover:opacity-80">
          <PalgonicLogo className="text-2xl" />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/dashboard"
            className="text-pierre transition hover:text-foret"
          >
            Tableau de bord
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-pierre transition hover:text-foret"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Commandes
          </h1>
          <p className="text-sm text-pierre">
            {rows.length} au total · {toProcess} à traiter
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-pierre-soft bg-white p-10 text-center text-pierre">
            Aucune commande pour l&apos;instant.
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {rows.map((order) => {
              const display =
                STATUS_DISPLAY[order.status] || STATUS_DISPLAY.paid;
              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-pierre-soft bg-white p-6"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${display.className}`}
                        >
                          {display.label}
                        </span>
                        <span className="text-xs text-pierre">
                          {new Date(order.created_at).toLocaleString("fr-FR")}
                        </span>
                      </div>
                      <p className="mt-2 font-display text-lg">
                        {formatEuros(order.total)}
                      </p>
                    </div>

                    <div className="text-right text-sm">
                      <p className="font-medium">{order.ship_name || "—"}</p>
                      <p className="text-pierre">
                        {order.ship_line1 || ""}
                        {order.ship_line2 ? `, ${order.ship_line2}` : ""}
                      </p>
                      <p className="text-pierre">
                        {order.ship_postal_code || ""} {order.ship_city || ""}{" "}
                        {order.ship_country || ""}
                      </p>
                    </div>
                  </div>

                  {/* Cards to make */}
                  <div className="mt-4 space-y-2 border-t border-pierre-soft pt-4">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg bg-creme px-4 py-2.5 text-sm"
                      >
                        <div>
                          <span className="font-medium capitalize">
                            {item.product_id}
                          </span>
                          <span className="ml-2 text-pierre">
                            {describeConfig(item.config)}
                          </span>
                        </div>
                        <span className="text-pierre">
                          {formatEuros(item.unit_price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Status controls */}
                  <OrderStatusControls
                    key={`${order.id}-${order.status}`}
                    orderId={order.id}
                    currentStatus={order.status}
                    trackingNumber={order.tracking_number}
                    trackingCarrier={order.tracking_carrier}
                  />

                  <p className="mt-3 text-xs text-pierre">Réf : {order.id}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
