"use client";

import { useState } from "react";

export function AIFieldButton({
  field,
  targetName,
  context,
  children,
}: {
  field: string;
  targetName: string;
  context: any;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  async function generateText(event: React.MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.closest("form") as HTMLFormElement | null;
    const target = form?.querySelector(
      `[name="${targetName}"]`
    ) as HTMLInputElement | HTMLTextAreaElement | null;

    if (!form || !target) return;

    const formData = new FormData(form);

    const liveContext = {
      ...context,
      full_name: formData.get("full_name") || context?.full_name || "",
      title: formData.get("title") || context?.title || "",
      bio: formData.get("bio") || context?.bio || "",
      company: formData.get("company") || context?.company || "",
      company_description:
        formData.get("company_description") || context?.company_description || "",
      company_services:
        formData.get("company_services") || context?.company_services || "",
      skills: formData.get("skills") || context?.skills || "",
      website: formData.get("website") || context?.website || "",
    };

    setLoading(true);

    try {
      const response = await fetch("/api/generate-field", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field,
          context: liveContext,
        }),
      });

      const data = await response.json();

      target.value = data.text || "";
      target.dispatchEvent(new Event("input", { bubbles: true }));
    } catch {
      alert("AI generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={generateText}
      disabled={loading}
      className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-100 px-6 py-4 font-black text-cyan-800 transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-800 border-t-transparent" />
      )}

      <span>{loading ? "Generating magic..." : children}</span>
    </button>
  );
}