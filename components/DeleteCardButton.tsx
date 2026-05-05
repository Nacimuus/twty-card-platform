"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function DeleteCardButton({ cardId }: { cardId: string }) {
  const router = useRouter();

  async function deleteCard() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this card? This cannot be undone."
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", cardId);

    if (error) {
      alert("Error deleting card: " + error.message);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={deleteCard}
      className="rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700 hover:bg-red-200"
    >
      Delete
    </button>
  );
}