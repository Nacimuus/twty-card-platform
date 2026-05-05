import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const {
      fullName,
      title,
      bio,
      company,
      skills,
      companyDescription,
    } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5",
      input: `
You are writing a premium digital business card bio.

Create a short, powerful, human professional bio.

Professional context:
Name: ${fullName || ""}
Title: ${title || ""}
Current bio: ${bio || ""}
Company: ${company || ""}
Skills: ${
  Array.isArray(skills) ? skills.join(", ") : skills || ""
}
Company description: ${companyDescription || ""}

Rules:
- Maximum 35 words
- Specific to the person
- Never generic
- No clichés
- Highlight expertise naturally
- Sound premium and credible
- Adapt to their industry
- Use concrete positioning
- Make it feel human, not AI-generated
- Do not repeat title mechanically
- Do not start with the name
- Output only the bio
`,
    });

    return Response.json({
      bio: response.output_text.trim(),
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