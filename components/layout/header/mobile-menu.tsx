/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Menu } from "../../../lib/shopify/types";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment, useState } from "react";
import Search from "./search";

export default function MobileMenu({
  menu,
  teawareSubmenu,
  goodsSubmenu,
  teawareSubmenuMedium,
  goodsSubmenuMedium,
}: {
  menu: Menu[];
  teawareSubmenu: Menu[];
  goodsSubmenu: Menu[];
  teawareSubmenuMedium: Menu[];
  goodsSubmenuMedium: Menu[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => {
    setIsOpen(false);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu((prev) => (prev === title ? null : title));
  };
  // const openMobileMenu = () => setIsOpen(true);
  // const closeMobileMenu = () => setIsOpen(false);
  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200  transition-colors md:hidden "
      >
        <Bars3Icon className="h-6" />
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-999">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 ">
              <div className="p-4">
                <button
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors "
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6" />
                </button>
                <div className="pb-4 w-full border-b border-neutral-200">
                  <Search />
                </div>
                {menu.length > 0 ? (
                  <ul className="flex w-full flex-col font-family-text-canela">
                    {menu.map((item: Menu) => {
                      const hasSubmenu = item.title === "Teaware";
                      // const hasSubmenu =
                      //   item.title === "Teaware" || item.title === "Goods";
                      return (
                        <li
                          key={item.title}
                          className="border-b border-neutral-200"
                        >
                          {/* Mục cha */}
                          <div
                            className="flex justify-between items-center py-3 text-lg text-black cursor-pointer"
                            onClick={() =>
                              hasSubmenu
                                ? toggleSubmenu(item.title)
                                : closeMobileMenu()
                            }
                          >
                            <Link
                              href={`/${item.path}`}
                              prefetch={true}
                              className="uppercase"
                              onClick={() =>
                                hasSubmenu ? null : closeMobileMenu()
                              }
                            >
                              {item.title}
                            </Link>

                            {hasSubmenu && (
                              <ChevronDownIcon
                                className={`h-5 w-5 transition-transform ${
                                  openSubmenu === item.title
                                    ? "rotate-180"
                                    : "rotate-0"
                                }`}
                              />
                            )}
                          </div>

                          {/* Menu con */}
                          {hasSubmenu && (
                            <div
                              className={`overflow-hidden transition-all duration-300 ${
                                openSubmenu === item.title
                                  ? "max-h-[600px] opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              {/* Type submenu */}
                              <div className="pl-4 pb-3">
                                <h4 className="text-xs font-medium mb-2 uppercase text-neutral-400">
                                  Type
                                </h4>
                                <ul className="flex flex-col gap-3">
                                  {(item.title === "Teaware"
                                    ? teawareSubmenu
                                    : goodsSubmenu
                                  ).map((sub) => (
                                    <li key={sub.title}>
                                      <Link
                                        href={`/${sub.path}`}
                                        prefetch={true}
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 text-base text-neutral-700"
                                      >
                                        {sub.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Medium submenu */}
                              <div className="pl-4 pb-4 border-t border-neutral-100 mt-2">
                                <h4 className="text-xs font-medium mb-2 uppercase text-neutral-400">
                                  Medium
                                </h4>
                                <ul className="flex flex-col gap-3">
                                  {(item.title === "Teaware"
                                    ? teawareSubmenuMedium
                                    : goodsSubmenuMedium
                                  ).map((sub) => (
                                    <li key={sub.title}>
                                      <Link
                                        href={`/${sub.path}`}
                                        prefetch={true}
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 text-base text-neutral-700"
                                      >
                                        {sub.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
              <div className="flex justify-center absolute bottom-10 w-full">
                <img
                  src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/logo-kaimatcha-new.png?v=1761207325"
                  alt="kaimatcha"
                  className="h-16 "
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
