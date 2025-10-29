"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { GridTileImage } from "../grid/tile";
import { useProduct, useUpdateURL } from "./product-context";
import { useEffect, useRef } from "react";

export default function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black ";

  // ref cho ul chứa thumbnails
  const thumbListRef = useRef<HTMLUListElement>(null);
  // const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // scroll thumbnail active vào view khi imageIndex thay đổi
  useEffect(() => {
    const currentThumb = thumbRefs.current[imageIndex];
    if (currentThumb && thumbListRef.current) {
      currentThumb.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [imageIndex]);

  return (
    <form className="max-w-[550px] m-auto">
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain rounded-lg"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            src={images[imageIndex]?.src as string}
            alt={images[imageIndex]?.altText as string}
            priority={true}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[5%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur ">
              <button
                formAction={() => {
                  const newState = updateImage(previousImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Previous product image"
                className={buttonClassName}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                formAction={() => {
                  const newState = updateImage(nextImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Next product image"
                className={buttonClassName}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {images.length > 1 ? (
        <ul
          ref={thumbListRef}
          className="my-2 flex items-center gap-2 overflow-x-auto py-1 lg:mb-0 scrollbar-hide"
        >
          {images.map((image, index) => {
            const isActive = index === imageIndex;
            return (
              <li key={image.src} className="shrink-0 md:h-25 md:w-25">
                <button
                  ref={(el) => {
                    thumbRefs.current[index] = el; // trả về void
                  }}
                  formAction={() => {
                    const newState = updateImage(index.toString());
                    updateURL(newState);
                  }}
                  aria-label="Select product image"
                  className="h-full w-full"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    active={isActive}
                    width={80}
                    height={80}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}