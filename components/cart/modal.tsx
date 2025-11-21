/* eslint-disable prettier/prettier */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useRef, useState } from "react";
import { useCart } from "./cart-context";
import { createUrl } from "../../lib/utils";
import Image from "next/image";
import Link from "next/link";
import Price from "../grid/parts/price";
import OpenCart from "./open-cart";
import CloseCart from "./close-cart";
import { DEFAULT_OPTION } from "../../lib/constants";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import { DeleteItemButton } from "./delete-item-button";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import LoadingDots from "../ui/loading-dots";
import FreeShippingBanner from "./free-shipping-banner";
import PaymentIcons from "./payment-icons";

type MerchandiseSearchParams = {
  [key: string]: string;
};

const FREE_SHIPPING_THRESHOLD = 50; // $50

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Calculate free shipping progress
  const subtotal = cart ? parseFloat(cart.cost.totalAmount.amount) : 0;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }

      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-999">
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
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white text-black backdrop-blur-xl md:w-[440px] ">
              {/* Header */}
              <div className="pt-3 pb-2 border-b border-neutral-200">
                <div className="products-price flex items-center justify-between px-4 ">
                  <p className="text-sm font-medium uppercase">
                    Cart ({cart?.totalQuantity || 0})
                  </p>
                  <button aria-label="Close cart" onClick={closeCart}>
                    <CloseCart />
                  </button>
                </div>

                {/* Free Shipping Banner */}
                {cart && cart.lines.length > 0 && (
                  <FreeShippingBanner
                    qualifiesForFreeShipping={qualifiesForFreeShipping}
                    remaining={remaining}
                    progress={progress}
                  />
                )}
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="flex items-center gap-2 mt-24 justify-center">
                  <ShoppingCartIcon className="h-7" />
                  <p className="text-center text-lg font-medium">
                    Your Cart is Empty.
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  <ul className="cart-scrollbar grow overflow-auto px-4 py-4 pr-2">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title
                        )
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[
                                name.toLocaleLowerCase()
                              ] = value;
                            }
                          }
                        );
                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams)
                        );

                        return (
                          <li
                            key={i}
                            className="flex w-full flex-col border-b border-neutral-100 pb-4 mb-4"
                          >
                            <div className="relative flex flex-row gap-3">
                              <Link
                                href={merchandiseUrl}
                                onClick={closeCart}
                                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm"
                              >
                                <Image
                                  className="h-full w-full object-cover"
                                  width={80}
                                  height={80}
                                  alt={
                                    item.merchandise.product.featuredImage
                                      .altText || item.merchandise.product.title
                                  }
                                  src={
                                    item.merchandise.product.featuredImage.url
                                  }
                                />
                              </Link>
                              <div className="flex flex-1 flex-col justify-between">
                                <div className="flex items-start justify-between gap-2">
                                  <Link
                                    href={merchandiseUrl}
                                    onClick={closeCart}
                                    className="flex-1"
                                  >
                                    <span className="text-sm md:text-lg uppercase font-medium leading-tight block">
                                      {item.merchandise.product.title}
                                    </span>
                                    {item.merchandise.title !==
                                    DEFAULT_OPTION ? (
                                      <p className="text-xs text-neutral-500 mt-0.5">
                                        {item.merchandise.title}
                                      </p>
                                    ) : null}
                                  </Link>
                                </div>
                                <div className="products-price flex items-center justify-between mt-1">
                                  <Price
                                    className="text-sm font-medium text-black"
                                    amount={item.cost.totalAmount.amount}
                                    currencyCode={
                                      item.cost.totalAmount.currencyCode
                                    }
                                  />
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 flex-row items-center rounded-sm border border-neutral-200">
                                      <EditItemQuantityButton
                                        item={item}
                                        type="minus"
                                        optimisticUpdate={updateCartItem}
                                      />
                                      <p className="w-8 text-center">
                                        <span className="w-full text-sm">
                                          {item.quantity}
                                        </span>
                                      </p>
                                      <EditItemQuantityButton
                                        item={item}
                                        type="plus"
                                        optimisticUpdate={updateCartItem}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-1 self-start">
                                  <DeleteItemButton
                                    item={item}
                                    optimisticUpdate={updateCartItem}
                                    variant="text"
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  {/* Footer */}
                  <div className="border-t border-neutral-200 bg-white px-4 pt-4 pb-4">
                    <div className="products-price mb-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-black uppercase">
                        Subtotal
                      </p>
                      <Price
                        className="text-right text-lg md:text-2xl font-medium text-black"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                    <form action={redirectToCheckout}>
                      <CheckoutButton />
                    </form>
                    <PaymentIcons />
                    <p className="text-sm text-neutral-500 text-center mt-3">
                      Shipping, taxes, and discount codes are calculated at
                      checkout
                    </p>
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

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="block w-full rounded-xs bg-black p-3.5 text-center text-sm font-medium uppercase tracking-wide text-white cursor-pointer hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : "Check Out"}
    </button>
  );
}
