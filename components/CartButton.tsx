"use client";

import Link from "next/link";
import { useCart } from "@/components/useCart";

export function CartButton() {
  const { count, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="Panier"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-pierre-soft text-encre transition hover:border-foret hover:text-foret"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {hydrated && count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-corail px-1 text-xs font-medium text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
