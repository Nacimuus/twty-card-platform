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
    const {
      fullName,
      title,
      bio,
      company,
      skills,
      companyDescription,
    } = await request.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write premium digital business card bios. Maximum 35 words. Specific, never generic, no clichés. Highlight expertise naturally. Sound premium and credible. Adapt to their industry. Sound human, not AI-generated. Do not repeat the title mechanically. Do not start with the name. Match the language of the input. Output only the bio.",
        },
        {
          role: "user",
          content: `Name: ${fullName || ""}
Title: ${title || ""}
Current bio: ${bio || ""}
Company: ${company || ""}
Skills: ${Array.isArray(skills) ? skills.join(", ") : skills || ""}
Company description: ${companyDescription || ""}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const newBio = (completion.choices[0]?.message?.content || "").trim();
    return Response.json({ bio: newBio });
  } catch (error) {
    console.error("GENERATE-BIO ERROR:", error);
    return Response.json(
      { error: "Failed to generate bio" },
      { status: 502 },
    );
  }
}