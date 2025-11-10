/* eslint-disable @next/next/no-img-element */
/* eslint-disable prettier/prettier */
"use client";

interface SectionDividerProps {
  className?: string; // nếu muốn thêm class ngoài
  imgSrc?: string; // nếu muốn thay đổi hình HR
  alt?: string;
}

export default function SectionDivider({
  className = "",
  imgSrc = "https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Symbol-Logo-Hr.png?v=1761278683",
  alt = "Hr",
}: SectionDividerProps) {
  return (
    <div
      className={`flex max-w-[250px] m-auto items-center justify-center my-8 ${className}`}
    >
      <div className="grow border-t border-gray-500" />
      <img className="w-12 h-12 mx-1" src={imgSrc} alt={alt} />
      <div className="grow border-t border-gray-500" />
    </div>
  );
}
