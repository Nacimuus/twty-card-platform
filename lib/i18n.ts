/**
 * Bilingual labels for the public card.
 * Only the UI chrome is translated — user content (bio, title, etc.)
 * stays in whatever language the cardholder wrote it in.
 */

export type Lang = "fr" | "en";

export const DEFAULT_LANG: Lang = "fr";
export const SUPPORTED_LANGS: Lang[] = ["fr", "en"];

export function isLang(value: string | null | undefined): value is Lang {
  return value === "fr" || value === "en";
}

export function resolveLang(value: string | null | undefined): Lang {
  return isLang(value) ? value : DEFAULT_LANG;
}

type Dict = {
  // Section headers
  about: string;
  skills: string;
  company: string;
  services: string;
  contact: string;

  // Buttons / CTAs
  saveContact: string;
  visitWebsite: string;
  scanCard: string;

  // Contact field labels
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;

  // Language switcher
  switchTo: string;
  french: string;
  english: string;

  // 404 / error states
  notFound: string;
  notFoundDescription: string;

  // Branding
  poweredBy: string;
};

export const dictionaries: Record<Lang, Dict> = {
  fr: {
    about: "À propos",
    skills: "Compétences",
    company: "Entreprise",
    services: "Services",
    contact: "Contact",

    saveContact: "Enregistrer le contact",
    visitWebsite: "Voir le site",
    scanCard: "Scanner cette carte",

    email: "Email",
    phone: "Téléphone",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",

    switchTo: "Langue",
    french: "Français",
    english: "English",

    notFound: "Carte introuvable",
    notFoundDescription:
      "Cette carte n'existe pas ou n'est plus publiée.",

    poweredBy: "Propulsé par",
  },
  en: {
    about: "About",
    skills: "Skills",
    company: "Company",
    services: "Services",
    contact: "Contact",

    saveContact: "Save contact",
    visitWebsite: "Visit website",
    scanCard: "Scan this card",

    email: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",

    switchTo: "Language",
    french: "Français",
    english: "English",

    notFound: "Card not found",
    notFoundDescription:
      "This card doesn't exist or is no longer published.",

    poweredBy: "Powered by",
  },
};

export function t(lang: Lang) {
  return dictionaries[lang];
}