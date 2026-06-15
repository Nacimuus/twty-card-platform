import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type FieldConfig = {
  rule: string;
  goodExample: string;
  badExample: string;
};

const FIELD_CONFIGS: Record<string, FieldConfig> = {
  "short professional bio": {
    rule: "Write a short professional bio. Max 25 words. First person. Impactful, clear positioning. Show expertise and value. Adapt to their profession.",
    goodExample:
      "Building payment infrastructure for European fintechs. 15 years across EMV, SoftPOS, PCI DSS. Currently scaling fraud-prevention systems.",
    badExample: "Short Professional Bio: I'm a developer working in payments.",
  },
  "company description": {
    rule: "Write a short company description. Max 30 words. Explain what the company does + business value. Premium positioning.",
    goodExample:
      "Premium water solutions for businesses across France. From distribution to filtration, keeping teams hydrated and performing at their best.",
    badExample: "Company Description: We sell water and water products.",
  },
  "company services list": {
    rule: "List concrete services. Comma-separated values only. Max 5 services. No vague wording. No labels.",
    goodExample:
      "Bottled water distribution, filtration systems, corporate supply, event water services, custom solutions",
    badExample:
      "Company Services List: We offer many services including water and others.",
  },
  "professional skills list": {
    rule: "List concrete professional skills. Comma-separated values only. Max 6 skills. Max 2 words per skill. No filler.",
    goodExample:
      "Business management, sales strategy, team leadership, market analysis, operations, CRM",
    badExample: "Professional Skills List: Business management and other skills.",
  },
};

// Defensive: strip common label prefixes if the model adds them anyway
function stripLabels(text: string): string {
  return text
    .replace(
      /^\s*(short professional bio|professional bio|bio|company description|description|company services list|company services|services|professional skills list|skills list|skills)\s*:\s*/i,
      "",
    )
    .trim();
}

export async function POST(request: Request) {
  // Auth gate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { field, context } = await request.json();
    if (!field) {
      return Response.json({ error: "Missing field" }, { status: 400 });
    }

    const config = FIELD_CONFIGS[field];
    if (!config) {
      return Response.json({ error: "Unknown field type" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You write premium business card content. ${config.rule}

CRITICAL OUTPUT RULES:
- Output ONLY the final content. Nothing else.
- NEVER add a label prefix like "Bio:", "Skills:", "Description:", "Company Services List:" etc.
- NEVER add explanations or commentary.
- Match the language of the input.

Bad output: "${config.badExample}"
Good output: "${config.goodExample}"`,
        },
        {
          role: "user",
          content: `Profile:
Name: ${context?.full_name || ""}
Title: ${context?.title || ""}
Current bio: ${context?.bio || ""}
Company: ${context?.company || ""}
Company description: ${context?.company_description || ""}
Skills: ${
            Array.isArray(context?.skills)
              ? context.skills.join(", ")
              : context?.skills || ""
          }
Website: ${context?.website || ""}

Generate the field: ${field}

Return ONLY the content. No labels. No commentary.`,
        },
      ],
      max_tokens: 250,
      temperature: 0.8,
    });

    const raw = (completion.choices[0]?.message?.content || "").trim();
    const cleaned = stripLabels(raw);

    return Response.json({ text: cleaned });
  } catch (error) {
    console.error("GENERATE-FIELD ERROR:", error);
    return Response.json({ error: "Generation failed" }, { status: 502 });
  }
}