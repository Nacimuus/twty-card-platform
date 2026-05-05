"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function publishCard(formData: FormData) {
  const cardId = formData.get("cardId") as string;

  if (!cardId) {
    throw new Error("Missing cardId");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      status: "published",
      updated_at: new Date().toISOString(),
    })
    .eq("id", cardId)
    .select();

  if (error) {
    console.error("PUBLISH CARD ERROR:", error);
    throw new Error(error.message);
  }

  redirect("/dashboard?published=true");
}