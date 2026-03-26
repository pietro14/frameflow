import { NextRequest, NextResponse } from "next/server";
import { createVideoTask } from "@/lib/kling";

export const maxDuration = 30;

async function imageUrlToBase64(url: string): Promise<string> {
  if (url.startsWith("data:")) {
    // Extract base64 from data URL
    const base64 = url.split(",")[1];
    return base64;
  }
  const resp = await fetch(url);
  const buffer = Buffer.from(await resp.arrayBuffer());
  return buffer.toString("base64");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startFrameUrl, endFrameUrl, prompt } = body;

    if (!startFrameUrl || !endFrameUrl || !prompt) {
      return NextResponse.json(
        { error: "startFrameUrl, endFrameUrl, and prompt are required" },
        { status: 400 }
      );
    }

    const startBase64 = await imageUrlToBase64(startFrameUrl);
    const endBase64 = await imageUrlToBase64(endFrameUrl);

    const taskId = await createVideoTask(startBase64, endBase64, prompt);

    return NextResponse.json({ taskId });
  } catch (error) {
    console.error("Kling create-video error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create video task" },
      { status: 500 }
    );
  }
}
