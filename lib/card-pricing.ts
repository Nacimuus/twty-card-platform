// ════════════════════════════════════════════════════════════
// Palgonic physical NFC card — pricing engine
// SINGLE SOURCE OF TRUTH. Imported by the live preview AND the
// server-side checkout. The price a customer sees must always
// equal the price they are charged — so both call computeCardPrice.
// ════════════════════════════════════════════════════════════

// ─── Price constants (euros) ───────────────────────────────
export const PRICING = {
  // Base price by material
  materials: {
    black: 2.99,
    white: 2.99,
    metal: 9.99,
  },
  // Each element costs this, per side it appears on
  elementPrice: 0.3,
  // Unlocking the back side
  backSideUnlock: 0.5,
  // Finish
  finish: {
    engraving: 0,
    printing: 1.0,
  },
  // Shipping is baked into the card price for now
  shipping: 0,
} as const;

// ─── Types ─────────────────────────────────────────────────
export type Material = "black" | "white" | "metal";
export type Finish = "engraving" | "printing";

// Which elements can be placed on a side.
// `name` is always included free on the front, so it's not priced here.
export type SideElements = {
  contact: boolean; // website, phone, instagram, email (one block)
  logo: boolean;
  qr: boolean; // QR code visual (links to digital card)
  date: boolean;
};

export type CardConfig = {
  material: Material;
  finish: Finish;
  front: SideElements;
  back: {
    enabled: boolean; // has the customer unlocked the back?
    elements: SideElements;
  };
};

// ─── Price breakdown output ────────────────────────────────
export type PriceLine = {
  label: string; // e.g. "Logo (recto)"
  amount: number; // euros
};

export type PriceBreakdown = {
  lines: PriceLine[];
  total: number;
};

// ─── Helpers ───────────────────────────────────────────────
const ELEMENT_LABELS: Record<keyof SideElements, string> = {
  contact: "Coordonnées",
  logo: "Logo",
  qr: "QR code",
  date: "Date",
};

function countElements(elements: SideElements): number {
  return (Object.keys(elements) as (keyof SideElements)[]).filter(
    (k) => elements[k],
  ).length;
}

// ─── The one function everything uses ──────────────────────
export function computeCardPrice(config: CardConfig): PriceBreakdown {
  const lines: PriceLine[] = [];

  // 1. Base material
  const base = PRICING.materials[config.material] ?? PRICING.materials.black;
  const materialLabel =
    config.material === "black"
      ? "Carte noire"
      : config.material === "white"
        ? "Carte blanche"
        : "Carte métal";
  lines.push({ label: materialLabel, amount: base });

  // 2. Front elements (+€0.30 each)
  (Object.keys(config.front) as (keyof SideElements)[]).forEach((key) => {
    if (config.front[key]) {
      lines.push({
        label: `${ELEMENT_LABELS[key]} (recto)`,
        amount: PRICING.elementPrice,
      });
    }
  });

  // 3. Back side unlock + back elements
  if (config.back.enabled) {
    lines.push({ label: "Verso (2e face)", amount: PRICING.backSideUnlock });

    (Object.keys(config.back.elements) as (keyof SideElements)[]).forEach(
      (key) => {
        if (config.back.elements[key]) {
          lines.push({
            label: `${ELEMENT_LABELS[key]} (verso)`,
            amount: PRICING.elementPrice,
          });
        }
      },
    );
  }

  // 4. Finish
  if (config.finish === "printing") {
    lines.push({ label: "Impression", amount: PRICING.finish.printing });
  }
  // engraving is free — no line

  // 5. Total (rounded to 2 decimals to avoid float drift)
  const total =
    Math.round(lines.reduce((sum, l) => sum + l.amount, 0) * 100) / 100;

  return { lines, total };
}

// ─── A sensible default config (plain black card) ──────────
export function defaultCardConfig(): CardConfig {
  return {
    material: "black",
    finish: "engraving",
    front: { contact: false, logo: false, qr: false, date: false },
    back: {
      enabled: false,
      elements: { contact: false, logo: false, qr: false, date: false },
    },
  };
}

// ─── Format a number as a euro string, FR style ────────────
export function formatEuros(amount: number): string {
  return amount.toFixed(2).replace(".", ",") + " €";
}
