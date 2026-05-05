import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { field, context } = await request.json();

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `
You are Twty AI.

Role:
You write premium business card content for professionals.

Mission:
Generate content that feels specific, strategic, credible and human.

Professional profile:
Name: ${context?.full_name || ""}
Title: ${context?.title || ""}
Current bio: ${context?.bio || ""}
Company: ${context?.company || ""}
Company description: ${context?.company_description || ""}
Skills: ${
  Array.isArray(context?.skills)
    ? context.skills.join(", ")
    : context?.skills || ""
}
Website: ${context?.website || ""}

Target field:
${field}

Global rules:
- Never generate generic content
- Avoid clichés
- Avoid empty motivational wording
- Use concrete business language
- Adapt vocabulary to the profession
- Make the person sound credible and experienced
- Make each generation different
- Use the provided context deeply
- Return only final content

Field rules:

BIO:
If field = short professional bio
- max 25 words
- first person
- impactful
- human
- clear positioning
- show expertise + value

COMPANY DESCRIPTION:
If field = company description
- max 30 words
- explain what company does
- explain business value
- premium positioning

COMPANY SERVICES:
If field = company services list
- max 5 services
- comma separated
- concrete business services
- no vague wording

SKILLS:
If field = professional skills list
- max 6 skills
- comma separated
- highly relevant to the profession
- strong business/professional relevance
`,
    });

    return Response.json({
      text: response.output_text.trim(),
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}