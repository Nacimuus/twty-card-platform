import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { fullName, title, identityIntro, profilePresentation, bio } = body;

    const prompt = `
Generate 6 short professional skill tags for a digital business card.

Profile:
Name: ${fullName}
Title: ${title}
Short intro: ${identityIntro}
Bio: ${bio}
Profile presentation: ${profilePresentation}

Rules:
- Return ONLY a JSON array of strings
- Max 2 words per skill
- No explanation
- Professional, clear, premium
- Example: ["EMV", "SoftPOS", "PCI DSS", "Project Management"]
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || "[]";
    const skills = JSON.parse(text);

    return NextResponse.json({ skills });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not generate skills" },
      { status: 500 }
    );
  }
}