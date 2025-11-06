"use client";

// app/collections/[collection]/loading.tsx
export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50 overflow-hidden">
      <div className="h-full w-full bg-gray-200 relative">
        <div className="absolute h-full w-1/3 bg-emerald-950 animate-slideLoading"></div>
      </div>

      <style jsx>{`
        @keyframes slideLoading {
          0% {
            left: -33%;
          }
          50% {
            left: 33%;
          }
          100% {
            left: 100%;
          }
        }
        .animate-slideLoading {
          animation: slideLoading 1.2s linear infinite;
        }
      `}</style>
    </div>
  );
}
