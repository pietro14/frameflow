"use client";

interface FramePreviewProps {
  src: string;
  alt?: string;
  className?: string;
}

export function FramePreview({ src, alt = "Frame", className = "" }: FramePreviewProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-black/20 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
