/* eslint-disable prettier/prettier */
"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} from "../../lib/shopify/types";
import { createContext, use, useContext, useMemo, useOptimistic } from "react";

type UpdateType = "plus" | "minus" | "delete";

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (
    variant: ProductVariant,
    product: Product,
    quantity?: number,
    sellingPlanId?: string,
    priceOverride?: number
  ) => void;
};
type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: {
        variant: ProductVariant;
        product: Product;
        quantity?: number;
        sellingPlanId?: string;
        priceOverride?: number;
      };
    };

const CartContext = createContext<CartContextType | undefined>(undefined);

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

// Helper function to compare selectedOptions regardless of order
function areSelectedOptionsEqual(
  options1: { name: string; value: string }[],
  options2: { name: string; value: string }[]
): boolean {
  if (options1.length !== options2.length) return false;

  // Sort both arrays by name for consistent comparison
  const sorted1 = [...options1].sort((a, b) => a.name.localeCompare(b.name));
  const sorted2 = [...options2].sort((a, b) => a.name.localeCompare(b.name));

  return sorted1.every(
    (opt, index) =>
      opt.name === sorted2[index].name && opt.value === sorted2[index].value
  );
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType
): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;

  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString()
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function updateCartTotals(
  lines: CartItem[]
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );

  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function getPriceForVariant(
  variant: ProductVariant,
  product: Product,
  sellingPlanId?: string
): number {
  let price = parseFloat(variant.price.amount);
  if (!sellingPlanId) return price;

  for (const groupEdge of product.sellingPlanGroups?.edges || []) {
    const group = groupEdge.node;
    const planEdge = group.sellingPlans.edges.find(
      (p) => p.node.id === sellingPlanId
    );
    if (!planEdge) continue;
    const plan = planEdge.node;

    for (const adjObj of plan.priceAdjustments || []) {
      const adj = adjObj.adjustmentValue;
      if (!adj) continue;

      if (adj.__typename === "SellingPlanPercentagePriceAdjustment") {
        price = price * (1 - (adj.adjustmentPercentage ?? 0) / 100);
      } else if (adj.__typename === "SellingPlanFixedAmountPriceAdjustment") {
        if (adj.adjustmentAmount) {
          price = price - parseFloat(adj.adjustmentAmount.amount);
        }
      } else if (adj.__typename === "SellingPlanFixedPriceAdjustment") {
        if (adj.price) {
          // Fixed price: use the price directly
          price = parseFloat(adj.price.amount);
        }
      }
    }

    break;
  }
  return parseFloat(price.toFixed(2));
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
  quantity: number,
  sellingPlanId?: string,
  priceOverride?: number
): CartItem {
  // const quantity = existingItem ? existingItem.quantity + 1 : 1;
  // const totalAmount = calculateItemCost(quantity, variant.price.amount);
  // const newQuantity = existingItem
  //   ? existingItem.quantity + quantity
  //   : quantity;
  // const totalAmount = calculateItemCost(newQuantity, variant.price.amount);
  const newQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  // Nếu có priceOverride, bỏ sellingPlanId để cart popup hiển thị đúng giá
  const useSellingPlanId = sellingPlanId;

  const price =
    priceOverride !== undefined
      ? priceOverride
      : getPriceForVariant(variant, product, sellingPlanId);

  const totalAmount = (price * newQuantity).toFixed(2);

  return {
    id: existingItem?.id,
    quantity: newQuantity,
    // quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
    sellingPlanId: useSellingPlanId,
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateCartItem(item, updateType)
            : item
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: "0" },
          },
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "ADD_ITEM": {
      const {
        variant,
        product,
        quantity = 1,
        sellingPlanId,
        priceOverride,
      } = action.payload;
      // Luôn tìm existingItem dựa trên variant.id, sellingPlanId và selectedOptions
      // để merge đúng, bất kể có priceOverride hay không
      const existingItem = currentCart.lines.find(
        (item) =>
          item.merchandise.id === variant.id &&
          item.sellingPlanId === sellingPlanId &&
          areSelectedOptionsEqual(
            item.merchandise.selectedOptions,
            variant.selectedOptions
          )
      );

      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
        quantity,
        sellingPlanId,
        priceOverride
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id &&
            item.sellingPlanId === sellingPlanId &&
            areSelectedOptionsEqual(
              item.merchandise.selectedOptions,
              variant.selectedOptions
            )
              ? updatedItem
              : item
          )
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer
  );

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    updateOptimisticCart({
      type: "UPDATE_ITEM",
      payload: { merchandiseId, updateType },
    });
  };

  const addCartItem = (
    variant: ProductVariant,
    product: Product,
    quantity: number = 1,
    sellingPlanId?: string,
    priceOverride?: number
  ) => {
    updateOptimisticCart({
      type: "ADD_ITEM",
      payload: { variant, product, quantity, sellingPlanId, priceOverride },
    });
  };

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
    }),
    [optimisticCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
