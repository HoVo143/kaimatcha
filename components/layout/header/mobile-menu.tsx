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
import { Fragment, useState, useEffect, useRef } from "react";
import Search from "./search";

export default function MobileMenu({
  menu,
  teawareSubmenu,
  teawareSubmenuMedium,
}: {
  menu: Menu[];
  teawareSubmenu: Menu[];
  teawareSubmenuMedium: Menu[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeawareSubmenu, setShowTeawareSubmenu] = useState(false);
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => {
    setIsOpen(false);
    setShowTeawareSubmenu(false);
  };

  const openTeawareSubmenu = () => {
    setShowTeawareSubmenu(true);
  };

  const backToMainMenu = () => {
    setShowTeawareSubmenu(false);
  };

  // Set animation delay for main menu items dynamically
  useEffect(() => {
    if (isOpen && !showTeawareSubmenu && mainMenuRef.current) {
      const menuItems = mainMenuRef.current.querySelectorAll(
        ".mobile-main-menu-item"
      );
      menuItems.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const delay = htmlEl.dataset.delay || "0";
        htmlEl.style.setProperty(
          "--item-delay",
          `${parseFloat(delay) * 0.05}s`
        );
      });
    }
  }, [isOpen, showTeawareSubmenu]);

  // Set animation delay for submenu items dynamically
  useEffect(() => {
    if (showTeawareSubmenu && submenuRef.current) {
      const menuItems =
        submenuRef.current.querySelectorAll(".mobile-menu-item");
      menuItems.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const delay = htmlEl.dataset.delay || "0";
        htmlEl.style.setProperty(
          "--item-delay",
          `${parseFloat(delay) * 0.05}s`
        );
      });
    }
  }, [showTeawareSubmenu]);
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
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 overflow-y-auto">
              {!showTeawareSubmenu ? (
                // Main menu
                <div
                  ref={mainMenuRef}
                  className="p-4 mobile-main-menu-container"
                >
                  <button
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors"
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
                      {menu.map((item: Menu, index) => {
                        const isTeaware = item.title === "Teaware";
                        return (
                          <li
                            key={item.title}
                            className="border-b border-neutral-200 mobile-main-menu-item"
                            data-delay={index}
                          >
                            <div className="flex justify-between items-center py-3 text-lg text-black cursor-pointer">
                              {isTeaware ? (
                                <button
                                  onClick={openTeawareSubmenu}
                                  className="uppercase w-full text-left"
                                >
                                  {item.title}
                                </button>
                              ) : (
                                <Link
                                  href={`/${item.path}`}
                                  prefetch={true}
                                  className="uppercase"
                                  onClick={closeMobileMenu}
                                >
                                  {item.title}
                                </Link>
                              )}
                              {isTeaware && (
                                <ChevronDownIcon className="h-5 w-5 -rotate-90" />
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              ) : (
                // Teaware submenu screen
                <div ref={submenuRef} className="p-4 mobile-submenu-container">
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors"
                      onClick={backToMainMenu}
                      aria-label="Back to main menu"
                    >
                      <ChevronDownIcon className="h-6 rotate-90" />
                    </button>
                    <button
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors ml-auto"
                      onClick={closeMobileMenu}
                      aria-label="Close mobile menu"
                    >
                      <XMarkIcon className="h-6" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-8">
                    {/* Type and Medium columns */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Type column */}
                      <div>
                        <h4 className="text-lg font-medium mb-4 uppercase text-neutral-400">
                          TYPE
                        </h4>
                        <ul className="flex flex-col gap-3">
                          {teawareSubmenu.map((sub, index) => (
                            <li
                              key={sub.title}
                              className="mobile-menu-item"
                              data-delay={index}
                            >
                              <Link
                                href={`/${sub.path}`}
                                prefetch={true}
                                onClick={closeMobileMenu}
                                className="text-xl text-black hover:text-neutral-600 transition-colors"
                              >
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Medium column */}
                      <div>
                        <h4 className="text-lg font-medium mb-4 uppercase text-neutral-400">
                          MEDIUM
                        </h4>
                        <ul className="flex flex-col gap-3">
                          {teawareSubmenuMedium.map((sub, index) => (
                            <li
                              key={sub.title}
                              className="mobile-menu-item"
                              data-delay={index}
                            >
                              <Link
                                href={`/${sub.path}`}
                                prefetch={true}
                                onClick={closeMobileMenu}
                                className="text-xl text-black hover:text-neutral-600 transition-colors"
                              >
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Image banner */}
                    <div className="mt-4">
                      <img
                        src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/banner-exhibition.jpg?v=1762940727"
                        alt="Teaware banner"
                        className="w-full h-auto object-cover rounded-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
