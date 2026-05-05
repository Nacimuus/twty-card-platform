"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function createNewCard(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const cardName = String(formData.get("card_name") || "").trim();

  if (!cardName) {
    throw new Error("Card name is required");
  }

  const newCardId = crypto.randomUUID();

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: newCardId,
      clerk_user_id: userId,
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
    throw new Error(error?.message || "Could not create card");
  }

  redirect(`/dashboard/cards/${data.id}/builder/identity`);
}