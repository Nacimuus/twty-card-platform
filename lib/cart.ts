// ════════════════════════════════════════════════════════════
// Palgonic cart — localStorage-backed.
// Stores card CONFIGURATIONS (not trusted prices). At checkout,
// the server recomputes every price from the config via
// computeCardPrice — so a tampered localStorage can't change
// what the customer is charged.
// ════════════════════════════════════════════════════════════

import type { CardConfig } from "./card-pricing";

export type CartItem = {
  id: string; // unique cart line id
  sourceCardId: string; // which digital card this is based on
  cardName: string; // display label (person's name)
  config: CardConfig; // the full personalization
  price: number; // cached for display ONLY — recomputed server-side
};

const KEY = "palgonic_cart_v1";
const EVENT = "palgonic-cart-updated";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export const CART_EVENT = EVENT;

// ─── Human-readable summary of a card config, for cart display ───
export function describeConfig(config: CardConfig): string {
  const parts: string[] = [];

  const front: string[] = [];
  if (config.front.contact) front.push("coordonnées");
  if (config.front.logo) front.push("logo");
  if (config.front.qr) front.push("QR");
  parts.push(front.length ? `Recto : ${front.join(", ")}` : "Recto : nom seul");

  if (config.back.enabled) {
    const back: string[] = [];
    if (config.back.elements.contact) back.push("coordonnées");
    if (config.back.elements.logo) back.push("logo");
    if (config.back.elements.qr) back.push("QR");
    parts.push(back.length ? `Verso : ${back.join(", ")}` : "Verso");
  }

  parts.push(config.finish === "printing" ? "Impression" : "Gravure");

  return parts.join(" · ");
}
