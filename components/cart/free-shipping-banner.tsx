/* eslint-disable prettier/prettier */
"use client";

import { useEffect, useRef, useState } from "react";

interface FreeShippingBannerProps {
  qualifiesForFreeShipping: boolean;
  remaining: number;
  progress: number;
}

export default function FreeShippingBanner({
  qualifiesForFreeShipping,
  remaining,
  progress,
}: FreeShippingBannerProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);
  const previousQualifiedRef = useRef(false);

  // Update progress bar width - ensure it reaches 100% when qualifying
  useEffect(() => {
    if (progressRef.current) {
      const targetWidth = qualifiesForFreeShipping
        ? 100
        : Math.min(100, progress);
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        if (progressRef.current) {
          progressRef.current.style.width = `${targetWidth}%`;
        }
      });
    }
  }, [progress, qualifiesForFreeShipping]);

  // Trigger confetti when transitioning from not qualified to qualified
  useEffect(() => {
    // Only trigger when transitioning from false to true
    if (qualifiesForFreeShipping && !previousQualifiedRef.current) {
      previousQualifiedRef.current = true;
      setShowConfetti(true);
      // Hide confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
    // Reset when no longer qualifying
    if (!qualifiesForFreeShipping) {
      previousQualifiedRef.current = false;
    }
  }, [qualifiesForFreeShipping]);

  useEffect(() => {
    if (showConfetti && confettiRef.current) {
      const confettiElements =
        confettiRef.current.querySelectorAll(".confetti");
      confettiElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const left = htmlEl.dataset.left || "0";
        const delay = htmlEl.dataset.delay || "0";
        const color = htmlEl.dataset.color || "#10b981";
        htmlEl.style.setProperty("--confetti-left", left);
        htmlEl.style.setProperty("--confetti-delay", delay);
        htmlEl.style.setProperty("--confetti-color", color);
      });
    }
  }, [showConfetti]);

  return (
    <div className="px-4 pt-3 pb-2 bg-white relative">
      {showConfetti && (
        <div
          ref={confettiRef}
          className="confetti-container absolute inset-0 pointer-events-none overflow-hidden"
        >
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = [
              "#10b981",
              "#34d399",
              "#6ee7b7",
              "#a7f3d0",
              "#d1fae5",
            ];
            const colorIndex = Math.floor(Math.random() * colors.length);
            return (
              <div
                key={i}
                className="confetti"
                data-left={Math.random() * 100}
                data-delay={Math.random() * 0.5}
                data-color={colors[colorIndex]}
              />
            );
          })}
        </div>
      )}
      {qualifiesForFreeShipping ? (
        <div className="space-y-2 relative z-10">
          <p className="text-lg italic font-medium text-emerald-600">
            Congratulations! Your order qualifies for free shipping
          </p>
          <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full w-full bg-linear-to-r from-emerald-400 via-emerald-500 to-emerald-600 transition-all duration-300 ease-out" />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-lg italic font-medium text-neutral-700">
            You are{" "}
            <span className="font-semibold">${remaining.toFixed(2)}</span> away
            from free shipping.
          </p>
          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-emerald-600 transition-all duration-300 ease-out"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Free shipping progress: ${Math.round(progress)}%`}
              suppressHydrationWarning
            />
          </div>
        </div>
      )}
    </div>
  );
}
