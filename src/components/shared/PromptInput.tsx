"use client";

import { useState } from "react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  buttonText?: string;
}

export function PromptInput({
  onSubmit,
  placeholder = "Describe the next scene...",
  isLoading = false,
  buttonText = "Generate",
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:text-white/30 text-white font-medium rounded-xl transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </span>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
}
