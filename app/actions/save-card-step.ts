"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ARRAY_FIELDS = new Set(["company_services", "skills"]);
const RESERVED = new Set(["cardId", "nextStep"]);

function toArray(value: FormDataEntryValue | null): string[] {
  return String(value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function saveCardStep(formData: FormData) {
  const cardId = String(formData.get("cardId") || "");
  const nextStep = String(formData.get("nextStep") || "");

  if (!cardId || !nextStep) throw new Error("Missing cardId or nextStep");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Ownership check — defense in depth on top of RLS
  const { data: owned } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", cardId)
    .eq("user_id", user.id)
    .single();
  if (!owned) throw new Error("Card not found or not yours.");

  const updates: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (RESERVED.has(key) || key.startsWith("$ACTION_")) continue;

    // Normalize the legacy companyServices alias
    const normalizedKey =
      key === "companyServices" ? "company_services" : key;

    if (ARRAY_FIELDS.has(normalizedKey)) {
      updates[normalizedKey] = toArray(value);
      continue;
    }

    if (key === "ai_theme") {
      updates.ai_theme = value ? JSON.parse(String(value)) : null;
      updates.theme_mode = value ? "ai" : "generic";
      continue;
    }

    if (key === "generic_theme") {
      updates.generic_theme = String(value);
      if (!formData.get("ai_theme")) updates.theme_mode = "generic";
      continue;
    }

    updates[normalizedKey] = String(value);
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", cardId)
    .eq("user_id", user.id);

  if (error) {
    console.error("SAVE CARD STEP ERROR:", error);
    throw new Error(error.message);
  }

  redirect(`/dashboard/cards/${cardId}/builder/${nextStep}`);
}