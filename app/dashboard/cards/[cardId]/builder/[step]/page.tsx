import { BuilderLiveClient } from "@/components/BuilderLiveClient";
import { builderSteps } from "@/lib/builder-steps";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { FloatingAIAssistant } from "@/components/FloatingAIAssistant";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ cardId: string; step: string }>;
}) {
  const { cardId, step } = await params;

  if (!builderSteps.some((s) => s.id === step)) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: card, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", cardId)
    .eq("user_id", user.id)
    .single();

  if (error || !card) notFound();

  const builderSuggestions =
    step === "identity"
      ? [
          "Utilisez votre vrai nom complet.",
          "Un titre clair et recherchable.",
          "La première impression compte.",
        ]
      : step === "company"
        ? [
            "Expliquez clairement ce que fait votre entreprise.",
            "Restez simple et crédible.",
            "Montrez la valeur rapidement.",
          ]
        : ["Complétez cette étape avec soin."];

  return (
    <>
      <BuilderLiveClient card={card} step={step} cardId={cardId} />
      <FloatingAIAssistant
        suggestions={builderSuggestions}
        step={step}
        card={card}
      />
    </>
  );
}