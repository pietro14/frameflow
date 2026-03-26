"use client";

import { useProjectStore } from "@/lib/store";

export function StepStartChoice() {
  const setStep = useProjectStore((s) => s.setStep);
  const setWorkflowType = useProjectStore((s) => s.setWorkflowType);

  return (
    <div className="flex flex-col items-center gap-8 py-16">
      <h1 className="text-3xl font-bold text-center">How do you want to start?</h1>
      <p className="text-white/60 text-center max-w-md">
        Upload your own starting image or generate one from a text description.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <button
          onClick={() => {
            setWorkflowType("upload");
            setStep("upload-frame");
          }}
          className="flex flex-col items-center gap-3 p-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-2xl transition-all"
        >
          <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="font-semibold">Upload Image</span>
          <span className="text-xs text-white/40">Start from your own frame</span>
        </button>

        <button
          onClick={() => {
            setWorkflowType("text");
            setStep("generate-first-frame");
          }}
          className="flex flex-col items-center gap-3 p-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-2xl transition-all"
        >
          <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <span className="font-semibold">Start from Text</span>
          <span className="text-xs text-white/40">AI generates the first frame</span>
        </button>
      </div>
    </div>
  );
}
