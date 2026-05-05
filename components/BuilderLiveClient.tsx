"use client";

import { useState } from "react";
import { CardBuilderLayout } from "@/components/CardBuilderLayout";
import { BuilderStepForm } from "@/components/BuilderStepForm";
import { CardPreview } from "@/components/CardPreview";

export function BuilderLiveClient({
  card,
  step,
  cardId,
}: {
  card: any;
  step: string;
  cardId: string;
}) {
  const [selectedGenericTheme, setSelectedGenericTheme] = useState(
    card?.generic_theme || "luxury"
  );

  const [selectedAITheme, setSelectedAITheme] = useState<any>(
    card?.ai_theme || null
  );

  const [profileImageUrl, setProfileImageUrl] = useState(card?.profile_image || "");
const [companyLogoUrl, setCompanyLogoUrl] = useState(card?.company_logo || "");

  return (
    <CardBuilderLayout
      cardId={cardId}
      currentStep={step}
      preview={
        <CardPreview
          fullName={card.full_name || ""}
          title={card.title || ""}
          bio={card.bio || ""}
          phone={card.phone || ""}
          email={card.email || ""}
          whatsapp={card.whatsapp || ""}
          linkedin={card.linkedin || ""}
          website={card.website || ""}
          profileImage={profileImageUrl}
          themeMode={selectedAITheme ? "ai" : "generic"}
          genericTheme={selectedGenericTheme}
          primaryColor={selectedAITheme?.primaryColor || card.primary_color || "#0f172a"}
secondaryColor={selectedAITheme?.secondaryColor || card.secondary_color || "#facc15"}
aiTheme={selectedAITheme?.aiTheme || selectedAITheme || undefined}
          backgroundStyle={selectedAITheme?.backgroundStyle || card.background_style || ""}
buttonStyle={selectedAITheme?.buttonStyle || card.button_style || ""}
          company={card.company || ""}
          companyDescription={card.company_description || ""}
          companyWebsite={card.company_website || ""}
       companyLogo={companyLogoUrl}
          companyServices={card.company_services || []}
companyCtaLabel={card.company_cta_label || ""}
        />
      }
    >
      <BuilderStepForm
  card={card}
  step={step}
  selectedGenericTheme={selectedGenericTheme}
  setSelectedGenericTheme={setSelectedGenericTheme}
  selectedAITheme={selectedAITheme}
  setSelectedAITheme={setSelectedAITheme}
  profileImageUrl={profileImageUrl}
  setProfileImageUrl={setProfileImageUrl}
  companyLogoUrl={companyLogoUrl}
  setCompanyLogoUrl={setCompanyLogoUrl}
      />
    </CardBuilderLayout>
  );
}