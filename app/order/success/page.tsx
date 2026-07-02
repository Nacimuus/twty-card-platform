import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PalgonicLogo } from "@/components/PalgonicLogo";
import { formatEuros } from "@/lib/card-pricing";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export const metadata = { title: "Commande confirmée" };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let order = null;
  if (orderId) {
    const { data } = await supabase
      .from("orders")
      .select("id, status, total, created_at")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();
    order = data;
  }

  return (
    <main className="min-h-screen bg-creme-paper text-encre">
      <ClearCartOnMount />
      <nav className="mx-auto flex max-w-3xl items-center px-6 py-6">
        <Link href="/dashboard" className="transition hover:opacity-80">
          <PalgonicLogo className="text-2xl" />
        </Link>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foret/10">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0E5C4D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="mt-6 font-display text-4xl tracking-tight">
          Commande confirmée
        </h1>
        <p className="mt-3 text-lg text-encre/80">
          Merci ! Votre paiement a été reçu.
          {order && (
            <>
              {" "}
              Total réglé : <strong>{formatEuros(order.total)}</strong>.
            </>
          )}
        </p>
        <p className="mt-2 text-sm text-pierre">
          Vous recevrez un email de confirmation. Nous préparons votre carte et
          vous informerons de l&apos;expédition.
        </p>

        {order && (
          <p className="mt-6 text-xs text-pierre">
            Référence : {order.id}
          </p>
        )}

        <div className="mt-10">
          <Link
            href="/dashboard"
            className="inline-block rounded-md bg-foret px-6 py-3.5 font-medium text-creme transition hover:bg-foret-deep"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    </main>
  );
}
