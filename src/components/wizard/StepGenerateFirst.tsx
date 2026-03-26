"use client";

import { useState } from "react";
import { useProjectStore } from "@/lib/store";
import { PromptInput } from "../shared/PromptInput";
import { FramePreview } from "../shared/FramePreview";

export function StepGenerateFirst() {
  const { addKeyframe, setStep } = useProjectStore();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setLastPrompt(prompt);

    try {
      const resp = await fetch("/api/gemini/generate-frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
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
      id: 0,
      imageUrl: generatedImage,
      prompt: lastPrompt,
      source: "generated",
    });
    setStep("add-keyframe");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Generate First Frame</h2>
      <p className="text-white/60 text-center max-w-md">
        Describe the opening scene of your video.
      </p>

      {!generatedImage ? (
        <div className="w-full max-w-lg">
          <PromptInput
            onSubmit={handleGenerate}
            placeholder="Describe your first scene... e.g. 'A cute cartoon cat sitting in a garden at sunset'"
            isLoading={isLoading}
            buttonText="Generate First Frame"
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      ) : (
        <div className="w-full max-w-lg space-y-4">
          <FramePreview src={generatedImage} className="h-80" />
          <div className="flex gap-3">
            <button
              onClick={() => setGeneratedImage(null)}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            >
              Regenerate
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
