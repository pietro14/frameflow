"use client";

import { useState } from "react";
import { useProjectStore } from "@/lib/store";
import { PromptInput } from "../shared/PromptInput";
import { FramePreview } from "../shared/FramePreview";
import { Timeline } from "../shared/Timeline";

const MAX_FRAMES = 7;

export function StepKeyframe() {
  const { keyframes, addKeyframe, removeLastKeyframe, setStep } = useProjectStore();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastFrame = keyframes[keyframes.length - 1];
  const canAddMore = keyframes.length < MAX_FRAMES;
  const canGenerateVideo = keyframes.length >= 2;

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setLastPrompt(prompt);

    try {
      const resp = await fetch("/api/gemini/generate-frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          referenceImageUrl: lastFrame.imageUrl,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to generate");

      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (!generatedImage) return;
    addKeyframe({
      id: keyframes.length,
      imageUrl: generatedImage,
      prompt: lastPrompt,
      source: "generated",
    });
    setGeneratedImage(null);
    setLastPrompt("");
  };

  const handleGenerateVideos = () => {
    setStep("generate-videos");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <Timeline keyframes={keyframes} maxFrames={MAX_FRAMES} />

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Last accepted frame */}
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">
            Current Frame ({keyframes.length})
          </h3>
          <FramePreview src={lastFrame.imageUrl} className="h-64" />
        </div>

        {/* Generated preview or prompt */}
        <div>
          {generatedImage ? (
            <>
              <h3 className="text-sm font-medium text-white/60 mb-2">
                Generated Next Frame
              </h3>
              <FramePreview src={generatedImage} className="h-64" />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setGeneratedImage(null)}
                  className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Accept
                </button>
              </div>
            </>
          ) : canAddMore ? (
            <>
              <h3 className="text-sm font-medium text-white/60 mb-2">
                Describe Next Scene
              </h3>
              <PromptInput
                onSubmit={handleGenerate}
                placeholder="What happens next in your video..."
                isLoading={isLoading}
                buttonText="Generate Next Frame"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 border border-white/10 rounded-xl">
              <p className="text-white/40 text-sm">Maximum frames reached</p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full max-w-lg">
        {keyframes.length > 1 && (
          <button
            onClick={removeLastKeyframe}
            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-colors"
          >
            Undo Last
          </button>
        )}
        {canGenerateVideo && !generatedImage && (
          <button
            onClick={handleGenerateVideos}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium transition-all"
          >
            Generate Video ({(keyframes.length - 1) * 5}s)
          </button>
        )}
      </div>
    </div>
  );
}
