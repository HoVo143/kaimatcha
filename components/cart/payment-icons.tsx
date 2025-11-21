/* eslint-disable prettier/prettier */
"use client";

// Shopify payment icons - sử dụng SVG inline
const PAYMENT_ICONS = [
  {
    name: "visa",
    label: "Visa",
    svg: (
      <svg viewBox="0 0 38 24" className="h-7 w-auto">
        <rect width="38" height="24" rx="2" fill="#1A1F71" />
        <text
          x="19"
          y="16"
          fontSize="10"
          fill="#fff"
          textAnchor="middle"
          fontWeight="bold"
        >
          VISA
        </text>
      </svg>
    ),
  },
  {
    name: "mastercard",
    label: "Mastercard",
    svg: (
      <svg viewBox="0 0 38 24" className="h-7 w-auto">
        <rect width="38" height="24" rx="2" fill="#EB001B" />
        <circle cx="14" cy="12" r="6" fill="#F79E1B" />
        <circle cx="24" cy="12" r="6" fill="#FF5F00" />
      </svg>
    ),
  },
  {
    name: "american_express",
    label: "American Express",
    svg: (
      <svg viewBox="0 0 38 24" className="h-7 w-auto">
        <rect width="38" height="24" rx="2" fill="#006FCF" />
        <text
          x="19"
          y="15"
          fontSize="7"
          fill="#fff"
          textAnchor="middle"
          fontWeight="bold"
        >
          AMEX
        </text>
      </svg>
    ),
  },
  {
    name: "paypal",
    label: "PayPal",
    svg: (
      <svg viewBox="0 0 38 24" className="h-7 w-auto">
        <rect width="38" height="24" rx="2" fill="#003087" />
        <text
          x="19"
          y="16"
          fontSize="9"
          fill="#009CDE"
          textAnchor="middle"
          fontWeight="bold"
        >
          PayPal
        </text>
      </svg>
    ),
  },
  {
    name: "apple_pay",
    label: "Apple Pay",
    svg: (
      <svg viewBox="0 0 38 24" className="h-7 w-auto">
        <rect width="38" height="24" rx="2" fill="#000" />
        <text
          x="19"
          y="15"
          fontSize="8"
          fill="#fff"
          textAnchor="middle"
          fontWeight="600"
        >
          Apple Pay
        </text>
      </svg>
    ),
  },
  {
    name: "google_pay",
    label: "Google Pay",
    svg: (
      <svg viewBox="0 0 38 24" className="h-7 w-auto">
        <rect width="38" height="24" rx="2" fill="#4285F4" />
        <text
          x="19"
          y="15"
          fontSize="8"
          fill="#fff"
          textAnchor="middle"
          fontWeight="600"
        >
          G Pay
        </text>
      </svg>
    ),
  },
  {
    name: "shopify_pay",
    label: "Shop Pay",
    svg: (
      <svg viewBox="0 0 38 24" className="h-7 w-auto">
        <rect width="38" height="24" rx="2" fill="#95BF47" />
        <text
          x="19"
          y="15"
          fontSize="8"
          fill="#fff"
          textAnchor="middle"
          fontWeight="600"
        >
          Shop Pay
        </text>
      </svg>
    ),
  },
];

export default function PaymentIcons() {
  return (
    <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
      {PAYMENT_ICONS.map((icon) => (
        <div
          key={icon.name}
          className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity"
          title={icon.label}
        >
          {icon.svg}
        </div>
      ))}
    </div>
  );
}
