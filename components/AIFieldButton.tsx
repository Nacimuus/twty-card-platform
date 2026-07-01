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
      `[name="${targetName}"]`,
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
        formData.get("company_description") ||
        context?.company_description ||
        "",
      company_services:
        formData.get("company_services") || context?.company_services || "",
      skills: formData.get("skills") || context?.skills || "",
      website: formData.get("website") || context?.website || "",
    };

    setLoading(true);

    try {
      const response = await fetch("/api/generate-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, context: liveContext }),
      });

      if (!response.ok) {
        // Preserve user's existing text — do NOT wipe it
        alert(
          "Génération impossible pour le moment. Réessayez dans un instant.",
        );
        return;
      }

      const data = await response.json();

      // Only overwrite if we actually got usable text back
      if (data.text && typeof data.text === "string" && data.text.trim()) {
        target.value = data.text;
        target.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        alert("La génération n'a rien renvoyé. Réessayez.");
      }
    } catch {
      // Network error — preserve user's text
      alert("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={generateText}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 self-start rounded-md border border-pierre-soft bg-creme px-4 py-2 text-sm font-medium text-foret transition hover:border-foret hover:bg-foret/5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-foret border-t-transparent" />
      )}
      <span>{loading ? "Génération…" : children}</span>
    </button>
  );
}
