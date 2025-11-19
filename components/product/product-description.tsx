"use client";
/* eslint-disable prettier/prettier */
import { useState } from "react";
import { Product } from "../../lib/shopify/types";
import Price from "../grid/parts/price";
import VariantSelector from "./variant-selector";
import Prose from "../ui/prose";
import { AddToCart } from "../cart/add-to-cart";

export function ProductDescription({ product }: { product: Product }) {
  // const firstVariant = product.variants?.[0];
  // const sku = firstVariant?.sku;
  const firstVariant = product.variants?.[0];
  const netWeight = firstVariant?.weight
    ? `${firstVariant.weight} ${firstVariant.weightUnit}`
    : "";

  const getMetafieldValue = (key: string) => {
    return product.metafields?.find((m) => m?.key === key)?.value || "";
  };

  const ceremonial = getMetafieldValue("ceremonial_type");
  const origin = getMetafieldValue("origin");
  const notes = getMetafieldValue("notes");
  const appellation = getMetafieldValue("appellation");
  const capacity = getMetafieldValue("capacity");
  const medium = getMetafieldValue("medium");
  const size = getMetafieldValue("size");

  const showTopRow = ceremonial || origin || netWeight;
  // --- Kiểm tra sản phẩm có thuộc collection "teaware" ---
  const isTeaware = product.collections?.some(
    (c) => c.handle.toLowerCase() === "teaware"
  );

  const [purchaseType, setPurchaseType] = useState("oneTime");
  const [purchasePrice, setPurchasePrice] = useState(
    parseFloat(product.variants[0].price.amount)
  );

  const hasSubscription =
    product.sellingPlanGroups?.edges.some(
      (group) => group.node.sellingPlans.edges.length > 0
    ) ?? false;

  // Helper function to format delivery cycle
  const formatDeliveryCycle = (plan: {
    billingPolicy?: { interval: string; intervalCount: number } | null;
    options?: { name: string; value: string }[];
  }) => {
    // Check if billingPolicy exists
    if (plan.billingPolicy) {
      const { interval, intervalCount } = plan.billingPolicy;
      if (interval === "WEEK") {
        if (intervalCount === 2) return "Deliver every 2 weeks";
        if (intervalCount === 6) return "Deliver every 6 weeks";
        return `Deliver every ${intervalCount} weeks`;
      }
      if (interval === "MONTH") {
        if (intervalCount === 1) return "Deliver every 1 month";
        return `Deliver every ${intervalCount} months`;
      }
      if (interval === "YEAR") {
        if (intervalCount === 1) return "Deliver every 1 year";
        return `Deliver every ${intervalCount} years`;
      }
    }
    // Fallback to options if billingPolicy not available
    if (plan.options && plan.options.length > 0) {
      const deliveryOption = plan.options.find(
        (opt) =>
          opt.name.toLowerCase().includes("delivery") ||
          opt.name.toLowerCase().includes("giao")
      );
      if (deliveryOption) return deliveryOption.value;
    }
    return "Recurring delivery";
  };

  // Helper function to format subscription description
  const formatSubscriptionDescription = (
    plan: {
      billingPolicy?: { interval: string; intervalCount: number } | null;
      options?: { name: string; value: string }[];
    },
    productTitle: string,
    quantity: number = 1
  ) => {
    let intervalText = "";

    if (plan.billingPolicy) {
      const { interval, intervalCount } = plan.billingPolicy;

      if (interval === "WEEK") {
        intervalText = intervalCount === 1 ? "week" : `${intervalCount} weeks`;
      } else if (interval === "MONTH") {
        intervalText =
          intervalCount === 1 ? "month" : `${intervalCount} months`;
      } else if (interval === "YEAR") {
        intervalText = intervalCount === 1 ? "year" : `${intervalCount} years`;
      }
    }

    if (intervalText) {
      const quantityText = quantity === 1 ? "" : `${quantity} `;
      return `${quantityText}${productTitle} delivered to you every ${intervalText}. Pause, reschedule, or cancel at anytime.`;
    }

    return "Pause, reschedule, or cancel at anytime.";
  };

  // Helper function to get discount display text
  const getDiscountText = (
    adjustment:
      | {
          __typename: string;
          adjustmentPercentage?: number;
          adjustmentAmount?: { amount: string; currencyCode: string };
          price?: { amount: string; currencyCode: string };
        }
      | null
      | undefined,
    originalPrice: number,
    currencyCode: string
  ) => {
    if (!adjustment) return null;

    if (
      adjustment.__typename === "SellingPlanPercentagePriceAdjustment" &&
      adjustment.adjustmentPercentage
    ) {
      return `-${Math.round(adjustment.adjustmentPercentage)}%`;
    } else if (
      adjustment.__typename === "SellingPlanFixedAmountPriceAdjustment" &&
      adjustment.adjustmentAmount
    ) {
      return `-${adjustment.adjustmentAmount.amount} ${adjustment.adjustmentAmount.currencyCode || currencyCode}`;
    } else if (adjustment.__typename === "SellingPlanFixedPriceAdjustment") {
      const fixedPriceAdj = adjustment as {
        __typename: "SellingPlanFixedPriceAdjustment";
        price?: { amount: string; currencyCode: string };
      };
      if (fixedPriceAdj.price) {
        // For fixed price, calculate discount percentage from original price
        const fixedPrice = parseFloat(fixedPriceAdj.price.amount);
        const discountPercent = Math.round(
          ((originalPrice - fixedPrice) / originalPrice) * 100
        );
        if (discountPercent > 0) {
          return `-${discountPercent}%`;
        }
      }
      return null;
    }

    return null;
  };

  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (
    adjustment:
      | {
          __typename: string;
          adjustmentPercentage?: number;
          adjustmentAmount?: { amount: string; currencyCode: string };
          price?: { amount: string; currencyCode: string };
        }
      | null
      | undefined,
    originalPrice: number
  ): number => {
    if (!adjustment) return originalPrice;

    if (adjustment.__typename === "SellingPlanPercentagePriceAdjustment") {
      return originalPrice * (1 - (adjustment.adjustmentPercentage ?? 0) / 100);
    } else if (
      adjustment.__typename === "SellingPlanFixedAmountPriceAdjustment"
    ) {
      if (adjustment.adjustmentAmount) {
        return originalPrice - parseFloat(adjustment.adjustmentAmount.amount);
      }
    } else if (adjustment.__typename === "SellingPlanFixedPriceAdjustment") {
      const fixedPriceAdj = adjustment as unknown as {
        __typename: "SellingPlanFixedPriceAdjustment";
        price?: { amount: string; currencyCode: string };
      };
      if (fixedPriceAdj.price) {
        return parseFloat(fixedPriceAdj.price.amount);
      }
    }

    return originalPrice;
  };

  return (
    <>
      {isTeaware && product.descriptionHtml ? (
        <div className="px-6 font-text-product-detail flex flex-col md:flex-row items-center md:items-start justify-between md:gap-10">
          <div className="basis-4/6">
            <div className="flex justify-between py-6 md:px-0 border-b border-b-neutral-300">
              <h1 className="text-2xl md:text-4xl font-medium uppercase">
                {product.title}
              </h1>
              <div className="products-price font-medium text-lg text-black">
                <Price
                  amount={product.priceRange.maxVariantPrice.amount}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                />
              </div>
            </div>
            <div className="py-6 md:px-0 flex justify-between gap-2 md:gap-16 flex-col md:flex-row">
              <div className="basis-4/6">
                {product.descriptionHtml ? (
                  <Prose
                    className="mb-2 text-md leading-light "
                    html={product.descriptionHtml}
                  />
                ) : null}
              </div>
              <div className="text-md text-neutral-700 basis-2/6">
                {medium && (
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Medium:</span>
                    <span className="italic">{medium}</span>
                  </p>
                )}
                {origin && (
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Origin:</span>
                    <span className="italic">{origin}</span>
                  </p>
                )}
                {size && (
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Size:</span>
                    <span className="italic">{size}</span>
                  </p>
                )}
                {capacity && (
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Capacity:</span>
                    <span className="italic">{capacity}</span>
                  </p>
                )}
                {netWeight && (
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Weight:</span>
                    <span className="italic">{netWeight}</span>
                  </p>
                )}
              </div>
            </div>
            <VariantSelector
              options={product.options}
              variants={product.variants}
            />
          </div>
          <div className="basis-2/6 py-6">
            {/* --- Subscription Option --- */}
            {hasSubscription && (
              <div className="border border-neutral-300 p-4 rounded-sm space-y-3 mb-6">
                <h3 className="font-medium text-sm uppercase mb-2">
                  purchase options
                </h3>
                <label
                  className={`flex items-start gap-3 cursor-pointer p-3 rounded border-2 transition-all ${
                    purchaseType === "oneTime"
                      ? "border-black bg-neutral-100"
                      : "border-transparent hover:border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="purchaseOption"
                    value="oneTime"
                    checked={purchaseType === "oneTime"}
                    onChange={() => {
                      setPurchaseType("oneTime");
                      setPurchasePrice(
                        parseFloat(product.variants[0].price.amount)
                      );
                    }}
                    className="mt-1 w-4 h-4 accent-black border-neutral-300 focus:ring-black focus:ring-2 checked:bg-black checked:border-black"
                  />
                  <div className="flex-1">
                    <div className="font-medium">One-time purchase</div>
                    <div className="text-sm text-neutral-600">
                      {product.variants[0].price.amount}{" "}
                      {product.variants[0].price.currencyCode}
                    </div>
                  </div>
                </label>

                {product.sellingPlanGroups?.edges[0]?.node.sellingPlans.edges.map(
                  ({ node: plan }) => {
                    const adjustment =
                      plan.priceAdjustments?.[0]?.adjustmentValue;
                    const originalPrice = parseFloat(
                      product.variants[0].price.amount
                    );
                    const discountedPrice = parseFloat(
                      calculateDiscountedPrice(
                        adjustment,
                        originalPrice
                      ).toFixed(2)
                    );
                    const discountText = getDiscountText(
                      adjustment,
                      originalPrice,
                      product.variants[0].price.currencyCode
                    );
                    const deliveryCycle = formatDeliveryCycle(plan);
                    const subscriptionDescription =
                      formatSubscriptionDescription(plan, product.title, 1);

                    return (
                      <label
                        className={`flex items-start gap-3 cursor-pointer p-3 rounded border-2 transition-all ${
                          purchaseType === plan.id
                            ? "border-black bg-neutral-100"
                            : "border-transparent hover:border-neutral-200 hover:bg-neutral-50"
                        }`}
                        key={plan.id}
                      >
                        <input
                          type="radio"
                          name="purchaseOption"
                          value={plan.id}
                          checked={purchaseType === plan.id}
                          onChange={() => {
                            setPurchaseType(plan.id);
                            setPurchasePrice(discountedPrice);
                          }}
                          className="mt-1 w-4 h-4 accent-black border-neutral-300 focus:ring-black focus:ring-2 checked:bg-black checked:border-black"
                        />
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            <span>Subscribe & Save</span>
                            {discountText && (
                              <span className="text-emerald-600 text-xs font-semibold">
                                {discountText}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {deliveryCycle}
                          </div>
                          <div className="text-sm font-medium text-neutral-800 mt-1">
                            {discountedPrice}{" "}
                            {product.variants[0].price.currencyCode}
                          </div>
                          <div className="text-sm text-neutral-500 mt-1 italic">
                            {subscriptionDescription}
                          </div>
                        </div>
                      </label>
                    );
                  }
                )}
              </div>
            )}
            <AddToCart
              product={product}
              purchaseType={purchaseType}
              purchasePrice={purchasePrice}
            />
          </div>
        </div>
      ) : (
        <div className="px-6 font-text-product-detail">
          {showTopRow && (
            <div
              className="flex justify-between gap-4 text-md text-neutral-700 border-b border-b-neutral-300 py-3
      border-t border-t-neutral-300 uppercase "
            >
              <p>{ceremonial}</p>
              <p>{origin}</p>
              <p>{netWeight}</p>
            </div>
          )}
          <div className="flex flex-col items-center py-6 ">
            <h1 className="text-2xl md:text-4xl font-medium uppercase">
              {product.title}
            </h1>
          </div>
          <div
            className="flex justify-between text-md text-neutral-700 border-b border-b-neutral-300 py-3
      border-t border-t-neutral-300
      "
          >
            <p>
              <span className="uppercase">Notes:</span> <br />
              <span className="italic">{notes}</span>
            </p>
            <p>
              <span className="uppercase">Appellation:</span> <br />
              <span className="italic">{appellation}</span>
            </p>
          </div>
          <VariantSelector
            options={product.options}
            variants={product.variants}
          />

          <div className="products-price flex items-center justify-center gap-5 py-6 font-medium text-lg text-black">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
          {/* --- Subscription Option --- */}
          {hasSubscription && (
            <div className="border border-neutral-300 p-4 rounded-sm space-y-3 mb-6">
              <h3 className="font-medium text-sm uppercase mb-2">
                purchase options
              </h3>
              <label
                className={`flex items-start gap-3 cursor-pointer p-3 rounded border-2 transition-all ${
                  purchaseType === "oneTime"
                    ? "border-black bg-neutral-100"
                    : "border-transparent hover:border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <input
                  type="radio"
                  name="purchaseOption"
                  value="oneTime"
                  checked={purchaseType === "oneTime"}
                  onChange={() => {
                    setPurchaseType("oneTime");
                    setPurchasePrice(
                      parseFloat(product.variants[0].price.amount)
                    );
                  }}
                  className="mt-1 w-4 h-4 accent-black border-neutral-300 focus:ring-black focus:ring-2 checked:bg-black checked:border-black"
                />
                <div className="flex-1">
                  <div className="font-medium">One-time purchase</div>
                  <div className="text-sm text-neutral-600">
                    {product.variants[0].price.amount}{" "}
                    {product.variants[0].price.currencyCode}
                  </div>
                </div>
              </label>

              {product.sellingPlanGroups?.edges[0]?.node.sellingPlans.edges.map(
                ({ node: plan }) => {
                  const adjustment =
                    plan.priceAdjustments?.[0]?.adjustmentValue;
                  const originalPrice = parseFloat(
                    product.variants[0].price.amount
                  );
                  const discountedPrice = parseFloat(
                    calculateDiscountedPrice(adjustment, originalPrice).toFixed(
                      2
                    )
                  );
                  const discountText = getDiscountText(
                    adjustment,
                    originalPrice,
                    product.variants[0].price.currencyCode
                  );
                  const deliveryCycle = formatDeliveryCycle(plan);
                  const subscriptionDescription = formatSubscriptionDescription(
                    plan,
                    product.title,
                    1
                  );

                  return (
                    <label
                      className={`flex items-start gap-3 cursor-pointer p-3 rounded border-2 transition-all ${
                        purchaseType === plan.id
                          ? "border-black bg-neutral-100"
                          : "border-transparent hover:border-neutral-200 hover:bg-neutral-50"
                      }`}
                      key={plan.id}
                    >
                      <input
                        type="radio"
                        name="purchaseOption"
                        value={plan.id}
                        checked={purchaseType === plan.id}
                        onChange={() => {
                          setPurchaseType(plan.id);
                          setPurchasePrice(discountedPrice);
                        }}
                        className="mt-1 w-4 h-4 accent-black border-neutral-300 focus:ring-black focus:ring-2 checked:bg-black checked:border-black"
                      />
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          <span>Subscribe & Save</span>
                          {discountText && (
                            <span className="text-emerald-600 text-xs font-semibold">
                              {discountText}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {deliveryCycle}
                        </div>
                        <div className="text-sm font-medium text-neutral-800 mt-1">
                          {discountedPrice}{" "}
                          {product.variants[0].price.currencyCode}
                        </div>
                        <div className="text-sm text-neutral-500 mt-1 italic">
                          {subscriptionDescription}
                        </div>
                      </div>
                    </label>
                  );
                }
              )}
            </div>
          )}
          <AddToCart
            product={product}
            purchaseType={purchaseType}
            purchasePrice={purchasePrice}
          />
        </div>
      )}
    </>
  );
}
