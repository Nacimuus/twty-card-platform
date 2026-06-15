"use client";

import type { ComputedTheme } from "@/lib/themes";

export function SaveContactButton({
  slug,
  cardId,
  label,
  theme,
}: {
  slug: string;
  cardId: string;
  label: string;
  theme: ComputedTheme;
}) {
  function handleClick() {
    // Fire-and-forget analytics — don't block the download on tracking
    fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId, eventType: "vcard_download" }),
    }).catch(() => {});

    // Trigger vCard download
    window.location.href = `/api/vcard/${slug}`;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition hover:opacity-90"
      style={{
        backgroundColor: theme.accent,
        color: theme.accentForeground,
      }}
    >
      {label}
    </button>
  );
}