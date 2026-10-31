"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  fallbackSrc?: string;
  aspectRatio?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-lucky-lightNeutral text-lucky-mutedText rounded-lg border border-lucky-borderLight",
          className
        )}
      >
        <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
        <span className="text-xs font-medium">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-lucky-lightNeutral/60", className)}>
      <Image
        src={src}
        alt={alt}
        className={cn(
          "duration-500 ease-in-out object-cover",
          isLoading ? "scale-105 blur-md grayscale" : "scale-100 blur-0 grayscale-0"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
}

