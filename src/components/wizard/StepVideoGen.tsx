"use client";

import { useEffect, useRef } from "react";
import { useProjectStore } from "@/lib/store";

export function StepVideoGen() {
  const { keyframes, clips, initClipsFromKeyframes, updateClip, setStep } =
    useProjectStore();
  const initialized = useRef(false);

  // Initialize clips from keyframes on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initClipsFromKeyframes();
    }
  }, [initClipsFromKeyframes]);

  // Start video generation for pending clips
  useEffect(() => {
    const pendingClips = clips.filter((c) => c.status === "pending");
    pendingClips.forEach(async (clip) => {
      const startFrame = keyframes.find((f) => f.id === clip.startFrameId);
      const endFrame = keyframes.find((f) => f.id === clip.endFrameId);
      if (!startFrame || !endFrame) return;

      updateClip(clip.id, { status: "processing" });

      try {
        const resp = await fetch("/api/kling/create-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startFrameUrl: startFrame.imageUrl,
            endFrameUrl: endFrame.imageUrl,
            prompt: clip.prompt,
          }),
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error);

        updateClip(clip.id, { taskId: data.taskId });
        pollTask(clip.id, data.taskId);
      } catch {
        updateClip(clip.id, { status: "failed" });
      }
    });
  }, [clips, keyframes, updateClip]);

  const pollTask = async (clipId: number, taskId: string) => {
    const poll = async () => {
      try {
        const resp = await fetch(`/api/kling/status/${taskId}`);
        const data = await resp.json();

        if (data.status === "succeed" && data.videoUrl) {
          updateClip(clipId, { status: "succeeded", videoUrl: data.videoUrl });
        } else if (data.status === "failed") {
          updateClip(clipId, { status: "failed" });
        } else {
          setTimeout(poll, 15000);
        }
      } catch {
        setTimeout(poll, 15000);
      }
    };
    setTimeout(poll, 10000);
  };

  const allDone = clips.length > 0 && clips.every((c) => c.status === "succeeded");
  const anyFailed = clips.some((c) => c.status === "failed");
  const processing = clips.filter((c) => c.status === "processing").length;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Generating Video Clips</h2>
      <p className="text-white/60">
        {allDone
          ? "All clips ready!"
          : `Generating ${clips.length} clips... (${processing} in progress)`}
      </p>

      <div className="w-full max-w-lg space-y-3">
        {clips.map((clip) => {
          const startFrame = keyframes.find((f) => f.id === clip.startFrameId);
          const endFrame = keyframes.find((f) => f.id === clip.endFrameId);
          return (
            <div
              key={clip.id}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
            >
              <img
                src={startFrame?.imageUrl}
                alt=""
                className="w-12 h-12 rounded object-cover"
              />
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <img
                src={endFrame?.imageUrl}
                alt=""
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 ml-2">
                <p className="text-xs text-white/40 truncate">{clip.prompt}</p>
              </div>
              <div className="flex-shrink-0">
                {clip.status === "pending" && (
                  <span className="text-xs text-white/30">Waiting...</span>
                )}
                {clip.status === "processing" && (
                  <span className="text-xs text-blue-400 flex items-center gap-1">
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing
                  </span>
                )}
                {clip.status === "succeeded" && (
                  <span className="text-xs text-green-400">Done</span>
                )}
                {clip.status === "failed" && (
                  <span className="text-xs text-red-400">Failed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {allDone && (
        <button
          onClick={() => setStep("result")}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium transition-all"
        >
          View & Download Video
        </button>
      )}

      {anyFailed && (
        <p className="text-red-400 text-sm">
          Some clips failed. Try generating again with different prompts.
        </p>
      )}
    </div>
  );
}
