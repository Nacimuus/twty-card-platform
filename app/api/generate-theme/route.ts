import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ALLOWED_PATTERNS = [
  "paper",
  "strokes",
  "petals",
  "filigree",
  "silver",
  "stars",
  "none",
];

export async function POST(request: Request) {
  // ─── Auth gate ────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json(
      { error: "UNAUTHORIZED", message: "Connexion requise." },
      { status: 401 },
    );
  }

  try {
    const { cardId, themePrompt, fullName, title } = await request.json();

    if (!cardId || !themePrompt) {
      return Response.json(
        { error: "INVALID_INPUT", message: "Données manquantes." },
        { status: 400 },
      );
    }

    // ─── Ownership + already-used check ─────────────────────
    const { data: card, error: cardError } = await supabase
      .from("profiles")
      .select("id, user_id, ai_theme_generated_at")
      .eq("id", cardId)
      .single();

    if (cardError || !card) {
      return Response.json(
        { error: "NOT_FOUND", message: "Carte introuvable." },
        { status: 404 },
      );
    }

    if (card.user_id !== user.id) {
      return Response.json(
        { error: "FORBIDDEN", message: "Cette carte ne vous appartient pas." },
        { status: 403 },
      );
    }

    if (card.ai_theme_generated_at) {
      return Response.json(
        {
          error: "ALREADY_USED",
          message: "La génération IA a déjà été utilisée pour cette carte.",
        },
        { status: 403 },
      );
    }

    // ─── AI generation ──────────────────────────────────────
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a premium brand designer creating bespoke visual themes for digital business cards. The output renders as CSS backgrounds.

CRITICAL: Every theme MUST be a multi-layer composition. A single linear gradient is a FAILURE. Always stack 2-3 radial-gradient layers (for glow & depth) ON TOP OF a linear-gradient base.

OUTPUT FORMAT (strict JSON):
{
  "themes": [
    {
      "name": "1-3 word theme name",
      "background": "MUST be multi-layer: 2-3 radial-gradient layers + 1 linear-gradient base, comma-separated",
      "surface": "rgba(...) for inner panels, alpha 0.05-0.15",
      "foreground": "main text color (hex)",
      "muted": "secondary text (hex or rgba)",
      "border": "borders (hex or rgba)",
      "accent": "CTA background (hex), must POP against the background",
      "accentForeground": "CTA text (hex)",
      "texturePattern": "one of: paper | strokes | petals | filigree | silver | stars | none"
    }
  ]
}

EXAMPLES OF EXCELLENT BACKGROUNDS (study the LAYERING):

Moody jazz lounge:
"radial-gradient(circle at 75% 25%, rgba(232,180,80,0.20) 0%, transparent 45%), radial-gradient(circle at 25% 75%, rgba(128,56,180,0.18) 0%, transparent 40%), radial-gradient(circle at 50% 100%, rgba(20,10,30,0.30) 0%, transparent 55%), linear-gradient(135deg, #2D1B45 0%, #1A0E2E 50%, #0F0820 100%)"

Mediterranean summer:
"radial-gradient(circle at 30% 20%, rgba(255,220,100,0.25) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,150,100,0.22) 0%, transparent 50%), linear-gradient(135deg, #0A4A66 0%, #157EA8 50%, #2DA8C8 100%)"

Forest at dusk:
"radial-gradient(circle at 50% 30%, rgba(255,180,120,0.20) 0%, transparent 40%), radial-gradient(circle at 80% 90%, rgba(50,80,30,0.30) 0%, transparent 50%), linear-gradient(135deg, #0E2E1A 0%, #1A4530 50%, #2D5E40 100%)"

Cyberpunk neon:
"radial-gradient(circle at 20% 30%, rgba(0,230,255,0.25) 0%, transparent 45%), radial-gradient(circle at 75% 70%, rgba(255,50,200,0.22) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(80,30,150,0.30) 0%, transparent 55%), linear-gradient(135deg, #0A0E2A 0%, #1A1442 50%, #0A0A20 100%)"

Soft watercolor morning:
"radial-gradient(circle at 25% 25%, rgba(255,200,220,0.30) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(180,220,255,0.28) 0%, transparent 50%), linear-gradient(135deg, #FFF5E8 0%, #FFE8E0 50%, #E8F0FF 100%)"

PICK TEXTURE PATTERN based on vibe:
- "strokes"  → painterly, impressionist, artistic, brushy
- "petals"   → soft, romantic, feminine, floral, spring
- "filigree" → luxury, classic, elegant, refined
- "silver"   → premium dark, sophisticated, metallic
- "stars"    → magical, mystical, dreamy, night, cosmic
- "paper"    → understated, editorial, minimal grain
- "none"     → ONLY if the gradient is already very busy/saturated

ABSOLUTE RULES:
- background MUST contain at minimum 3 layers (2 radial + 1 linear).
- accent MUST be visually distinct (different hue family from background).
- Pick palettes that match the user's vibe — avoid defaulting to blue/purple.
- Both themes must be DIFFERENT from each other (different palette, different mood).
- NEVER use pure white #FFFFFF or pure black #000000.

NOW generate 2 distinct premium themes for this vibe:
"${themePrompt}"

Return strict JSON only.`,
        },
        {
          role: "user",
          content: `Generate 2 themes for: ${fullName || "a professional"}, ${title || "an independent"}.

Vibe: "${themePrompt}"

Both themes must be RICH multi-layer compositions like the examples. Return strict JSON.`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.95,
    });

    const raw = completion.choices[0]?.message?.content || "{}";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("AI returned invalid JSON:", raw);
      return Response.json(
        {
          error: "INVALID_OUTPUT",
          message: "L'IA a renvoyé un résultat invalide. Réessayez.",
        },
        { status: 502 },
      );
    }

    const themes = parsed.themes;
    if (!Array.isArray(themes) || themes.length < 2) {
      return Response.json(
        {
          error: "INVALID_OUTPUT",
          message: "L'IA n'a pas généré 2 variantes valides. Réessayez.",
        },
        { status: 502 },
      );
    }

    const requiredFields = [
      "name",
      "background",
      "surface",
      "foreground",
      "muted",
      "border",
      "accent",
      "accentForeground",
    ];

    const finalThemes = themes.slice(0, 2).map((theme: any) => {
      // Validate required fields
      for (const field of requiredFields) {
        if (!theme[field] || typeof theme[field] !== "string") {
          throw new Error(`Theme missing field: ${field}`);
        }
      }

      // Normalize texturePattern to allowed values
      const pattern =
        typeof theme.texturePattern === "string" &&
        ALLOWED_PATTERNS.includes(theme.texturePattern)
          ? theme.texturePattern
          : "none";

      return {
        name: theme.name,
        background: theme.background,
        surface: theme.surface,
        foreground: theme.foreground,
        muted: theme.muted,
        border: theme.border,
        accent: theme.accent,
        accentForeground: theme.accentForeground,
        texturePattern: pattern,
      };
    });

    // ─── Persist to DB ──────────────────────────────────────
    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({
        ai_theme_variants: finalThemes,
        ai_theme_generated_at: new Date().toISOString(),
        theme_prompt: themePrompt,
      })
      .eq("id", cardId)
      .eq("user_id", user.id)
      .select("id");

    if (updateError) {
      console.error("AI THEME PERSIST ERROR:", updateError);
      return Response.json(
        {
          error: "GENERATION_FAILED",
          message: "Échec de l'enregistrement. Réessayez.",
        },
        { status: 500 },
      );
    }

    if (!updated || updated.length === 0) {
      console.error("AI THEME PERSIST: no row updated", { cardId, userId: user.id });
      return Response.json(
        {
          error: "GENERATION_FAILED",
          message: "Aucune ligne mise à jour. Vérifiez vos permissions.",
        },
        { status: 500 },
      );
    }

    return Response.json({ themes: finalThemes });
  } catch (error) {
    console.error("GENERATE-THEME ERROR:", error);
    return Response.json(
      {
        error: "GENERATION_FAILED",
        message: "Échec de la génération. Réessayez plus tard.",
      },
      { status: 502 },
    );
  }
}
