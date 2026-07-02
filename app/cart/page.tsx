"use client";

import Link from "next/link";
import { PalgonicLogo } from "@/components/PalgonicLogo";
import { useCart } from "@/components/useCart";
import { describeConfig } from "@/lib/cart";
import { formatEuros } from "@/lib/card-pricing";
import { CheckoutButton } from "@/components/CheckoutButton";

export default function CartPage() {
  const { items, total, remove, hydrated } = useCart();

  return (
    <main className="min-h-screen bg-creme-paper text-encre">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link href="/dashboard" className="transition hover:opacity-80">
          <PalgonicLogo className="text-2xl" />
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-pierre transition hover:text-foret"
        >
          Tableau de bord
        </Link>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Votre panier
        </h1>

        {!hydrated ? (
          <p className="mt-8 text-pierre">Chargement…</p>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-pierre-soft bg-white p-10 text-center">
            <p className="text-lg">Votre panier est vide.</p>
            <p className="mt-2 text-sm text-pierre">
              Commandez une carte NFC depuis l&apos;une de vos cartes digitales.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-block rounded-md bg-foret px-6 py-3 font-medium text-creme transition hover:bg-foret-deep"
            >
              Voir mes cartes
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            {/* Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-pierre-soft bg-white p-5"
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg">{item.cardName}</p>
                    <p className="mt-1 text-sm text-pierre">
                      {describeConfig(item.config)}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="mt-3 text-xs text-pierre underline-offset-2 hover:text-corail-deep hover:underline"
                    >
                      Retirer
                    </button>
                  </div>
                  <p className="shrink-0 font-display text-lg">
                    {formatEuros(item.price)}
                  </p>
                </div>
              ))}

              <Link
                href="/dashboard"
                className="inline-block text-sm text-foret underline-offset-2 hover:underline"
              >
                + Ajouter une autre carte
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="rounded-2xl border border-pierre-soft bg-white p-6">
                <h2 className="font-display text-lg">Récapitulatif</h2>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-encre/75">
                    {items.length} carte{items.length > 1 ? "s" : ""}
                  </span>
                  <span>{formatEuros(total)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-encre/75">Livraison</span>
                  <span className="text-pierre">Incluse</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-pierre-soft pt-4">
                  <span className="text-sm text-pierre">Total</span>
                  <span className="font-display text-2xl">
                    {formatEuros(total)}
                  </span>
                </div>

                <CheckoutButton />

                <p className="mt-3 text-center text-xs text-pierre">
                  Paiement sécurisé par Stripe.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
