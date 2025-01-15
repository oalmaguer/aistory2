import { NextResponse } from "next/server";

const replicateApiUrl =
  "https://api.replicate.com/v1/models/recraft-ai/recraft-v3/predictions";
const replicateApiToken = process.env.REPLICATE_API_TOKEN;
export async function POST(request: Request) {
  const { prompt } = await request.json();

  const headers = {
    Authorization: `Bearer ${replicateApiToken}`,
    "Content-Type": "application/json",
    Prefer: "wait",
  };

  const body = JSON.stringify({
    input: {
      size: "1365x1024",
      style: "realistic_image",
      prompt,
      // guidance: 1.8,
    },
  });

  const response = await fetch(replicateApiUrl, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(`Error generating image: ${response.statusText}`);
  }

  const data = await response.json();

  return NextResponse.json(data.output);
}
