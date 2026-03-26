"use client";

import { create } from "zustand";
import type { Keyframe, VideoClip, WizardStep } from "@/types";

interface ProjectState {
  keyframes: Keyframe[];
  clips: VideoClip[];
  currentStep: WizardStep;
  workflowType: "upload" | "text" | null;
  isGenerating: boolean;

  setStep: (step: WizardStep) => void;
  setWorkflowType: (type: "upload" | "text") => void;
  setIsGenerating: (val: boolean) => void;
  addKeyframe: (frame: Keyframe) => void;
  removeLastKeyframe: () => void;
  addClip: (clip: VideoClip) => void;
  updateClip: (id: number, updates: Partial<VideoClip>) => void;
  initClipsFromKeyframes: () => void;
  reset: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  keyframes: [],
  clips: [],
  currentStep: "choose-workflow",
  workflowType: null,
  isGenerating: false,

  setStep: (step) => set({ currentStep: step }),
  setWorkflowType: (type) => set({ workflowType: type }),
  setIsGenerating: (val) => set({ isGenerating: val }),

  addKeyframe: (frame) =>
    set((state) => ({ keyframes: [...state.keyframes, frame] })),

  removeLastKeyframe: () =>
    set((state) => ({ keyframes: state.keyframes.slice(0, -1) })),

  addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),

  updateClip: (id, updates) =>
    set((state) => ({
      clips: state.clips.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  initClipsFromKeyframes: () => {
    const { keyframes } = get();
    const clips: VideoClip[] = [];
    for (let i = 0; i < keyframes.length - 1; i++) {
      clips.push({
        id: i,
        startFrameId: keyframes[i].id,
        endFrameId: keyframes[i + 1].id,
        taskId: "",
        status: "pending",
        prompt: keyframes[i + 1].prompt,
      });
    }
    set({ clips });
  },

  reset: () =>
    set({
      keyframes: [],
      clips: [],
      currentStep: "choose-workflow",
      workflowType: null,
      isGenerating: false,
    }),
}));
