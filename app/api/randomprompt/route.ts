import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apikey = process.env.OPENAI_API_KEY;
  //METHOD TO GET A RANDOM PROMPT FROM THE PROMPTS calling openai api to get a story from the prompt
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      Authorization: `Bearer ${apikey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",

      max_tokens: 500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages: [
        {
          role: "assistant",
          content:
            "Create a maximum of 40 words prompt to generate a horror story. The story should be scary, suspenseful, and engaging. It should also include a twist ending that leaves the reader on the edge of their seat. Only return the prompt, no other text. ",
        },
      ],
    }),
  });
  const data = await response.json();

  return NextResponse.json(data);
}
