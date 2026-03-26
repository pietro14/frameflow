"use client";

import type { Keyframe } from "@/types";

interface TimelineProps {
  keyframes: Keyframe[];
  maxFrames?: number;
}

export function Timeline({ keyframes, maxFrames = 7 }: TimelineProps) {
  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: maxFrames }).map((_, i) => {
          const frame = keyframes[i];
          const isFilled = !!frame;
          return (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {frame ? (
                  <img
                    src={frame.imageUrl}
                    alt={`Frame ${i}`}
                    className="w-10 h-10 rounded object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded border-2 border-dashed border-white/20 bg-white/5" />
                )}
                <span className="text-[10px] text-white/40 mt-1">
                  {isFilled ? `F${i + 1}` : `${i + 1}`}
                </span>
              </div>
              {i < maxFrames - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 ${
                    i < keyframes.length - 1 ? "bg-blue-500" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-white/40 mt-2">
        {keyframes.length} / {maxFrames} frames ({(keyframes.length - 1) * 5}s / {(maxFrames - 1) * 5}s max)
      </p>
    </div>
  );
}
