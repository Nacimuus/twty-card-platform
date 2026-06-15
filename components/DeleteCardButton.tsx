"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteCardButton({ cardId }: { cardId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function deleteCard() {
    const confirmed = window.confirm(
      "Supprimer cette carte ? Cette action est définitive.",
    );
    if (!confirmed) return;

    setDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", cardId);

    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
      setDeleting(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={deleteCard}
      disabled={deleting}
      className="text-xs text-pierre transition hover:text-corail-deep disabled:opacity-50"
    >
      {deleting ? "Suppression…" : "Supprimer"}
    </button>
  );
}