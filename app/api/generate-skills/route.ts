import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  // Auth gate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fullName, title, identityIntro, profilePresentation, bio } =
      await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You generate professional skill tags for a digital business card. Output ONLY a JSON object with a 'skills' array of strings. Maximum 6 skills, max 2 words each. Professional, clear, premium. Match the language of the input.",
        },
        {
          role: "user",
          content: `Name: ${fullName || ""}
Title: ${title || ""}
Short intro: ${identityIntro || ""}
Bio: ${bio || ""}
Profile presentation: ${profilePresentation || ""}

Return JSON like: {"skills": ["EMV", "SoftPOS", "PCI DSS", "Project Management"]}`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 200,
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || '{"skills":[]}';
    const parsed = JSON.parse(text);
    const skills = Array.isArray(parsed.skills) ? parsed.skills : [];

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("GENERATE-SKILLS ERROR:", error);
    return NextResponse.json(
      { error: "Could not generate skills" },
      { status: 502 },
    );
  }
}