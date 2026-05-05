"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function publishCard(formData: FormData) {
  const cardId = formData.get("cardId") as string;

  if (!cardId) {
    throw new Error("Missing cardId");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      status: "published",
      updated_at: new Date().toISOString(),
    })
    .eq("id", cardId)
    .select("slug")
    .single();

  if (error || !data) {
    console.error("PUBLISH CARD ERROR:", error);
    throw new Error(error?.message || "Could not publish card");
  }
console.log("PUBLISH REDIRECT TO REVIEW:", cardId, data.slug);
  redirect(`/dashboard/cards/${cardId}/builder/review?published=true&slug=${data.slug}`);
}