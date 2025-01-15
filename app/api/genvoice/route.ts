import { ElevenLabsClient, play } from "elevenlabs";
import { createWriteStream } from "fs";
import { NextResponse } from "next/server";

const replicateApiUrl = "https://api.replicate.com/v1/predictions";
const replicateApiToken = process.env.REPLICATE_API_TOKEN;
import Replicate from "replicate";
const replicate = new Replicate();
import fs from "fs";

export async function POST(request: Request) {
  const { story } = await request.json();
  const apiKey: any = "sk_d500fb2b98b4c5af1221e19fb89cefe716456b6eaf4966bc";
  const url = "https://api.elevenlabs.io/v1/text-to-speech/";
  const text = "text";
  const voice_id = "CoAqFXxZEa3kpJmE7rDr";

  const client = new ElevenLabsClient({ apiKey: apiKey });

  const audio = await client.textToSpeech.convert(voice_id, {
    text: story,
    model_id: "eleven_multilingual_v2",
    output_format: "mp3_44100_128",
  });
  const fileName = `horror-story-${Date.now()}.mp3`;

  const fileStream = createWriteStream(fileName);
  const response = audio.pipe(fileStream);
  await new Promise((resolve, reject) => {
    fileStream.on("finish", () => resolve(fileName));
    fileStream.on("error", reject);
  });

  const audioBuffer = await fs.promises.readFile(fileName);
  const audioBase64 = Buffer.from(audioBuffer).toString("base64");

  return NextResponse.json({
    audio: audioBase64,
    mimeType: "audio/mpeg",
    fileName: fileName,
  });
}
