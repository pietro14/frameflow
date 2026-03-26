"use client";

import { useState } from "react";
import type { Keyframe } from "@/types";

interface TimelineProps {
  keyframes: Keyframe[];
  maxFrames?: number;
}

export function Timeline({ keyframes, maxFrames = 37 }: TimelineProps) {
  const [viewIndex, setViewIndex] = useState(Math.max(0, keyframes.length - 1));

  const canPrev = viewIndex > 0;
  const canNext = viewIndex < keyframes.length - 1;
  const current = keyframes[viewIndex];
  const totalSeconds = (keyframes.length - 1) * 5;
  const maxSeconds = (maxFrames - 1) * 5;

  if (keyframes.length === 0) {
    return (
      <div className="w-full text-center text-white/40 text-sm py-4">
        No frames yet
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Carousel */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setViewIndex((i) => i - 1)}
          disabled={!canPrev}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1 text-center">
          {current && (
            <div className="space-y-2">
              <img
                src={current.imageUrl}
                alt={`Frame ${viewIndex + 1}`}
                className="w-full h-40 object-cover rounded-xl border-2 border-blue-500/50"
              />
              <p className="text-xs text-white/50 truncate px-2">
                {current.prompt || "Uploaded frame"}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setViewIndex((i) => i + 1)}
          disabled={!canNext}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots + info */}
      <div className="mt-3 space-y-2">
        {/* Dot indicators (show max ~15 dots, collapse middle if more) */}
        <div className="flex justify-center gap-1.5 flex-wrap">
          {keyframes.map((_, i) => (
            <button
              key={i}
              onClick={() => setViewIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === viewIndex
                  ? "bg-blue-500 scale-125"
                  : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <p className="text-center text-xs text-white/40">
          Frame {viewIndex + 1} of {keyframes.length} &middot; {totalSeconds}s / {maxSeconds}s max
        </p>
      </div>
    </div>
  );
}
