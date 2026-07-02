"use client";

import { useCallback, useEffect, useState } from "react";
import { readCart, writeCart, CART_EVENT, type CartItem } from "@/lib/cart";

/**
 * Reads the localStorage cart and stays in sync across components
 * and browser tabs. Starts empty on the server (no localStorage),
 * hydrates on mount — `hydrated` tells you when it's safe to show counts.
 */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setHydrated(true);

    const sync = () => setItems(readCart());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync); // other tabs
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((item: CartItem) => {
    const next = [...readCart(), item];
    writeCart(next);
    setItems(next);
  }, []);

  const remove = useCallback((id: string) => {
    const next = readCart().filter((i) => i.id !== id);
    writeCart(next);
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    writeCart([]);
    setItems([]);
  }, []);

  const count = items.length;
  const total = Math.round(items.reduce((s, i) => s + i.price, 0) * 100) / 100;

  return { items, count, total, add, remove, clear, hydrated };
}
