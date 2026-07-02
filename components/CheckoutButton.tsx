"use client";

import { useState } from "react";
import { useCart } from "@/components/useCart";
import { createCheckoutSession } from "@/app/actions/checkout";

export function CheckoutButton() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);

    // Send only the config + source (NOT the price — server recomputes).
    const payload = items.map((i) => ({
      sourceCardId: i.sourceCardId,
      cardName: i.cardName,
      config: i.config,
    }));

    try {
      // This server action redirects to Stripe on success.
      await createCheckoutSession(payload);
    } catch (err) {
      // A thrown redirect is normal Next.js behavior — only real errors land here.
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      className="mt-6 w-full rounded-md bg-foret py-3.5 font-medium text-creme transition hover:bg-foret-deep disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Redirection vers le paiement…" : "Passer à la caisse"}
    </button>
  );
}
