"use client";

import { QRCodeSVG } from "qrcode.react";
import type { SideElements } from "@/lib/card-pricing";

export type CardData = {
  full_name: string | null;
  title: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  profile_image: string | null;
  company_logo: string | null;
  cardUrl: string; // full public URL for the QR code
};

/**
 * Renders ONE side of the physical NFC card — a black credit-card-shaped
 * rectangle with off-white text/elements. `isBack` controls the label.
 */
export function PhysicalCardPreview({
  side,
  data,
  elements,
  finish,
  label,
}: {
  side: "front" | "back";
  data: CardData;
  elements: SideElements;
  finish: "engraving" | "printing";
  label: string;
}) {
  // Engraving = subtle etched grey. Printing = brighter white/crisp.
  const inkColor = finish === "engraving" ? "#C7C4BE" : "#FAF7F2";
  const inkMuted = finish === "engraving" ? "#8A8580" : "#B8B4AD";

  return (
    <div className="w-full">
      <p className="mb-2 text-xs uppercase tracking-widest text-pierre">
        {label}
      </p>
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
        style={{
          aspectRatio: "1.586 / 1", // standard credit card ratio
          background:
            "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 55%, #000 100%)",
          border: "1px solid #2a2a2a",
        }}
      >
        {/* Front always shows the name (free). Back shows name only if it's the front. */}
        <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
          {/* Top row — name/title (front) + logo */}
          <div className="flex items-start justify-between gap-3">
            {side === "front" ? (
              <div className="min-w-0">
                <p
                  className="truncate font-display text-lg leading-tight sm:text-xl"
                  style={{ color: inkColor }}
                >
                  {data.full_name || "Votre nom"}
                </p>
                {data.title && (
                  <p
                    className="mt-0.5 truncate text-xs sm:text-sm"
                    style={{ color: inkMuted }}
                  >
                    {data.title}
                  </p>
                )}
              </div>
            ) : (
              <div />
            )}

            {elements.logo && (
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:h-12 sm:w-12"
                style={{ border: `1px solid ${inkMuted}` }}
              >
                {data.company_logo || data.profile_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.company_logo || data.profile_image || ""}
                    alt="Logo"
                    className="h-full w-full object-contain opacity-90"
                  />
                ) : (
                  <span
                    className="text-[9px] uppercase tracking-wide"
                    style={{ color: inkMuted }}
                  >
                    Logo
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom row — contact + date (left) and QR (right) */}
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              {elements.contact && (
                <>
                  {data.email && (
                    <p
                      className="truncate text-[10px] sm:text-xs"
                      style={{ color: inkMuted }}
                    >
                      {data.email}
                    </p>
                  )}
                  {data.phone && (
                    <p
                      className="truncate text-[10px] sm:text-xs"
                      style={{ color: inkMuted }}
                    >
                      {data.phone}
                    </p>
                  )}
                  {data.website && (
                    <p
                      className="truncate text-[10px] sm:text-xs"
                      style={{ color: inkMuted }}
                    >
                      {data.website}
                    </p>
                  )}
                </>
              )}
              {elements.date && (
                <p
                  className="text-[10px] sm:text-xs"
                  style={{ color: inkMuted }}
                >
                  {new Date().toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>

            {elements.qr && (
              <div className="shrink-0 rounded-md bg-white p-1.5">
                <QRCodeSVG
                  value={data.cardUrl}
                  size={44}
                  fgColor="#0d0d0d"
                  bgColor="#ffffff"
                  level="M"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
