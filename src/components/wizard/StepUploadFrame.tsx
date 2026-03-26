"use client";

import { useCallback, useState } from "react";
import { useProjectStore } from "@/lib/store";
import { FramePreview } from "../shared/FramePreview";

export function StepUploadFrame() {
  const { addKeyframe, setStep } = useProjectStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleAccept = () => {
    if (!preview) return;
    addKeyframe({
      id: 0,
      imageUrl: preview,
      prompt: "Uploaded starting frame",
      source: "upload",
    });
    setStep("add-keyframe");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Upload Starting Frame</h2>

      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`w-full max-w-lg h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${
            dragOver ? "border-blue-500 bg-blue-500/10" : "border-white/20 hover:border-white/40"
          }`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <svg className="w-10 h-10 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          <p className="text-white/40">Drop an image here or click to browse</p>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="w-full max-w-lg space-y-4">
          <FramePreview src={preview} className="h-80" />
          <div className="flex gap-3">
            <button
              onClick={() => setPreview(null)}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            >
              Change Image
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
            >
              Use This Frame
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
