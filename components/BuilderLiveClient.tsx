"use client";

import { useState } from "react";
import { CardBuilderLayout } from "@/components/CardBuilderLayout";
import { BuilderStepForm } from "@/components/BuilderStepForm";
import { CardPreview } from "@/components/CardPreview";
import { resolveTheme } from "@/lib/themes";

export function BuilderLiveClient({
  card,
  step,
  cardId,
}: {
  card: any;
  step: string;
  cardId: string;
}) {
  const [selectedGenericTheme, setSelectedGenericTheme] = useState<string>(
    card?.generic_theme || "elysee",
  );

  const [selectedAITheme, setSelectedAITheme] = useState<any>(
    card?.ai_theme || null,
  );

  const [selectedLanguage, setSelectedLanguage] = useState<"fr" | "en">(
    card?.language === "en" ? "en" : "fr",
  );

  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    card?.profile_image || "",
  );
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>(
    card?.company_logo || "",
  );

  // Compute the live theme from the current selection state.
  // This matches what `resolveTheme` does on the public card → WYSIWYG.
  const liveTheme = resolveTheme({
    theme_mode: selectedAITheme ? "ai" : "generic",
    generic_theme: selectedGenericTheme,
    ai_theme: selectedAITheme,
  });

  return (
    <CardBuilderLayout
      cardId={cardId}
      currentStep={step}
      preview={
        <CardPreview
          card={card}
          profileImage={profileImageUrl}
          companyLogo={companyLogoUrl}
          theme={liveTheme}
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
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        profileImageUrl={profileImageUrl}
        setProfileImageUrl={setProfileImageUrl}
        companyLogoUrl={companyLogoUrl}
        setCompanyLogoUrl={setCompanyLogoUrl}
      />
    </CardBuilderLayout>
  );
}
