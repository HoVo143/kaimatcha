/* eslint-disable prettier/prettier */
"use client";

import clsx from "clsx";
import Image from "next/image";

interface BannerSectionProps {
  image: string;
  title: string;
  text: string;
  linkLabel?: string;
  gradientBottom?: boolean; // mờ ở đáy
  gradientTop?: boolean; // mờ ở đầu
  objectPosition?: string; // điều chỉnh vị trí hiển thị ảnh
  centerContent?: boolean; // nếu true → text nằm giữa
}

export default function BannerSection({
  image,
  title,
  text,
  linkLabel,
  gradientBottom = false,
  gradientTop = false,
  objectPosition = "center",
  centerContent = false,
}: BannerSectionProps) {
  return (
    <section className="relative w-full">
      {/* --- ẢNH BACKGROUND --- */}
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={1600}
          height={600}
          className="w-full h-[35vh] md:h-full object-cover"
          style={{ objectPosition }}
        />

        {/* Gradient ở đầu */}
        {gradientTop && (
          <div className="absolute top-0 left-0 w-full h-1/4 bg-linear-to-b from-black/88 to-transparent pointer-events-none" />
        )}
        {/* Viền mờ đen ở đáy nếu bật */}
        {gradientBottom && (
          <div className="absolute bottom-0 left-0 w-full h-1/9 bg-linear-to-t from-black/88 to-transparent pointer-events-none" />
        )}
      </div>

      {/* --- LAYER CHỮ --- */}
      <div
        className={clsx(
          "absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 transition-all",
          centerContent
            ? "md:pt-0 md:justify-start"
            : "md:items-start md:justify-start md:text-start ",
          "bg-black/40 md:bg-transparent"
        )}
      >
        <h1 className="mt-2 md:mt-14 text-md md:text-4xl font-medium tracking-tight uppercase">
          {title}
        </h1>

        <p className="mt-2 md:mt-6 text-md md:text-xl font-medium md:max-w-[390px]">
          {text}
        </p>

        {linkLabel && (
          <p className="mt-4 text-md md:text-md font-medium uppercase underline">
            <a href="#">{linkLabel}</a>
          </p>
        )}
      </div>
    </section>
  );
}
