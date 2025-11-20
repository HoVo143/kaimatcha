/* eslint-disable jsx-a11y/alt-text */
"use client";

import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import Label from "./parts/label";

export function GridTileImage({
  active,
  label,
  hideLabel = false,
  secondImage,
  ...props
}: {
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
  hideLabel?: boolean;
  secondImage?: string;
} & React.ComponentProps<typeof Image>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className={clsx(
          "group relative overflow-hidden flex flex-col h-full w-full items-center justify-center rounded-xs bg-white",
          {
            "border-3 border-emerald-600 bg-white": active, // border nổi bật khi active
            "border border-transparent": !active, // border trong suốt khi không active
          }
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {props.src ? (
          <>
            {/* First image (default) */}
            <Image
              className={clsx(
                "h-full w-full object-contain transition-opacity duration-500",
                {
                  "opacity-0": isHovered && secondImage,
                  "opacity-100": !isHovered || !secondImage,
                }
              )}
              {...props}
            />
            {/* Second image (on hover) */}
            {secondImage && (
              <Image
                src={secondImage}
                alt={props.alt || ""}
                fill
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                sizes={props.sizes}
              />
            )}
            <div className="absolute inset-0 bg-black/5 transition-colors" />
          </>
        ) : null}
      </div>

      {!hideLabel && label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          // position={label.position}
        />
      ) : null}
    </>
  );
}
