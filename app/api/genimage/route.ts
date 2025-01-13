import { NextResponse } from "next/server";

const replicateApiUrl =
  "https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions";
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
      prompt,
      guidance: 3.5,
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
