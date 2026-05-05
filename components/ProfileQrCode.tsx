"use client";

import { QRCodeCanvas } from "qrcode.react";

export function ProfileQrCode({ slug }: { slug: string }) {
  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/u/${slug}`
      : `/u/${slug}`;

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <div className="bg-white p-3 rounded-2xl">
        <QRCodeCanvas value={profileUrl} size={140} />
      </div>

      <p className="text-xs text-white/50">
        Scan to open this card
      </p>
    </div>
  );
}