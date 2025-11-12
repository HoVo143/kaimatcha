/* eslint-disable prettier/prettier */
"use client";

import React from "react";
import clsx from "clsx";

interface LoadingBarProps {
  isLoading: boolean;
}

export default function LoadingBar({ isLoading }: LoadingBarProps) {
  return (
    <div
      className={clsx(
        "transition-all duration-300 w-full relative overflow-hidden bg-gray-100",
        isLoading ? "h-[5px] opacity-100" : "h-0 opacity-0"
      )}
    >
      {isLoading && <div className="loading-bar" />}
    </div>
  );
}
