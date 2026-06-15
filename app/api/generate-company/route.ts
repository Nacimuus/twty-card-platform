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
    const { companyName, title, bio } = await request.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a premium business copywriter. Write a short company presentation for a digital business card. Professional, clear, elegant, human. Maximum 600 characters. No markdown, no emojis. Match the language of the input.",
        },
        {
          role: "user",
          content: `Company name: ${companyName || "Not provided"}
Person title: ${title || "Not provided"}
Person bio: ${bio || "Not provided"}`,
        },
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    const companyDescription = (
      completion.choices[0]?.message?.content || ""
    ).trim();

    return Response.json({ companyDescription });
  } catch (error) {
    console.error("GENERATE-COMPANY ERROR:", error);
    return Response.json(
      { error: "Failed to generate company description" },
      { status: 502 },
    );
  }
}