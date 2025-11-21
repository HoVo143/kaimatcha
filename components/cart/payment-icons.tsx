"use client";

import Image from "next/image";
import { useState, type ReactElement } from "react";

// Payment icons - load từ /public/payment-icons/ hoặc fallback SVG
// fullWidth: true = không có border/padding, full width để đều hơn
// borderOnly: true = có border và border-radius nhưng không có padding
const PAYMENT_ICONS = [
  {
    name: "american_express",
    label: "American Express",
    fileName: "american_express.svg",
    fullWidth: false,
    borderOnly: true,
  },
  {
    name: "diners_club",
    label: "Diners Club",
    fileName: "diners_club.svg",
    fullWidth: false,
  },
  {
    name: "google_pay",
    label: "Google Pay",
    fileName: "google_pay.svg",
    fullWidth: false,
    scale: 2,
  },
  {
    name: "paypal",
    label: "PayPal",
    fileName: "paypal.svg",
    fullWidth: false,
  },
  {
    name: "visa",
    label: "Visa",
    fileName: "visa.svg",
    fullWidth: false,
    scale: 2,
  },
  {
    name: "apple_pay",
    label: "Apple Pay",
    fileName: "apple_pay.svg",
    fullWidth: true,
  },
  {
    name: "discover",
    label: "Discover",
    fileName: "discover.svg",
    fullWidth: false,
    borderOnly: true,
    scale: 0.85,
  },
  {
    name: "mastercard",
    label: "Mastercard",
    fileName: "mastercard.svg",
    fullWidth: false,
  },
  {
    name: "shopify_pay",
    label: "Shop Pay",
    fileName: "shopify_pay.svg",
    fullWidth: false,
  },
];

// SVG Fallback nếu không có image trong /public
const getFallbackSVG = (name: string) => {
  const fallbacks: Record<string, ReactElement> = {
    american_express: (
      <svg
        viewBox="0 0 64 40"
        className="h-9 w-14"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          width="64"
          height="40"
          rx="4"
          fill="#000"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        <text
          x="32"
          y="20"
          fontSize="8"
          fill="#fff"
          textAnchor="middle"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
          letterSpacing="0.25"
        >
          AMERICAN
        </text>
        <text
          x="32"
          y="30"
          fontSize="8"
          fill="#fff"
          textAnchor="middle"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
          letterSpacing="0.25"
        >
          EXPRESS
        </text>
      </svg>
    ),
    diners_club: (
      <svg
        viewBox="0 0 64 40"
        className="h-9 w-14"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          width="64"
          height="40"
          rx="4"
          fill="#fff"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        <ellipse cx="32" cy="20" rx="11" ry="8" fill="#0079BE" />
        <rect x="28" y="14" width="8" height="12" fill="#fff" />
        <text
          x="32"
          y="24"
          fontSize="12"
          fill="#0079BE"
          textAnchor="middle"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
        >
          D
        </text>
      </svg>
    ),
    google_pay: (
      <svg
        viewBox="0 0 64 40"
        className="h-9 w-14"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          width="64"
          height="40"
          rx="4"
          fill="#fff"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        {/* Multi-colored Google G logo */}
        <defs>
          <clipPath id="gClip">
            <circle cx="22" cy="20" r="8" />
          </clipPath>
        </defs>
        {/* Blue section */}
        <path
          d="M22 12 A8 8 0 0 1 30 20 L22 20 Z"
          fill="#4285F4"
          clipPath="url(#gClip)"
        />
        {/* Red section */}
        <path
          d="M22 12 L22 20 L14 20 A8 8 0 0 1 22 12 Z"
          fill="#EA4335"
          clipPath="url(#gClip)"
        />
        {/* Yellow section */}
        <path
          d="M22 20 L30 20 A8 8 0 0 1 22 28 L22 20 Z"
          fill="#FBBC04"
          clipPath="url(#gClip)"
        />
        {/* Green section */}
        <path
          d="M22 20 L22 28 A8 8 0 0 1 14 20 L22 20 Z"
          fill="#34A853"
          clipPath="url(#gClip)"
        />
        {/* White cutout */}
        <path
          d="M22 16 A4 4 0 0 1 26 20 L22 20 Z"
          fill="#fff"
          clipPath="url(#gClip)"
        />
        <text
          x="40"
          y="25"
          fontSize="9"
          fill="#5F6368"
          textAnchor="middle"
          fontWeight="500"
          fontFamily="Arial, sans-serif"
        >
          Pay
        </text>
      </svg>
    ),
    paypal: (
      <svg
        viewBox="0 0 64 40"
        className="h-9 w-14"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          width="64"
          height="40"
          rx="4"
          fill="#003087"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        {/* PayPal white P logo */}
        <path
          d="M24 14 L24 26 L28 26 C31 26, 33 24, 33 20 C33 16, 31 14, 28 14 Z M26 16 L28 16 C29.5 16, 31 17, 31 20 C31 23, 29.5 24, 28 24 L26 24 Z"
          fill="#fff"
        />
        <path
          d="M35 14 L35 26 L39 26 C42 26, 44 24, 44 20 C44 16, 42 14, 39 14 Z M37 16 L39 16 C40.5 16, 42 17, 42 20 C42 23, 40.5 24, 39 24 L37 24 Z"
          fill="#009CDE"
        />
      </svg>
    ),
    visa: (
      <svg
        viewBox="0 0 64 40"
        className="h-9 w-14"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          width="64"
          height="40"
          rx="4"
          fill="#fff"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        <text
          x="32"
          y="26"
          fontSize="13"
          fill="#1A1F71"
          textAnchor="middle"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
          letterSpacing="1.2"
        >
          VISA
        </text>
      </svg>
    ),
    apple_pay: (
      <svg
        viewBox="0 0 64 40"
        className="h-10 w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="64" height="40" rx="4" fill="#fff" />
        {/* Apple logo - black apple with bite */}
        <path
          d="M20 11.5 C19 11.5, 18 12.5, 18 13.5 L18 21.5 C18 23, 19 24, 20.5 24 C22 24, 23 23, 23 21.5 L23 13.5 C23 12.5, 22 11.5, 21 11.5 C20 11.5, 19 12.5, 20 11.5 Z"
          fill="#000"
        />
        {/* Top curve */}
        <path
          d="M20 12 Q21 11, 22 12"
          stroke="#000"
          strokeWidth="1.2"
          fill="none"
        />
        {/* Bite mark - white circle cutout */}
        <circle cx="22.5" cy="15.5" r="2.2" fill="#fff" />
        <text
          x="36"
          y="25"
          fontSize="11"
          fill="#000"
          textAnchor="middle"
          fontWeight="600"
          fontFamily="Arial, sans-serif"
        >
          Pay
        </text>
      </svg>
    ),
    discover: (
      <svg
        viewBox="0 0 64 40"
        className="h-9 w-14"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          width="64"
          height="40"
          rx="4"
          fill="#000"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        <text
          x="32"
          y="22"
          fontSize="10"
          fill="#fff"
          textAnchor="middle"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
          letterSpacing="0.5"
        >
          DISCOVER
        </text>
        {/* Orange/yellow wave arc below text */}
        <defs>
          <linearGradient id="discoverWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6000" />
            <stop offset="50%" stopColor="#FF8C00" />
            <stop offset="100%" stopColor="#FFB800" />
          </linearGradient>
        </defs>
        <path
          d="M10 30 Q32 27, 54 30"
          stroke="url(#discoverWave)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
    mastercard: (
      <svg
        viewBox="0 0 64 40"
        className="h-9 w-14"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          width="64"
          height="40"
          rx="4"
          fill="#fff"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        <circle cx="24" cy="20" r="9" fill="#EB001B" />
        <circle cx="40" cy="20" r="9" fill="#F79E1B" />
      </svg>
    ),
    shopify_pay: (
      <svg
        viewBox="0 0 64 40"
        className="h-9 w-14"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          width="64"
          height="40"
          rx="4"
          fill="#fff"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        {/* Shopping bag icon */}
        <path
          d="M20 12 L20 14 L18 14 L18 28 C18 30, 19.5 31.5, 21.5 31.5 L42.5 31.5 C44.5 31.5, 46 30, 46 28 L46 14 L44 14 L44 12 Z M20 14 L44 14 L44 28 C44 29, 43.5 29.5, 42.5 29.5 L21.5 29.5 C20.5 29.5, 20 29, 20 28 Z"
          fill="#000"
        />
        {/* Stylized S on bag */}
        <path
          d="M28 18 Q30 17, 32 18 Q34 19, 32 20 Q30 21, 28 20 Q26 19, 28 18"
          fill="#fff"
        />
        <path
          d="M28 22 Q30 21, 32 22 Q34 23, 32 24 Q30 25, 28 24 Q26 23, 28 22"
          fill="#fff"
        />
      </svg>
    ),
  };

  return fallbacks[name] || <div className="h-9 w-14 bg-gray-200 rounded" />;
};

function PaymentIcon({ icon }: { icon: (typeof PAYMENT_ICONS)[0] }) {
  const [useFallback, setUseFallback] = useState(false);

  // Icons full width không có border/padding
  const isFullWidth = icon.fullWidth || false;
  const borderOnly = icon.borderOnly || false;

  // Xác định container class dựa trên loại icon
  let containerClass = "h-9 w-14 flex items-center justify-center";
  if (isFullWidth) {
    // Không border, không padding
    containerClass = "h-9 w-14 flex items-center justify-center";
  } else if (borderOnly) {
    // Có border và border-radius, không padding
    containerClass =
      "h-9 w-14 flex items-center justify-center border border-neutral-200 rounded-md overflow-hidden";
  } else {
    // Có border, border-radius và padding
    containerClass =
      "h-9 w-14 flex items-center justify-center border border-neutral-200 rounded-md bg-white p-1.5";
  }

  if (useFallback) {
    return <div className={containerClass}>{getFallbackSVG(icon.name)}</div>;
  }

  const scale = icon.scale || 1;
  const imageClass =
    isFullWidth || borderOnly
      ? "h-full w-full object-cover"
      : "h-full w-full object-contain";

  return (
    <div className={containerClass} title={icon.label}>
      <Image
        src={`/payment-icons/${icon.fileName}`}
        alt={icon.label}
        width={64}
        height={40}
        className={imageClass}
        style={{ transform: `scale(${scale})` }}
        unoptimized
        onError={() => {
          setUseFallback(true);
        }}
      />
    </div>
  );
}

export default function PaymentIcons() {
  return (
    <div className="flex items-center justify-start gap-1.5 mt-3 flex-wrap">
      {PAYMENT_ICONS.map((icon) => (
        <PaymentIcon key={icon.name} icon={icon} />
      ))}
    </div>
  );
}
