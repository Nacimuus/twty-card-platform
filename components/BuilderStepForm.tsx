"use client";

import { useState } from "react";
import Link from "next/link";
import { getNextStep, getPreviousStep } from "@/lib/builder-steps";
import { saveCardStep } from "@/app/actions/save-card-step";
import { publishCard } from "@/app/actions/publish-card";
import { AIFieldButton } from "@/components/AIFieldButton";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import {
  GENERIC_THEMES,
  THEME_KEYS,
  TEXTURE_PATTERNS,
  type ThemeKey,
  type ComputedTheme,
} from "@/lib/themes";

// ─── Shared styles ──────────────────────────────────────────
const INPUT_CLASS =
  "w-full rounded-md border border-pierre-soft bg-creme px-4 py-3 text-sm outline-none transition placeholder:text-pierre/50 focus:border-foret";
const TEXTAREA_CLASS = `${INPUT_CLASS} min-h-32`;
const LABEL_CLASS = "block text-xs font-medium text-pierre";

const THEME_DESCRIPTIONS: Record<ThemeKey, { fr: string; en: string }> = {
  elysee: {
    fr: "Luxe classique — émeraude profond, or, esprit Champs-Élysées.",
    en: "Classic luxury — deep emerald, gold, Champs-Élysées vibe.",
  },
  midnight: {
    fr: "Premium sombre — noir profond, argent, ombres élégantes.",
    en: "Premium dark — deep black, silver, elegant shadows.",
  },
  provence: {
    fr: "Inspiré Van Gogh — bleu profond, or, coups de pinceau.",
    en: "Van Gogh inspired — deep blue, gold, brush strokes.",
  },
  tokyo: {
    fr: "Pop culture — coucher de soleil sakura, pétales.",
    en: "Pop culture — sakura sunset, petals.",
  },
};

// ─── Component ──────────────────────────────────────────────
export function BuilderStepForm({
  card,
  step,
  selectedGenericTheme,
  setSelectedGenericTheme,
  selectedAITheme,
  setSelectedAITheme,
  selectedLanguage,
  setSelectedLanguage,
  profileImageUrl,
  setProfileImageUrl,
  companyLogoUrl,
  setCompanyLogoUrl,
}: {
  card: any;
  step: string;
  selectedGenericTheme: string;
  setSelectedGenericTheme: any;
  selectedAITheme: any;
  setSelectedAITheme: any;
  selectedLanguage: "fr" | "en";
  setSelectedLanguage: (lang: "fr" | "en") => void;
  profileImageUrl: string;
  setProfileImageUrl: any;
  companyLogoUrl: string;
  setCompanyLogoUrl: any;
}) {
  const supabase = createClient();
  const next = getNextStep(step);
  const previous = getPreviousStep(step);
  const searchParams = useSearchParams();
  const isPublished = searchParams.get("published") === "true";
  const publishedSlug = searchParams.get("slug");

  // ─── AI theme state ───────────────────────────────────────
  const [aiThemePrompt, setAiThemePrompt] = useState(card?.theme_prompt || "");
  const [aiThemes, setAiThemes] = useState<ComputedTheme[]>(
    Array.isArray(card?.ai_theme_variants) ? card.ai_theme_variants : [],
  );
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAlreadyUsed, setAiAlreadyUsed] = useState<boolean>(
    !!card?.ai_theme_generated_at,
  );

  async function generateAIThemes() {
    setIsGeneratingTheme(true);
    setAiError(null);

    try {
      const res = await fetch("/api/generate-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: card.id,
          themePrompt: aiThemePrompt,
          fullName: card?.full_name,
          title: card?.title,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAiError(data.message || "Échec de la génération.");
        if (data.error === "ALREADY_USED") setAiAlreadyUsed(true);
        return;
      }

      setAiThemes(data.themes || []);
      setAiAlreadyUsed(true);
    } catch {
      setAiError("Erreur réseau. Réessayez.");
    } finally {
      setIsGeneratingTheme(false);
    }
  }

  // ─── Image upload ─────────────────────────────────────────
  const [uploadingImage, setUploadingImage] = useState(false);

  async function uploadImage(file: File, folder: "profiles" | "logos") {
    setUploadingImage(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${card.id}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("profile-images")
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error("UPLOAD ERROR:", error);
      setUploadingImage(false);
      return "";
    }

    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(fileName);

    setUploadingImage(false);
    return data.publicUrl;
  }

  // ─── Render ───────────────────────────────────────────────
  return (
    <div>
      {/* ═══ IDENTITY ═══════════════════════════════════════ */}
      {step === "identity" && (
        <form action={saveCardStep} className="space-y-6">
          <input type="hidden" name="cardId" value={card.id} />
          <input type="hidden" name="nextStep" value={next || "company"} />

          <header>
            <h1 className="font-display text-3xl">Votre identité</h1>
            <p className="mt-1 text-sm text-pierre">
              Ce que les gens verront en premier.
            </p>
          </header>

          <div className="space-y-5">
            <label className="block">
              <span className={LABEL_CLASS}>Nom complet</span>
              <input
                name="full_name"
                className={`${INPUT_CLASS} mt-2`}
                placeholder="Ex : Léa Marchand"
                defaultValue={card?.full_name || ""}
              />
            </label>

            <label className="block">
              <span className={LABEL_CLASS}>Titre / poste</span>
              <input
                name="title"
                className={`${INPUT_CLASS} mt-2`}
                placeholder="Ex : Photographe indépendante"
                defaultValue={card?.title || ""}
              />
            </label>

            <ImageUpload
              label="Photo de profil"
              folder="profiles"
              fieldName="profile_image"
              currentUrl={profileImageUrl}
              setCurrentUrl={setProfileImageUrl}
              uploadFn={uploadImage}
              uploading={uploadingImage}
            />

            <label className="block">
              <span className={LABEL_CLASS}>Bio</span>
              <textarea
                name="bio"
                className={`${TEXTAREA_CLASS} mt-2`}
                placeholder="Quelques phrases sur ce que vous faites."
                defaultValue={card?.bio || ""}
              />
            </label>

            <AIFieldButton
              field="short professional bio"
              targetName="bio"
              context={card}
            >
              Améliorer avec l'IA
            </AIFieldButton>
          </div>

          <StepNav previous={previous} cardId={card.id} forwardLabel="Suivant" />
        </form>
      )}

      {/* ═══ SKILLS ═════════════════════════════════════════ */}
      {step === "skills" && (
        <form action={saveCardStep} className="space-y-6">
          <input type="hidden" name="cardId" value={card.id} />
          <input type="hidden" name="nextStep" value={next || "contact"} />

          <header>
            <h1 className="font-display text-3xl">Vos compétences</h1>
            <p className="mt-1 text-sm text-pierre">
              Ce que vous voulez qu'on retienne de vous.
            </p>
          </header>

          <div className="space-y-5">
            <label className="block">
              <span className={LABEL_CLASS}>
                Compétences (séparées par des virgules)
              </span>
              <textarea
                name="skills"
                className={`${TEXTAREA_CLASS} mt-2`}
                placeholder="Ex : Gestion de projet, paiements, EMV, SoftPOS, leadership"
                defaultValue={
                  Array.isArray(card?.skills)
                    ? card.skills.join(", ")
                    : card?.skills || ""
                }
              />
            </label>

            <AIFieldButton
              field="professional skills list"
              targetName="skills"
              context={card}
            >
              Générer avec l'IA
            </AIFieldButton>
          </div>

          <StepNav previous={previous} cardId={card.id} forwardLabel="Suivant" />
        </form>
      )}

      {/* ═══ COMPANY ════════════════════════════════════════ */}
      {step === "company" && (
        <form action={saveCardStep} className="space-y-6">
          <input type="hidden" name="cardId" value={card.id} />
          <input type="hidden" name="nextStep" value={next || "contact"} />

          <header>
            <h1 className="font-display text-3xl">Votre entreprise</h1>
            <p className="mt-1 text-sm text-pierre">
              Les informations de votre activité.
            </p>
          </header>

          <div className="space-y-5">
            <label className="block">
              <span className={LABEL_CLASS}>Nom de l'entreprise</span>
              <input
                name="company"
                className={`${INPUT_CLASS} mt-2`}
                placeholder="Ex : Studio Marchand"
                defaultValue={card?.company || ""}
              />
            </label>

            <ImageUpload
              label="Logo de l'entreprise"
              folder="logos"
              fieldName="company_logo"
              currentUrl={companyLogoUrl}
              setCurrentUrl={setCompanyLogoUrl}
              uploadFn={uploadImage}
              uploading={uploadingImage}
            />

            <label className="block">
              <span className={LABEL_CLASS}>Description</span>
              <textarea
                name="company_description"
                className={`${TEXTAREA_CLASS} mt-2`}
                placeholder="Que fait votre entreprise ?"
                defaultValue={card?.company_description || ""}
              />
            </label>

            <AIFieldButton
              field="company description"
              targetName="company_description"
              context={card}
            >
              Générer la description
            </AIFieldButton>

            <label className="block">
              <span className={LABEL_CLASS}>
                Services (séparés par des virgules)
              </span>
              <textarea
                name="company_services"
                className={`${TEXTAREA_CLASS} mt-2`}
                placeholder="Ex : Photo portrait, photo corporate, événementiel"
                defaultValue={
                  Array.isArray(card?.company_services)
                    ? card.company_services.join(", ")
                    : card?.company_services || ""
                }
              />
            </label>

            <AIFieldButton
              field="company services list"
              targetName="company_services"
              context={card}
            >
              Générer les services
            </AIFieldButton>

            <label className="block">
              <span className={LABEL_CLASS}>Site web de l'entreprise</span>
              <input
                name="company_website"
                className={`${INPUT_CLASS} mt-2`}
                placeholder="https://..."
                defaultValue={card?.company_website || ""}
              />
            </label>
          </div>

          <StepNav previous={previous} cardId={card.id} forwardLabel="Suivant" />
        </form>
      )}

      {/* ═══ CONTACT ════════════════════════════════════════ */}
      {step === "contact" && (
        <form action={saveCardStep} className="space-y-6">
          <input type="hidden" name="cardId" value={card.id} />
          <input type="hidden" name="nextStep" value={next || "design"} />

          <header>
            <h1 className="font-display text-3xl">Vos coordonnées</h1>
            <p className="mt-1 text-sm text-pierre">
              Tous les moyens de vous joindre.
            </p>
          </header>

          <div className="space-y-5">
            {[
              { name: "email", label: "Email", placeholder: "vous@exemple.com", type: "email" },
              { name: "phone", label: "Téléphone", placeholder: "+33 6 12 34 56 78", type: "tel" },
              { name: "whatsapp", label: "WhatsApp", placeholder: "+33 6 12 34 56 78", type: "tel" },
              { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/...", type: "url" },
              { name: "website", label: "Site web", placeholder: "https://...", type: "url" },
            ].map((field) => (
              <label key={field.name} className="block">
                <span className={LABEL_CLASS}>{field.label}</span>
                <input
                  type={field.type}
                  name={field.name}
                  className={`${INPUT_CLASS} mt-2`}
                  placeholder={field.placeholder}
                  defaultValue={(card as any)?.[field.name] || ""}
                />
              </label>
            ))}
          </div>

          <StepNav previous={previous} cardId={card.id} forwardLabel="Suivant" />
        </form>
      )}

      {/* ═══ DESIGN ═════════════════════════════════════════ */}
      {step === "design" && (
        <form action={saveCardStep} className="space-y-8">
          <input type="hidden" name="cardId" value={card.id} />
          <input type="hidden" name="nextStep" value={next || "review"} />
          <input type="hidden" name="language" value={selectedLanguage} />
          <input type="hidden" name="generic_theme" value={selectedGenericTheme} />
          <input type="hidden" name="theme_prompt" value={aiThemePrompt} />
          <input
            type="hidden"
            name="ai_theme"
            value={selectedAITheme ? JSON.stringify(selectedAITheme) : ""}
          />

          <header>
            <h1 className="font-display text-3xl">Choisissez le style</h1>
            <p className="mt-1 text-sm text-pierre">
              Quatre thèmes éditoriaux. Ou laissez l'IA en générer un — une seule fois par carte.
            </p>
          </header>

          {/* Language picker */}
          <section>
            <h2 className="font-display text-lg">Langue par défaut</h2>
            <p className="mt-1 text-xs text-pierre">
              Quelle langue voient les visiteurs par défaut.
            </p>

            <div className="mt-3 inline-flex gap-1 rounded-md border border-pierre-soft bg-creme p-1">
              {(["fr", "en"] as const).map((lang) => {
                const active = selectedLanguage === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`rounded px-4 py-1.5 text-sm font-medium transition ${
                      active
                        ? "bg-foret text-creme"
                        : "text-pierre hover:text-encre"
                    }`}
                  >
                    {lang === "fr" ? "Français" : "English"}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Themes */}
          <section>
            <h2 className="font-display text-lg">Thèmes éditoriaux</h2>
            <p className="mt-1 text-xs text-pierre">
              La carte reste reconnaissable comme une carte Palgonic.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {THEME_KEYS.map((key) => {
                const theme = GENERIC_THEMES[key];
                const active = selectedGenericTheme === key && !selectedAITheme;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedGenericTheme(key);
                      setSelectedAITheme(null);
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-foret ring-2 ring-foret/20"
                        : "border-pierre-soft hover:border-foret"
                    }`}
                  >
                    <ThemeSwatch theme={theme} />
                    <p className="mt-3 font-display text-base">{theme.name}</p>
                    <p className="mt-0.5 text-xs text-pierre">
                      {THEME_DESCRIPTIONS[key][selectedLanguage]}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* AI theme */}
          <section>
            <h2 className="font-display text-lg">Thème personnalisé (IA)</h2>
            <p className="mt-1 text-xs text-pierre">
              {aiAlreadyUsed
                ? "La génération IA a déjà été utilisée pour cette carte."
                : "Décrivez votre vibe. L'IA propose 2 variantes. Une seule génération par carte."}
            </p>

            {!aiAlreadyUsed && (
              <div className="mt-4 space-y-3">
                <textarea
                  className={TEXTAREA_CLASS}
                  placeholder="Ex : bleu profond et terracotta, élégant, swiss design moderne…"
                  value={aiThemePrompt}
                  onChange={(e) => setAiThemePrompt(e.target.value)}
                  disabled={isGeneratingTheme}
                />

                {aiError && (
                  <p className="rounded-md border border-corail-deep/20 bg-corail/10 p-3 text-sm text-corail-deep">
                    {aiError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={generateAIThemes}
                  disabled={isGeneratingTheme || aiThemePrompt.trim().length < 5}
                  className="inline-flex rounded-md bg-foret px-5 py-2.5 text-sm font-medium text-creme transition hover:bg-foret-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGeneratingTheme ? "Génération…" : "Générer 2 variantes"}
                </button>
              </div>
            )}
          </section>

          {/* AI variants */}
          {aiThemes.length > 0 && (
            <section>
              <h2 className="font-display text-lg">Variantes générées</h2>
              <p className="mt-1 text-xs text-pierre">
                Choisissez la variante qui correspond à votre identité.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {aiThemes.map((theme, index) => {
                  const active =
                    selectedAITheme && selectedAITheme.name === theme.name;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedAITheme(theme)}
                      className={`rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-foret ring-2 ring-foret/20"
                          : "border-pierre-soft hover:border-foret"
                      }`}
                    >
                      <ThemeSwatch theme={theme} />

                      <p className="mt-3 text-[10px] uppercase tracking-widest text-pierre">
                        Variante {index + 1}
                      </p>
                      <p className="font-display text-base">{theme.name}</p>

                      <div className="mt-3 flex gap-1.5">
                        {[theme.background, theme.accent, theme.foreground, theme.muted].map((c, i) => (
                          <span
                            key={i}
                            className="h-4 w-4 rounded-full border"
                            style={{ background: c, borderColor: theme.border }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <StepNav previous={previous} cardId={card.id} forwardLabel="Suivant" />
        </form>
      )}

      {/* ═══ REVIEW ═════════════════════════════════════════ */}
      {step === "review" && (
        <form action={publishCard} className="space-y-6">
          <input type="hidden" name="cardId" value={card.id} />

          <header>
            <h1 className="font-display text-3xl">Prêt à publier</h1>
            <p className="mt-1 text-sm text-pierre">
              Vérifiez l'aperçu à côté. Une fois publiée, votre carte est partageable.
            </p>
          </header>

          <div className="rounded-xl border border-pierre-soft bg-creme p-6">
            <p className="font-display text-xl">
              {isPublished
                ? "Votre carte est en ligne."
                : "Votre carte Palgonic est presque prête."}
            </p>

            <p className="mt-2 text-sm text-pierre">
              {isPublished
                ? "Vous pouvez l'ouvrir, la partager, ou revenir au tableau de bord."
                : "Publiez votre carte et commencez à la partager avec votre réseau."}
            </p>

            {isPublished && publishedSlug && (
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`/u/${publishedSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-foret px-4 py-2.5 text-sm font-medium text-creme transition hover:bg-foret-deep"
                >
                  Ouvrir la carte ↗
                </a>
                <Link
                  href="/dashboard"
                  className="rounded-md border border-pierre-soft px-4 py-2.5 text-sm font-medium transition hover:border-foret hover:text-foret"
                >
                  Tableau de bord
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-pierre-soft pt-6">
            <Link
              href={`/dashboard/cards/${card.id}/builder/${previous}`}
              className="text-sm text-pierre transition hover:text-foret"
            >
              ← Retour
            </Link>
            {!isPublished && (
              <button
                type="submit"
                className="rounded-md bg-foret px-6 py-2.5 text-sm font-medium text-creme transition hover:bg-foret-deep"
              >
                Publier la carte
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════

function StepNav({
  previous,
  cardId,
  forwardLabel,
}: {
  previous: string | null;
  cardId: string;
  forwardLabel: string;
}) {
  return (
    <div className="flex items-center justify-between border-t border-pierre-soft pt-6">
      {previous ? (
        <Link
          href={`/dashboard/cards/${cardId}/builder/${previous}`}
          className="text-sm text-pierre transition hover:text-foret"
        >
          ← Retour
        </Link>
      ) : (
        <span />
      )}
      <button
        type="submit"
        className="rounded-md bg-foret px-6 py-2.5 text-sm font-medium text-creme transition hover:bg-foret-deep"
      >
        {forwardLabel}
      </button>
    </div>
  );
}

function ThemeSwatch({
  theme,
}: {
  theme: ComputedTheme & { texturePattern?: string };
}) {
  // Resolve overlay: explicit `overlay` (premade themes) OR texturePattern (AI themes)
  const overlay =
    theme.overlay ||
    (theme.texturePattern && TEXTURE_PATTERNS[theme.texturePattern]) ||
    undefined;

  return (
    <div
      className="h-24 w-full overflow-hidden rounded-lg"
      style={{
        background: overlay
          ? `${overlay}, ${theme.background}`
          : theme.background,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div className="flex h-full items-end justify-between p-3">
        <div
          className="rounded-full px-2.5 py-1 text-[10px] font-medium"
          style={{
            backgroundColor: theme.accent,
            color: theme.accentForeground,
          }}
        >
          CTA
        </div>
        <div className="flex flex-col items-end gap-1">
          <div
            className="h-1.5 w-16 rounded-full"
            style={{ backgroundColor: theme.foreground, opacity: 0.85 }}
          />
          <div
            className="h-1.5 w-10 rounded-full"
            style={{ backgroundColor: theme.muted }}
          />
        </div>
      </div>
    </div>
  );
}

function ImageUpload({
  label,
  folder,
  fieldName,
  currentUrl,
  setCurrentUrl,
  uploadFn,
  uploading,
}: {
  label: string;
  folder: "profiles" | "logos";
  fieldName: string;
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
  uploadFn: (file: File, folder: "profiles" | "logos") => Promise<string>;
  uploading: boolean;
}) {
  return (
    <div>
      <span className={LABEL_CLASS}>{label}</span>
      <input type="hidden" name={fieldName} value={currentUrl} />

      {currentUrl ? (
        <div className="mt-2 flex items-center gap-4 rounded-md border border-pierre-soft bg-creme p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt=""
            className={`h-14 w-14 object-cover ${
              folder === "profiles" ? "rounded-full" : "rounded-md"
            }`}
          />
          <div className="flex-1 text-sm">
            <p className="font-medium">Image chargée</p>
            <p className="text-xs text-pierre">Cliquez pour remplacer</p>
          </div>
          <label className="cursor-pointer text-sm text-foret underline underline-offset-4">
            Modifier
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await uploadFn(file, folder);
                if (url) setCurrentUrl(url);
              }}
            />
          </label>
        </div>
      ) : (
        <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-pierre-soft bg-creme/50 px-4 py-8 transition hover:border-foret">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadFn(file, folder);
              if (url) setCurrentUrl(url);
            }}
          />
          <span className="text-sm text-pierre">
            {uploading ? "Téléversement…" : "+ Ajouter une image"}
          </span>
        </label>
      )}
    </div>
  );
}
