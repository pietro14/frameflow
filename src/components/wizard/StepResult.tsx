"use client";

import { useProjectStore } from "@/lib/store";

export function StepResult() {
  const { clips, reset } = useProjectStore();
  const videoClips = clips.filter((c) => c.status === "succeeded" && c.videoUrl);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Your Video is Ready!</h2>

      {videoClips.length === 1 ? (
        <div className="w-full max-w-lg">
          <video
            src={videoClips[0].videoUrl}
            controls
            autoPlay
            className="w-full rounded-xl border border-white/10"
          />
        </div>
      ) : (
        <div className="w-full max-w-lg space-y-4">
          <p className="text-white/60 text-center">
            {videoClips.length} clips generated. Play them individually below.
          </p>
          {videoClips.map((clip, i) => (
            <div key={clip.id} className="space-y-1">
              <p className="text-xs text-white/40">Clip {i + 1}</p>
              <video
                src={clip.videoUrl}
                controls
                className="w-full rounded-xl border border-white/10"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        {videoClips.length > 0 && (
          <a
            href={videoClips[0].videoUrl}
            download="frameflow-video.mp4"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
          >
            Download Video
          </a>
        )}
        <button
          onClick={reset}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
        >
          Start New Project
        </button>
      </div>
    </div>
  );
}
