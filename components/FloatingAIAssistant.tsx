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
}){
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        step,
        card,
      }),
    });

    const data = await response.json();

    setAnswer(data.answer || "I could not generate an answer.");
  } catch (error) {
    setAnswer("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-[340px] rounded-[2rem] border border-cyan-200 bg-white p-5 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-xl text-white">
              🤖
            </div>

            <div>
              <p className="font-black text-slate-950">Twty AI</p>
              <p className="text-xs font-bold text-slate-400">
                Your card assistant
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {suggestions.slice(0, 3).map((suggestion) => (
              <div
                key={suggestion}
                className="rounded-2xl bg-cyan-50 p-3 text-sm font-bold text-slate-700"
              >
                {suggestion}
              </div>
            ))}
          </div>

          {answer && (
            <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-sm font-bold text-white">
              {answer}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Twty AI..."
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-950 outline-none"
            />

            <button
  onClick={handleAsk}
  disabled={loading}
  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white disabled:opacity-60"
>
  {loading ? "Thinking..." : "Ask"}
</button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-3xl text-white shadow-2xl transition hover:scale-110"
      >
        🤖
      </button>
    </div>
  );
}