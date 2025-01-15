import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apikey = process.env.OPENAI_API_KEY;
  // create the method to call openai api to get a story from the prompt

  const { prompt } = await request.json();
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
            "You are a horror writer. You write short and scary stories, do not write cliche are already told stories. Your stories should be engaging and suspenseful, with a twist ending that leaves the reader on the edge of their seat. Make it only 200 words and return only in valid json format with 3 properties {story: string, title: string, prompt_for_image: string}",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });
  const data = await response.json();

  const jsonWithoutBackticks = data.choices[0].message.content.replace(
    /```json\n|```/g,
    ""
  );

  const parsedJson = JSON.parse(jsonWithoutBackticks);

  return NextResponse.json(parsedJson);
}
