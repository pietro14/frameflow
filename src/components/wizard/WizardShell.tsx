"use client";

import { useProjectStore } from "@/lib/store";
import { StepStartChoice } from "./StepStartChoice";
import { StepUploadFrame } from "./StepUploadFrame";
import { StepGenerateFirst } from "./StepGenerateFirst";
import { StepKeyframe } from "./StepKeyframe";
import { StepVideoGen } from "./StepVideoGen";
import { StepResult } from "./StepResult";

export function WizardShell() {
  const currentStep = useProjectStore((s) => s.currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            FrameFlow
          </a>
        </header>

        {currentStep === "choose-workflow" && <StepStartChoice />}
        {currentStep === "upload-frame" && <StepUploadFrame />}
        {currentStep === "generate-first-frame" && <StepGenerateFirst />}
        {currentStep === "add-keyframe" && <StepKeyframe />}
        {currentStep === "generate-videos" && <StepVideoGen />}
        {(currentStep === "concatenate" || currentStep === "result") && <StepResult />}
      </div>
    </div>
  );
}
