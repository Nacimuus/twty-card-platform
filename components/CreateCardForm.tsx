"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateCardForm() {
  const [cardName, setCardName] = useState("");
  const router = useRouter();

  function continueToMissions() {
    if (!cardName.trim()) return;
    router.push(`/dashboard/create?cardName=${encodeURIComponent(cardName)}`);
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      <input
        type="text"
        placeholder="Example: Twty Consulting"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        className="rounded-2xl border border-slate-200 px-5 py-4 text-base font-bold outline-none transition focus:border-slate-950"
      />

      <button
        type="button"
        onClick={continueToMissions}
        className="rounded-2xl bg-slate-950 px-7 py-4 text-center font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-slate-800 active:scale-95"
      >
        Continue to missions
      </button>
    </div>
  );
}