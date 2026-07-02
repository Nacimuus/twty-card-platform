"use client";

import { useEffect } from "react";
import { writeCart } from "@/lib/cart";

/**
 * Clears the localStorage cart when mounted. Rendered on the order
 * success page so a completed purchase empties the cart, preventing
 * accidental re-orders. Renders nothing.
 */
export function ClearCartOnMount() {
  useEffect(() => {
    writeCart([]);
  }, []);

  return null;
}
