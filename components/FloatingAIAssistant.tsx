"use client";

import { useState } from "react";

export function FloatingAIAssistant({
  suggestions = [],
  step,
  card,
}: {
  suggestions?: string[];
  step?: string;
  card?: any;
}) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim() || loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, step, card }),
      });

      const data = await response.json();
      setAnswer(data.answer || "Je n'ai pas pu générer de réponse.");
    } catch {
      setAnswer("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // Hidden on mobile per the original report's recommendation
    <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
      {open && (
        <div className="mb-4 w-[340px] overflow-hidden rounded-2xl border border-pierre-soft bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-pierre-soft p-5">
            <div>
              <p className="font-display text-base">Assistant Palgonic</p>
              <p className="mt-0.5 text-xs text-pierre">
                Conseils pour votre carte
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-pierre transition hover:text-encre"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto p-5">
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-pierre">
                  Suggestions
                </p>
                {suggestions.slice(0, 3).map((suggestion) => (
                  <p
                    key={suggestion}
                    className="rounded-md border border-pierre-soft bg-creme p-3 text-sm leading-relaxed"
                  >
                    {suggestion}
                  </p>
                ))}
              </div>
            )}

            {answer && (
              <div className="mt-4 rounded-md bg-foret p-4 text-sm leading-relaxed text-creme">
                {answer}
              </div>
            )}
          </div>

          {/* Footer input */}
          <div className="border-t border-pierre-soft bg-creme p-3">
            <div className="flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAsk();
                }}
                placeholder="Posez une question…"
                className="min-w-0 flex-1 rounded-md border border-pierre-soft bg-white px-3 py-2 text-sm outline-none transition focus:border-foret"
              />
              <button
                type="button"
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="rounded-md bg-foret px-3 py-2 text-sm font-medium text-creme transition hover:bg-foret-deep disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "…" : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-foret text-creme shadow-xl transition hover:bg-foret-deep"
      >
        <span className="font-display text-sm tracking-wide">
          {open ? "✕" : "IA"}
        </span>
      </button>
    </div>
  );
}
