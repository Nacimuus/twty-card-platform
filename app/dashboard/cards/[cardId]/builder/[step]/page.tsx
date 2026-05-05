import { BuilderLiveClient } from "@/components/BuilderLiveClient";
import { builderSteps } from "@/lib/builder-steps";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { FloatingAIAssistant } from "@/components/FloatingAIAssistant";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ cardId: string; step: string }>;
}) {
  const { cardId, step } = await params;

  const stepExists = builderSteps.some((item) => item.id === step);

  if (!stepExists) {
    notFound();
  }

  const { data: card, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", cardId)
    .single();

  if (error || !card) {
    notFound();
  }

const builderSuggestions =
  step === "identity"
    ? [
        "Use your real full name.",
        "Your title should be clear and searchable.",
        "Strong first impressions matter.",
      ]
    : step === "company"
    ? [
        "Explain what your company does clearly.",
        "Keep it simple and credible.",
        "Show value fast.",
      ]
    : ["Complete this step carefully."];

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