"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function saveCardStep(formData: FormData) {
  const cardId = formData.get("cardId") as string;
  const nextStep = formData.get("nextStep") as string;

const updates: Record<string, any> = {};

for (const [key, value] of formData.entries()) {
  if (
    key === "cardId" ||
    key === "nextStep" ||
    key.startsWith("$ACTION_")
  ) {
    continue;
  }

  if (
    key === "companyServices" ||
    key === "company_services" ||
    key.toLowerCase().includes("service")
  ) {
const services = String(value)
  .split(",")
  .map((service) => service.trim())
  .filter(Boolean);

updates.company_services = services.length > 0 ? services : [];

    continue;
  }
if (key === "ai_theme") {
  updates.ai_theme = value ? JSON.parse(String(value)) : null;
  updates.theme_mode = value ? "ai" : "generic";
  continue;
}

if (key === "generic_theme") {
  updates.generic_theme = String(value);
  if (!formData.get("ai_theme")) {
    updates.theme_mode = "generic";
  }
  continue;
}
  updates[key] = String(value);
}


if (typeof updates.company_services === "string") {
  updates.company_services = updates.company_services
    .split(",")
    .map((service: string) => service.trim())
    .filter(Boolean);
}

if (typeof updates.companyServices === "string") {
  updates.company_services = updates.companyServices
    .split(",")
    .map((service: string) => service.trim())
    .filter(Boolean);

  delete updates.companyServices;
}
delete updates.companyServices;
const arrayFields = ["company_services", "skills"];

for (const field of arrayFields) {
  if (typeof updates[field] === "string") {
    updates[field] = updates[field]
      .split(",")
      .map((item: string) => item.trim())
      .filter(Boolean);
  }

  if (updates[field] === "") {
    updates[field] = [];
  }
}
console.log("UPDATES BEFORE SAVE:", updates);


  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", cardId);

  if (error) {
    console.error("SAVE CARD STEP ERROR:", error);
    throw new Error(error.message);
  }

  redirect(`/dashboard/cards/${cardId}/builder/${nextStep}`);
}