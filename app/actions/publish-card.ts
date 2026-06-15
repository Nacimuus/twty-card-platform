"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function publishCard(formData: FormData) {
  const cardId = String(formData.get("cardId") || "");
  if (!cardId) throw new Error("Missing cardId");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("profiles")
    .update({
      status: "published",
      updated_at: new Date().toISOString(),
    })
    .eq("id", cardId)
    .eq("user_id", user.id)
    .select("slug")
    .single();

  if (error || !data) {
    console.error("PUBLISH CARD ERROR:", error);
    throw new Error(error?.message || "Impossible de publier la carte");
  }

  redirect(
    `/dashboard/cards/${cardId}/builder/review?published=true&slug=${data.slug}`,
  );
}