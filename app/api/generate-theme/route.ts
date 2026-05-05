import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { themePrompt, fullName, title, logoImage } = body;

    const response = await client.responses.create({
      model: "gpt-5-nano",
      instructions: `


You are a UI theme generator for a digital business card app.

Create a complete digital business card theme.
The design must feel premium, modern, and highly visual.

Important rules:
- Return ONLY valid JSON.
- No markdown.
- No explanation.
- Use CSS-compatible values.
- Use hex colors for text.
- Use gradients when useful.
- Do not return random image URLs.
- If background type is "image", use a CSS gradient + texture description instead.
- Keep contrast readable.
- Make buttons visually strong.
- Use effects only when they fit the requested style.
- Be concise inside string values.
- Do not write long aiThemeNotes.

Important rules:
- Use CSS-compatible values.
- Use hex colors for text.
- Use gradients when useful.
- Do not return random image URLs.
- If background type is "image", use a CSS gradient + texture description instead.
- Keep contrast readable.
- Make buttons visually strong.
- Use effects only when they fit the requested style.
`,
input: `
Profile:
Name: ${fullName || "No name provided"}
Title: ${title || "No title provided"}
Brand visual:
${logoImage || "No brand visual provided"}
If a brand visual is provided:

1. Infer the likely dominant colors.
2. Infer the likely brand positioning:
   - luxury
   - corporate
   - tech
   - creative
   - premium
   - minimal

3. Build a theme that visually matches that brand.

4. Keep strong contrast and readability.

5. Use matching texture:
   luxury → luxury / marble
   tech → mesh / carbon
   corporate → grain
   premium → luxury
   minimal → paper

   The theme must feel coherent with the brand identity.
Avoid random colors that clash with the logo.

Priority order:

1. Respect user theme prompt
2. Adapt to brand visual
3. Keep premium visual consistency
4. Keep readability

User request:
${themePrompt}

Return ONLY valid JSON.

Create exactly 3 complete and different theme variations.

Each item in "themes" must include:
- primaryColor
- secondaryColor
- backgroundStyle
- buttonStyle
- aiThemeNotes
- aiTheme with complete background, card, text, buttons, effects

Do not return empty aiTheme objects.

Return this exact structure:

{
  "themes": [
    {
      "primaryColor": "#061B2B",
      "secondaryColor": "#D6B35A",
      "backgroundStyle": "Dark navy luxury gradient with gold glow",
      "buttonStyle": "Gold premium glowing rounded buttons",
      "aiThemeNotes": "Luxury banking direction with dark contrast and subtle shine.",
      "aiTheme": {
        "name": "Swiss Gold Prestige",
"background": {
  "type": "gradient",
  "value": "radial-gradient(circle at top, rgba(214,179,90,0.35), transparent 30%), linear-gradient(135deg, #020617, #061B2B, #000000)",
  "overlay": "rgba(0,0,0,0.2)",
  "texture": "luxury"
}
        },
        "card": {
          "background": "rgba(255,255,255,0.08)",
          "border": "1px solid rgba(214,179,90,0.35)",
          "shadow": "0 25px 80px rgba(214,179,90,0.25)",
          "radius": "2rem"
        },
        "text": {
          "nameColor": "#FFFFFF",
          "titleColor": "#D6B35A",
          "bioColor": "#CBD5E1",
          "labelColor": "#94A3B8"
        },
        "buttons": {
          "background": "linear-gradient(135deg, #F8E7A1, #D6B35A, #8A6A2F)",
          "color": "#061B2B",
          "shadow": "0 12px 35px rgba(214,179,90,0.45)",
          "effect": "shine"
        },
        "effects": {
          "sparkles": true,
          "glass": true,
          "animatedGradient": true,
          "floatingOrbs": true,
          "noiseTexture": true,

          "iconStyle": "luxury",
"animation": {
  "intro": "fade"
}
        }
      }
    }
  ]
}

Important:
- Return 3 objects in the themes array.
- All 3 aiTheme objects must be complete.
- Do not leave aiTheme as {}.
- Use different names, colors, gradients, buttons and effects for each variation.

Allowed values:
background.type = "solid" | "gradient" | "image" | "texture"
background.texture = "none" | "grain" | "luxury" | "carbon" | "marble" | "mesh" | "paper"
buttons.effect = "none" | "glow" | "neon" | "shine" | "glass"
iconStyle = "minimal" | "luxury" | "neon" | "glass"
animation.intro = "fade" | "curtain" | "scale" | "reveal"
max_output_tokens: 1400,
`,
    });

    const text = response.output_text;
    const parsed = JSON.parse(text);

    return Response.json(parsed);
  } catch (error: any) {
    console.error("Theme generation error:", error);

    return Response.json(
      { error: error?.message || "Failed to generate theme" },
      { status: 500 }
    );
  }
}

