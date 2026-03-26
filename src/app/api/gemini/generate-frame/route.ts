import { NextRequest, NextResponse } from "next/server";
import { generateFrame } from "@/lib/gemini";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, referenceImageUrl, aspectRatio } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let referenceImageBytes: Buffer | undefined;
    if (referenceImageUrl) {
      if (referenceImageUrl.startsWith("data:")) {
        // Parse base64 data URL directly
        const base64Data = referenceImageUrl.split(",")[1];
        referenceImageBytes = Buffer.from(base64Data, "base64");
      } else {
        const resp = await fetch(referenceImageUrl);
        referenceImageBytes = Buffer.from(await resp.arrayBuffer());
      }
    }

    const result = await generateFrame(
      prompt,
      referenceImageBytes,
      aspectRatio || "16:9"
    );

    // Return image as base64 data URL
    const base64 = result.imageBytes.toString("base64");
    const dataUrl = `data:${result.mimeType};base64,${base64}`;

    return NextResponse.json({
      imageUrl: dataUrl,
      modelText: result.modelText,
    });
  } catch (error) {
    console.error("Gemini generate-frame error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate frame" },
      { status: 500 }
    );
  }
}
