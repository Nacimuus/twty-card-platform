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
      className="flex-1 rounded-md bg-foret px-6 py-2.5 text-sm font-medium text-creme transition hover:bg-foret-deep disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Création…" : "Créer ma carte"}
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
        className="inline-flex items-center gap-2 rounded-md bg-foret px-5 py-2.5 text-sm font-medium text-creme transition hover:bg-foret-deep"
      >
        <span className="text-base leading-none">+</span>
        <span>Nouvelle carte</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-encre/60 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-pierre-soft bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl text-encre">
              Nommez votre carte
            </h2>

            <p className="mt-2 text-sm text-pierre">
              Donnez un nom clair à votre carte avant de commencer.
            </p>

            <form action={createNewCard} className="mt-6">
              <label className="block">
                <span className="block text-xs font-medium text-pierre">
                  Nom de la carte
                </span>
                <input
                  name="card_name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Ex : Carte consulting"
                  autoFocus
                  className="mt-2 w-full rounded-md border border-pierre-soft bg-creme px-4 py-3 text-sm outline-none transition placeholder:text-pierre/50 focus:border-foret"
                />
              </label>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-md border border-pierre-soft px-6 py-2.5 text-sm font-medium text-encre transition hover:border-foret hover:text-foret"
                >
                  Annuler
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
