import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();

  const { companyName, title, bio } = body;

  const response = await client.responses.create({
    model: "gpt-5-nano",
    instructions: `
You are a premium business copywriter.

Write a short company presentation for a digital business card.
The text must be professional, clear, elegant and human.
Maximum 600 characters.
No markdown.
No emojis.
`,
    input: `
Company name: ${companyName || "Not provided"}
Person title: ${title || "Not provided"}
Person bio/context: ${bio || "Not provided"}
`,
  });

  return Response.json({
    companyDescription: response.output_text,
  });
}