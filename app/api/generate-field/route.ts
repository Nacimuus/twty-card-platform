import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { field, context } = await request.json();

    const response = await client.responses.create({
      model: "gpt-5-nano",
  input: `
You are Twty AI, a premium personal branding assistant.

Generate content for this field:
${field}

Context:
${JSON.stringify(context)}

Strict output rules:
- Return ONLY the generated content
- No markdown
- No explanation
- No intro sentence

Field-specific rules:

1. If field is "short professional bio":
- Maximum 1 short line
- Write in first person
- The person speaks about themselves
- Clear, human, confident
- Example style: "I help companies deliver secure payment projects with clarity and impact."

2. If field is "company description":
- Maximum 1 short lines
- High-level and concise
- Explain what the company does and the value it brings
- Premium but simple wording

3. If field is "company services list":
- Return maximum 4 items
- Each item must be 1 to 2 words maximum
- Separate items with commas
- Example: "Consulting, Training, Strategy, Payments, Leadership"

4. If field is "professional skills list":
- Return maximum 5 skills
- Each skill must be 1 to 2 words maximum
- Separate skills with commas
- Example: "Project Management, Payments, Leadership, Strategy, Negotiation"

Keep the result short, direct and premium.
No long paragraphs.
No generic motivational language.
Return only the final text.
Maximum:
- bio: 2 short sentences
- company description: 2 short sentences
- skills/services: 5 comma-separated items maximum
`,
    });

    return Response.json({
      text: response.output_text,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Generation failed" },
      { status: 500 }
    );
    
  }
}