import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const { question, step, card } = await request.json();
    if (!question) {
      return Response.json({ error: "Missing question" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Palgonic AI — expert in personal branding, networking, and digital business cards. Give practical, short, actionable advice. Optimize for credibility, trust, and conversion. If rewriting content, provide the improved version directly. Match the language of the question.",
        },
        {
          role: "user",
          content: `Current builder step: ${step || "unknown"}
Current profile: ${JSON.stringify(card || {}).slice(0, 1000)}

Question: ${question}`,
        },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const answer = completion.choices[0]?.message?.content || "";
    return Response.json({ answer });
  } catch (error) {
    console.error("ASSISTANT ERROR:", error);
    return Response.json(
      { error: "Assistant unavailable" },
      { status: 502 },
    );
  }
}