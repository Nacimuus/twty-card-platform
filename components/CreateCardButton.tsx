"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createNewCard } from "@/app/actions/create-new-card";

function SubmitButton({ cardName }: { cardName: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || !cardName.trim()}
      className="w-full rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Creating your card..." : "Create my card ✨"}
    </button>
  );
}

export function CreateCardButton() {
  const [open, setOpen] = useState(false);
  const [cardName, setCardName] = useState("");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:scale-[1.02]"
      >
        ＋ Create New Card
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950 p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-white">
              Name your card
            </h2>

            <p className="mt-2 text-sm text-white/60">
              Give your card a clear identity before starting.
            </p>

<form action={createNewCard}>
  <input type="hidden" name="card_name" value={cardName} />

  <input
    name="card_name_visible"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Example: Consulting Card"
                className="mt-6 w-full rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
              />

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-6 py-4 font-black text-white"
                >
                  Cancel
                </button>

                <SubmitButton cardName={cardName} />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}