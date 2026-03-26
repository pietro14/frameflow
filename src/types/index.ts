export interface Keyframe {
  id: number;
  imageUrl: string;
  prompt: string;
  source: "upload" | "generated";
}

export interface VideoClip {
  id: number;
  startFrameId: number;
  endFrameId: number;
  taskId: string;
  status: "pending" | "processing" | "succeeded" | "failed";
  videoUrl?: string;
  prompt: string;
}

export type WizardStep =
  | "choose-workflow"
  | "upload-frame"
  | "generate-first-frame"
  | "add-keyframe"
  | "generate-videos"
  | "concatenate"
  | "result";

export interface GenerateFrameRequest {
  referenceImageUrl?: string;
  prompt: string;
  aspectRatio?: string;
}

export interface GenerateFrameResponse {
  imageUrl: string;
  modelText?: string;
}

export interface CreateVideoRequest {
  startFrameUrl: string;
  endFrameUrl: string;
  prompt: string;
}

export interface CreateVideoResponse {
  taskId: string;
}

export interface VideoStatusResponse {
  status: "submitted" | "processing" | "succeed" | "failed";
  videoUrl?: string;
}
