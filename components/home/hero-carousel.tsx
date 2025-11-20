/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "../ui/scroll-reveal";

interface BannerSlide {
  image: string;
  title: string;
  linkText: string;
  linkHref: string;
}

const banners: BannerSlide[] = [
  {
    image:
      "https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Banner.png?v=1762588669",
    title: "Single-Origin Ceremonial Matcha",
    linkText: "Explore matcha",
    linkHref: "/collections/matcha",
  },
  {
    image:
      "https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Kai_Matcha_Web_Banner_1.png?v=1763622971",
    title: "Artisanal, single-origin teas sourced from Japan estates",
    linkText: "Explore teaware",
    linkHref: "/collections/teaware",
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play every 5 seconds
  useEffect(() => {
    // Clear any existing interval
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }

    // Don't auto-play if dragging
    if (isDragging) {
      return;
    }

    // Start auto-play
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    // Cleanup on unmount or when isDragging changes
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isDragging]);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  // Handle drag move and end
  const handleMouseMove = () => {
    if (!isDragging) return;
    // Just track movement, we'll handle change on mouse up
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const endX = e.clientX;
    const diff = endX - startX;
    const threshold = 50; // Minimum drag distance to change slide

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe right - go to previous
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      } else {
        // Swipe left - go to next
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }
    }

    setIsDragging(false);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    const threshold = 50; // Minimum drag distance to change slide

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe right - go to previous
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      } else {
        // Swipe left - go to next
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }
    }

    setIsDragging(false);
  };

  return (
    <section
      className="relative w-full overflow-hidden h-[70vh] md:h-screen cursor-grab active:cursor-grabbing bg-black"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
          <div className="absolute top-26 md:top-48 inset-0 flex flex-col items-center justify-start text-center text-white px-6 z-20">
            <ScrollReveal direction="up" delay={100}>
              <h1 className="mt-2 text-xl md:text-4xl font-medium tracking-tight">
                {banner.title}
              </h1>
              <p>
                <Link
                  href={banner.linkHref}
                  className="tracking-wider uppercase text-link mt-2 md:mt-8 inline-flex h-10 items-start justify-start underline text-sm font-medium hover:text-emerald-400 transition-colors"
                >
                  {banner.linkText}
                </Link>
              </p>
            </ScrollReveal>
          </div>
        </div>
      ))}

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
                autoPlayRef.current = null;
              }
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
