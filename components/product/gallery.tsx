/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-expressions */

"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { XIcon } from "lucide-react";
import LoadingBar from "../ui/loading-bar-pages";

export default function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  // const scrollRef = useRef<HTMLDivElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<{
    src: string;
    altText?: string;
  } | null>(null);

  // sliderRef là DOM ref, sliderInstance là MutableRefObject
  const [sliderRef, sliderInstance] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1, spacing: 0 }, // ảnh chiếm hết, dính liền
    loop: false,
    slideChanged(s) {
      setCurrentSlide(s.track?.details?.rel ?? 0);
    },
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 1.5, spacing: 0 } },
      "(min-width: 1280px)": { slides: { perView: 2.5, spacing: 0 } },
    },
  });

  const handleScroll = (direction: "next" | "prev") => {
    if (!sliderInstance?.current) return;
    direction === "next"
      ? sliderInstance.current.next()
      : sliderInstance.current.prev();
  };

  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black";

  const totalSlides =
    sliderInstance?.current?.track?.details?.slides.length ?? images.length;

  const openModal = (image: { src: string; altText?: string }) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  return (
    <div className="relative w-full select-none">
      {/* Slider */}
      <div ref={sliderRef} className="keen-slider">
        {images.map((image, index) => {
          const isImageLoaded = loadedImages.has(image.src);
          const isFirstImage = index === 0;

          return (
            <div
              key={image.src}
              className={`
                keen-slider__slide relative aspect-4/3 w-full md:w-auto
                ${images.length === 1 ? "mx-auto max-w-[500px]" : ""}
              `}
              onClick={() => openModal(image)}
            >
              {/* Skeleton Loading Placeholder */}
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-neutral-300 border-t-neutral-500 rounded-full animate-spin" />
                  </div>
                </div>
              )}

              {/* Actual Image */}
              <Image
                src={image.src}
                alt={image.altText || "Product image"}
                fill
                className={`object-cover select-none pointer-events-none transition-opacity duration-500 ${
                  isImageLoaded ? "opacity-100" : "opacity-0"
                }`}
                priority={isFirstImage}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onLoad={() => {
                  setLoadedImages((prev) => {
                    const newSet = new Set(prev);
                    newSet.add(image.src);
                    return newSet;
                  });
                  if (isFirstImage) {
                    setIsLoading(false);
                  }
                }}
                onLoadingComplete={() => {
                  setLoadedImages((prev) => {
                    const newSet = new Set(prev);
                    newSet.add(image.src);
                    return newSet;
                  });
                  if (isFirstImage) {
                    setIsLoading(false);
                  }
                }}
              />
            </div>
          );
        })}
      </div>
      {/* --- LOADING BAR --- */}
      <LoadingBar isLoading={isLoading} />

      {/* Nút next / prev */}
      {images.length > 1 && (
        <div className="absolute bottom-[5%] flex w-full justify-center">
          <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur">
            <button
              onClick={() => handleScroll("prev")}
              aria-label="Previous image"
              className={buttonClassName}
              disabled={currentSlide === 0}
            >
              <ArrowLeftIcon className="h-5" />
            </button>
            <div className="mx-1 h-6 w-px bg-neutral-500"></div>
            <button
              onClick={() => handleScroll("next")}
              aria-label="Next image"
              className={buttonClassName}
              disabled={currentSlide >= totalSlides - 1}
            >
              <ArrowRightIcon className="h-5" />
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL POPUP --- */}
      {isModalOpen && modalImage && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full h-full max-w-[90vw] md:max-w-[70vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // tránh click đóng khi click vào ảnh
          >
            <Image
              src={modalImage.src}
              alt={modalImage.altText || "Product image"}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 90vw, 90vh"
            />
            <button
              onClick={closeModal}
              aria-label="Close image modal"
              className="absolute top-20 md:top-2 right-2 p-2 bg-white rounded-full cursor-pointer"
            >
              <XIcon className="h-5 w-5 text-black hover:text-red-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
// import Image from "next/image";
// import { GridTileImage } from "../grid/tile";
// import { useProduct, useUpdateURL } from "./product-context";
// import { useEffect, useRef } from "react";

// export default function Gallery({
//   images,
// }: {
//   images: { src: string; altText: string }[];
// }) {
//   const { state, updateImage } = useProduct();
//   const updateURL = useUpdateURL();
//   const imageIndex = state.image ? parseInt(state.image) : 0;

//   const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
//   const previousImageIndex =
//     imageIndex === 0 ? images.length - 1 : imageIndex - 1;

//   const buttonClassName =
//     "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black ";

//   // ref cho ul chứa thumbnails
//   const thumbListRef = useRef<HTMLUListElement>(null);
//   // const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
//   const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

//   // scroll thumbnail active vào view khi imageIndex thay đổi
//   useEffect(() => {
//     const currentThumb = thumbRefs.current[imageIndex];
//     if (currentThumb && thumbListRef.current) {
//       currentThumb.scrollIntoView({
//         behavior: "smooth",
//         inline: "center",
//         block: "nearest",
//       });
//     }
//   }, [imageIndex]);

//   return (
//     <form className="max-w-[550px] m-auto">
//       <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
//         {images[imageIndex] && (
//           <Image
//             className="h-full w-full object-contain rounded-lg"
//             fill
//             sizes="(min-width: 1024px) 66vw, 100vw"
//             src={images[imageIndex]?.src as string}
//             alt={images[imageIndex]?.altText as string}
//             priority={true}
//           />
//         )}

//         {images.length > 1 ? (
//           <div className="absolute bottom-[5%] flex w-full justify-center">
//             <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur ">
//               <button
//                 formAction={() => {
//                   const newState = updateImage(previousImageIndex.toString());
//                   updateURL(newState);
//                 }}
//                 aria-label="Previous product image"
//                 className={buttonClassName}
//               >
//                 <ArrowLeftIcon className="h-5" />
//               </button>
//               <div className="mx-1 h-6 w-px bg-neutral-500"></div>
//               <button
//                 formAction={() => {
//                   const newState = updateImage(nextImageIndex.toString());
//                   updateURL(newState);
//                 }}
//                 aria-label="Next product image"
//                 className={buttonClassName}
//               >
//                 <ArrowRightIcon className="h-5" />
//               </button>
//             </div>
//           </div>
//         ) : null}
//       </div>
//       {images.length > 1 ? (
//         <ul
//           ref={thumbListRef}
//           className="my-2 flex items-center gap-2 overflow-x-auto py-1 lg:mb-0 scrollbar-hide"
//         >
//           {images.map((image, index) => {
//             const isActive = index === imageIndex;
//             return (
//               <li key={image.src} className="shrink-0 md:h-25 md:w-25">
//                 <button
//                   ref={(el) => {
//                     thumbRefs.current[index] = el; // trả về void
//                   }}
//                   formAction={() => {
//                     const newState = updateImage(index.toString());
//                     updateURL(newState);
//                   }}
//                   aria-label="Select product image"
//                   className="h-full w-full"
//                 >
//                   <GridTileImage
//                     alt={image.altText}
//                     src={image.src}
//                     active={isActive}
//                     width={80}
//                     height={80}
//                   />
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       ) : null}
//     </form>
//   );
// }
