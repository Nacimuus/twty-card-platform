"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createNewCard(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const cardName =
    String(formData.get("card_name") || "").trim() || "Nouvelle carte";

  const newCardId = crypto.randomUUID();

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: newCardId,
      user_id: user.id,
      card_name: cardName,
      full_name: "",
      title: "",
      bio: "",
      slug: `card-${newCardId}`,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("CREATE CARD ERROR:", error);
    throw new Error(error?.message || "Impossible de créer la carte");
  }

  redirect(`/dashboard/cards/${data.id}/builder/identity`);
}