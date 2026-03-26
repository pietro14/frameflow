import { NextRequest, NextResponse } from "next/server";
import { getTaskStatus } from "@/lib/kling";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const result = await getTaskStatus(taskId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Kling status error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get status" },
      { status: 500 }
    );
  }
}
