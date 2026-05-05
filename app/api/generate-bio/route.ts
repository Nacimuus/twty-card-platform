import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { fullName, title, bio } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `Rewrite this professional bio for a digital business card.

Name: ${fullName}
Title: ${title}
Current bio: ${bio}

Rules:
- Less than 35 words
- Premium and professional
- Clear and credible
- Return only the improved bio`,
    });

    return Response.json({
      bio: response.output_text,
    });
  } catch (error: any) {
    console.error("OpenAI route error:", error);

    return Response.json(
      {
        error: error?.message || "Failed to generate bio",
      },
      { status: 500 }
    );
  }
}