// ════════════════════════════════════════════════════════════
// Palgonic themes
// ────────────────────────────────────────────────────────────
//   elysee   — Champs-Élysées luxury (deep emerald + gold + filigree)
//   midnight — premium dark (black + silver + vignette shadow)
//   provence — Van Gogh inspired (deep blue + gold + brush strokes)
//   tokyo    — anime / pop-culture (sakura sunset + petals)
//
// + Texture pattern registry that AI-generated themes can pick from
// ════════════════════════════════════════════════════════════

export type ComputedTheme = {
  name: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  accent: string;
  accentForeground: string;
  overlay?: string;
};

export type ThemeKey = "elysee" | "midnight" | "provence" | "tokyo";

export const THEME_KEYS: ThemeKey[] = ["elysee", "midnight", "provence", "tokyo"];

// ────────────────────────────────────────────────────────────
// SVG texture overlays (data URLs, no asset hosting needed)
// ────────────────────────────────────────────────────────────

// Subtle paper noise — works on light or dark backgrounds
const PAPER_NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.035 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Elysee — nested gold rings, Art Deco filigree
const ELYSEE_FILIGREE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='rgba(212,175,105,0.07)' stroke-width='0.6'%3E%3Ccircle cx='50' cy='50' r='35'/%3E%3Ccircle cx='50' cy='50' r='22'/%3E%3Ccircle cx='50' cy='50' r='10'/%3E%3C/g%3E%3Ccircle cx='50' cy='50' r='1.2' fill='rgba(212,175,105,0.18)'/%3E%3C/svg%3E")`;

// Midnight — silver-tinged noise for tactile depth
const MIDNIGHT_NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='2' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 0.85 0 0 0 0 0.87 0 0 0 0 0.92 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Provence — golden curving brush strokes
const PROVENCE_STROKES = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cg fill='none' stroke='rgba(245,200,66,0.10)' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='M0 80 Q 100 30, 200 80 T 400 80'/%3E%3Cpath d='M0 160 Q 100 110, 200 160 T 400 160'/%3E%3Cpath d='M0 240 Q 100 190, 200 240 T 400 240'/%3E%3Cpath d='M0 320 Q 100 270, 200 320 T 400 320'/%3E%3C/g%3E%3Cg fill='rgba(245,200,66,0.20)'%3E%3Ccircle cx='80' cy='60' r='1.5'/%3E%3Ccircle cx='320' cy='130' r='1.5'/%3E%3Ccircle cx='180' cy='280' r='1.5'/%3E%3Ccircle cx='40' cy='340' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`;

// Tokyo — scattered sakura petals
const TOKYO_PETALS = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Cg fill='rgba(255,255,255,0.20)'%3E%3Cellipse cx='40' cy='30' rx='3.5' ry='7' transform='rotate(30 40 30)'/%3E%3Cellipse cx='220' cy='50' rx='3.5' ry='7' transform='rotate(-20 220 50)'/%3E%3Cellipse cx='130' cy='100' rx='3.5' ry='7' transform='rotate(60 130 100)'/%3E%3Cellipse cx='250' cy='180' rx='3.5' ry='7' transform='rotate(-45 250 180)'/%3E%3Cellipse cx='50' cy='220' rx='3.5' ry='7' transform='rotate(80 50 220)'/%3E%3Cellipse cx='170' cy='250' rx='3.5' ry='7' transform='rotate(15 170 250)'/%3E%3Cellipse cx='280' cy='270' rx='3.5' ry='7' transform='rotate(-60 280 270)'/%3E%3C/g%3E%3C/svg%3E")`;

// Stars — scattered tiny stars for dreamy/magical themes
const STARS_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cg fill='rgba(255,255,255,0.55)'%3E%3Ccircle cx='80' cy='60' r='0.8'/%3E%3Ccircle cx='250' cy='90' r='1'/%3E%3Ccircle cx='150' cy='180' r='0.6'/%3E%3Ccircle cx='350' cy='220' r='1.2'/%3E%3Ccircle cx='50' cy='290' r='0.8'/%3E%3Ccircle cx='280' cy='350' r='0.7'/%3E%3Ccircle cx='180' cy='40' r='0.5'/%3E%3Ccircle cx='370' cy='130' r='0.6'/%3E%3Ccircle cx='120' cy='250' r='0.9'/%3E%3Ccircle cx='210' cy='320' r='0.7'/%3E%3C/g%3E%3C/svg%3E")`;

// Public registry — AI themes pick from these by name
export const TEXTURE_PATTERNS: Record<string, string> = {
  paper: PAPER_NOISE,
  strokes: PROVENCE_STROKES,
  petals: TOKYO_PETALS,
  filigree: ELYSEE_FILIGREE,
  silver: MIDNIGHT_NOISE,
  stars: STARS_PATTERN,
};

// ────────────────────────────────────────────────────────────
// Multi-layer painterly backgrounds for premade themes
// ────────────────────────────────────────────────────────────

const ELYSEE_BG = `
  radial-gradient(circle at 75% 25%, rgba(212, 175, 105, 0.22) 0%, transparent 45%),
  radial-gradient(circle at 25% 80%, rgba(212, 175, 105, 0.12) 0%, transparent 40%),
  radial-gradient(circle at 50% 100%, rgba(8, 50, 36, 0.30) 0%, transparent 55%),
  linear-gradient(135deg, #0A3D2E 0%, #134632 50%, #0E4030 100%)
`.trim();

const MIDNIGHT_BG = `
  radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%),
  radial-gradient(circle at 50% 0%, rgba(180, 195, 220, 0.18) 0%, transparent 55%),
  radial-gradient(circle at 100% 100%, rgba(160, 175, 200, 0.10) 0%, transparent 50%),
  linear-gradient(180deg, #1A1B23 0%, #0A0A0E 100%)
`.trim();

const PROVENCE_BG = `
  radial-gradient(circle at 20% 30%, rgba(245, 200, 66, 0.18) 0%, transparent 40%),
  radial-gradient(circle at 80% 60%, rgba(74, 111, 165, 0.22) 0%, transparent 50%),
  radial-gradient(circle at 50% 90%, rgba(245, 200, 66, 0.10) 0%, transparent 35%),
  linear-gradient(135deg, #0D1B3A 0%, #1A2B5C 50%, #2D3A75 100%)
`.trim();

const TOKYO_BG = `
  radial-gradient(circle at 70% 20%, rgba(255, 215, 0, 0.25) 0%, transparent 40%),
  radial-gradient(circle at 25% 75%, rgba(255, 107, 157, 0.30) 0%, transparent 50%),
  radial-gradient(circle at 90% 90%, rgba(108, 91, 149, 0.35) 0%, transparent 45%),
  linear-gradient(135deg, #FF6B9D 0%, #C961B5 40%, #6B5B95 75%, #2D1B69 100%)
`.trim();

// ────────────────────────────────────────────────────────────
// The 4 premade themes
// ────────────────────────────────────────────────────────────

export const GENERIC_THEMES: Record<ThemeKey, ComputedTheme> = {
  elysee: {
    name: "Élysée",
    background: ELYSEE_BG,
    surface: "rgba(255, 248, 220, 0.07)",
    foreground: "#FAF2DF",
    muted: "#C5B79E",
    border: "rgba(212, 175, 105, 0.25)",
    accent: "#D4AF69",
    accentForeground: "#0A3D2E",
    overlay: ELYSEE_FILIGREE,
  },

  midnight: {
    name: "Midnight",
    background: MIDNIGHT_BG,
    surface: "rgba(255, 255, 255, 0.05)",
    foreground: "#E8E9F0",
    muted: "rgba(232, 233, 240, 0.60)",
    border: "rgba(192, 200, 214, 0.15)",
    accent: "#C0C8D6",
    accentForeground: "#0A0A0E",
    overlay: MIDNIGHT_NOISE,
  },

  provence: {
    name: "Provence",
    background: PROVENCE_BG,
    surface: "rgba(255, 248, 220, 0.08)",
    foreground: "#FFF8E7",
    muted: "#C5B79E",
    border: "rgba(245, 200, 66, 0.22)",
    accent: "#F5C842",
    accentForeground: "#0D1B3A",
    overlay: PROVENCE_STROKES,
  },

  tokyo: {
    name: "Tokyo",
    background: TOKYO_BG,
    surface: "rgba(255, 255, 255, 0.14)",
    foreground: "#FFFFFF",
    muted: "rgba(255, 255, 255, 0.78)",
    border: "rgba(255, 255, 255, 0.25)",
    accent: "#FFD700",
    accentForeground: "#2D1B69",
    overlay: TOKYO_PETALS,
  },
};

// ────────────────────────────────────────────────────────────
// Theme resolver — used by CardPreview AND the public card
// AI themes get their overlay via the texturePattern string lookup
// ────────────────────────────────────────────────────────────

export function resolveTheme(card: {
  theme_mode?: string;
  generic_theme?: string;
  ai_theme?: any;
}): ComputedTheme {
  if (card.theme_mode === "ai" && card.ai_theme) {
    const ai = card.ai_theme;

    // Map texturePattern string → actual SVG overlay
    let overlay: string | undefined;
    if (ai.texturePattern && TEXTURE_PATTERNS[ai.texturePattern]) {
      overlay = TEXTURE_PATTERNS[ai.texturePattern];
    } else if (typeof ai.overlay === "string") {
      overlay = ai.overlay; // backwards compat if direct overlay string
    }

    return {
      name: ai.name || "Personnalisé",
      background: ai.background || GENERIC_THEMES.elysee.background,
      surface: ai.surface || "rgba(255,248,220,0.07)",
      foreground: ai.foreground || "#FAF2DF",
      muted: ai.muted || "#C5B79E",
      border: ai.border || "rgba(212,175,105,0.25)",
      accent: ai.accent || "#D4AF69",
      accentForeground: ai.accentForeground || "#0A3D2E",
      overlay,
    };
  }

  const key = (card.generic_theme as ThemeKey) || "elysee";
  return GENERIC_THEMES[key] || GENERIC_THEMES.elysee;
}
