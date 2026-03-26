import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdtemp, readFile, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  let workDir: string | null = null;

  try {
    const { videoUrls } = (await request.json()) as { videoUrls: string[] };

    if (!videoUrls || videoUrls.length === 0) {
      return NextResponse.json({ error: "No video URLs provided" }, { status: 400 });
    }

    // Create temp directory
    workDir = await mkdtemp(join(tmpdir(), "frameflow-concat-"));

    // Download all videos
    const filePaths: string[] = [];
    for (let i = 0; i < videoUrls.length; i++) {
      const resp = await fetch(videoUrls[i]);
      if (!resp.ok) throw new Error(`Failed to download clip ${i}`);
      const buffer = Buffer.from(await resp.arrayBuffer());
      const filePath = join(workDir, `clip_${i}.mp4`);
      await writeFile(filePath, buffer);
      filePaths.push(filePath);
    }

    // Create concat list file
    const listContent = filePaths.map((p) => `file '${p}'`).join("\n");
    const listPath = join(workDir, "list.txt");
    await writeFile(listPath, listContent);

    // Run ffmpeg concat
    const outputPath = join(workDir, "output.mp4");
    await execFileAsync("ffmpeg", [
      "-f", "concat",
      "-safe", "0",
      "-i", listPath,
      "-c", "copy",
      "-y",
      outputPath,
    ]);

    // Read output and return as base64 data URL
    const outputBuffer = await readFile(outputPath);
    const base64 = outputBuffer.toString("base64");
    const dataUrl = `data:video/mp4;base64,${base64}`;

    return NextResponse.json({ videoUrl: dataUrl });
  } catch (error) {
    console.error("Concat error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Concatenation failed" },
      { status: 500 }
    );
  } finally {
    // Cleanup temp directory
    if (workDir) {
      rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
