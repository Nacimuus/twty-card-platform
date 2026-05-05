import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { question, step, card } = body;

    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: `
You are Twty AI, an expert in personal branding, networking and digital business cards.

Current builder step:
${step}

Current user profile data:
${JSON.stringify(card)}

User question:
${question}

Rules:
- Give practical and short advice
- Be actionable
- Optimize for credibility, trust and conversion
- If rewriting content, provide improved version directly
`,
    });

    return Response.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Assistant failed" },
      { status: 500 }
    );
  }
}