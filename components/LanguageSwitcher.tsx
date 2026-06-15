"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import type { ComputedTheme } from "@/lib/themes";

export function LanguageSwitcher({
  current,
  theme,
}: {
  current: Lang;
  theme: ComputedTheme;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchTo(lang: Lang) {
    const params = new URLSearchParams(searchParams.toString());
    if (lang === "fr") {
      // French is default — keep URL clean
      params.delete("lang");
    } else {
      params.set("lang", lang);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border p-0.5 text-xs font-medium"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.surface,
      }}
    >
      {(["fr", "en"] as const).map((lang) => {
        const active = current === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => switchTo(lang)}
            aria-pressed={active}
            className="rounded-full px-3 py-1 uppercase tracking-wider transition"
            style={{
              backgroundColor: active ? theme.accent : "transparent",
              color: active ? theme.accentForeground : theme.muted,
            }}
          >
            {lang}
          </button>
        );
      })}
    </div>
  );
}