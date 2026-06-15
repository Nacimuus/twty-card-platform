"use client";

import { useEffect } from "react";

export function AnalyticsBeacon({ cardId }: { cardId: string }) {
  useEffect(() => {
    // Fire-and-forget view event after page mount.
    // Bonus: most bots don't execute JS, so this naturally filters
    // bot traffic out of analytics.
    fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId, eventType: "view" }),
    }).catch(() => {});
  }, [cardId]);

  return null;
}