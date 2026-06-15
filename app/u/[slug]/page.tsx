import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/server";
import { resolveTheme } from "@/lib/themes";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SaveContactButton } from "@/components/SaveContactButton";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";

type Lang = "fr" | "en";

// ════════════════════════════════════════════════════════════
// Copy dictionary (FR + EN)
// ════════════════════════════════════════════════════════════
const COPY = {
  fr: {
    about: "À propos",
    skills: "Compétences",
    company: "Entreprise",
    contact: "Contact",
    saveContact: "Enregistrer le contact",
    qrTitle: "Scannez pour enregistrer",
    qrHint: "Scannez. Restons en contact.",
    notFoundTitle: "Carte introuvable",
    notFoundHint: "Cette carte n'existe pas ou n'a pas encore été publiée.",
    poweredBy: "Propulsé par palgonic",
    visitWebsite: "Site web",
    emailLabel: "Email",
    phoneLabel: "Téléphone",
    whatsappLabel: "WhatsApp",
    linkedinLabel: "LinkedIn",
    websiteLabel: "Site",
  },
  en: {
    about: "About",
    skills: "Skills",
    company: "Company",
    contact: "Contact",
    saveContact: "Save contact",
    qrTitle: "Scan to save",
    qrHint: "Scan. Let's stay in touch.",
    notFoundTitle: "Card not found",
    notFoundHint: "This card does not exist or has not been published yet.",
    poweredBy: "Powered by palgonic",
    visitWebsite: "Website",
    emailLabel: "Email",
    phoneLabel: "Phone",
    whatsappLabel: "WhatsApp",
    linkedinLabel: "LinkedIn",
    websiteLabel: "Website",
  },
} as const;

// ════════════════════════════════════════════════════════════
// Metadata with hreflang for SEO
// ════════════════════════════════════════════════════════════
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const supabase = await createClient();
  const { data: card } = await supabase
    .from("profiles")
    .select("full_name, title, bio, language")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!card) return { title: "Palgonic" };

  const isEN = (lang || card.language) === "en";
  const t = COPY[isEN ? "en" : "fr"];

  const title = card.full_name
    ? `${card.full_name}${card.title ? ` · ${card.title}` : ""}`
    : "Palgonic";
  const description = card.bio || t.poweredBy;

  return {
    title,
    description,
    alternates: {
      canonical: isEN ? `/u/${slug}?lang=en` : `/u/${slug}`,
      languages: {
        "fr-FR": `/u/${slug}`,
        "en-US": `/u/${slug}?lang=en`,
      },
    },
    openGraph: {
      type: "profile",
      locale: isEN ? "en_US" : "fr_FR",
      title,
      description,
    },
  };
}

// ════════════════════════════════════════════════════════════
// Page
// ════════════════════════════════════════════════════════════
export default async function PublicCard({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang: langParam } = await searchParams;

  const supabase = await createClient();
  const { data: card, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  // Resolve language: URL param > card default > fr
  const cardLang = card?.language === "en" ? "en" : "fr";
  const lang: Lang =
    langParam === "fr" || langParam === "en" ? langParam : cardLang;
  const t = COPY[lang];

  // Not-found state
  if (error || !card) {
    return (
      <main className="min-h-screen bg-creme text-encre">
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-3xl">{t.notFoundTitle}</h1>
          <p className="mt-3 text-pierre">{t.notFoundHint}</p>
          <Link
            href="/"
            className="mt-8 rounded-md bg-foret px-5 py-2.5 text-sm font-medium text-creme transition hover:bg-foret-deep"
          >
            palgonic
          </Link>
        </div>
      </main>
    );
  }

  // Resolve theme using new themes.ts (with overlay support)
  const theme = resolveTheme(card);

  // Build the public card URL for the QR code, from request headers
  const headersList = await headers();
  const host = headersList.get("host") || "palgonic.com";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const cardUrl = `${protocol}://${host}/u/${slug}`;

  // Initials fallback for the avatar
  const initials =
    (card.full_name || "")
      .split(" ")
      .filter(Boolean)
      .map((w: string) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "P";

  const skills: string[] = Array.isArray(card.skills)
    ? card.skills.filter(Boolean)
    : [];

  const services: string[] = Array.isArray(card.company_services)
    ? card.company_services.filter(Boolean)
    : [];

  // Build LinkedIn URL safely
  const linkedinHref = card.linkedin
    ? card.linkedin.startsWith("http")
      ? card.linkedin
      : `https://${card.linkedin}`
    : null;

  // Build website URL safely
  const websiteHref = card.website
    ? card.website.startsWith("http")
      ? card.website
      : `https://${card.website}`
    : null;

  const contactRows = [
    card.email && {
      label: t.emailLabel,
      value: card.email,
      href: `mailto:${card.email}`,
    },
    card.phone && {
      label: t.phoneLabel,
      value: card.phone,
      href: `tel:${card.phone}`,
    },
    card.whatsapp && {
      label: t.whatsappLabel,
      value: card.whatsapp,
      href: `https://wa.me/${card.whatsapp.replace(/[^0-9]/g, "")}`,
    },
    linkedinHref && {
      label: t.linkedinLabel,
      value: card.linkedin,
      href: linkedinHref,
    },
    websiteHref && {
      label: t.websiteLabel,
      value: card.website,
      href: websiteHref,
    },
  ].filter(Boolean) as Array<{ label: string; value: string; href: string }>;

  return (
    <main
      className="min-h-screen"
      style={{
        background: theme.overlay
          ? `${theme.overlay}, ${theme.background}`
          : theme.background,
        color: theme.foreground,
      }}
    >
      <AnalyticsBeacon cardId={card.id} />

      <div className="mx-auto max-w-md px-6 py-8 sm:py-12">
        {/* Header — language switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher current={lang} theme={theme} />
        </div>

        {/* Hero */}
        <section className="mt-8 text-center">
          <div
            className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            {card.profile_image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={card.profile_image}
                alt={card.full_name || ""}
                className="h-full w-full object-cover"
              />
            ) : (
              <span
                className="font-display text-3xl"
                style={{ color: theme.muted }}
              >
                {initials}
              </span>
            )}
          </div>

          {card.full_name && (
            <h1 className="mt-6 font-display text-4xl tracking-tight">
              {card.full_name}
            </h1>
          )}
          {card.title && (
            <p
              className="mt-2 text-sm font-medium"
              style={{ color: theme.muted }}
            >
              {card.title}
            </p>
          )}
        </section>

        {/* Save contact — primary CTA right under the hero */}
        <div className="mt-8">
          <SaveContactButton
            cardId={card.id}
            slug={slug}
            theme={theme}
            label={t.saveContact}
          />
        </div>

        {/* About */}
        {card.bio && (
          <section className="mt-10">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: theme.muted }}
            >
              {t.about}
            </p>
            <p className="mt-3 whitespace-pre-line leading-relaxed">
              {card.bio}
            </p>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mt-10">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: theme.muted }}
            >
              {t.skills}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full px-3 py-1 text-xs"
                  style={{
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.surface,
                    color: theme.foreground,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Company */}
        {card.company && (
          <section
            className="mt-10 rounded-2xl p-5"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex items-center gap-3">
              {card.company_logo && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={card.company_logo}
                  alt={card.company}
                  className="h-12 w-12 rounded-md object-cover"
                  style={{ border: `1px solid ${theme.border}` }}
                />
              )}
              <div>
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: theme.muted }}
                >
                  {t.company}
                </p>
                <h2 className="font-display text-lg">{card.company}</h2>
              </div>
            </div>

            {card.company_description && (
              <p className="mt-4 text-sm leading-relaxed">
                {card.company_description}
              </p>
            )}

            {services.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-2.5 py-1 text-[11px]"
                    style={{
                      border: `1px solid ${theme.border}`,
                      backgroundColor: "transparent",
                      color: theme.muted,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {card.company_website && (
              <a
                href={
                  card.company_website.startsWith("http")
                    ? card.company_website
                    : `https://${card.company_website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-md px-4 py-2 text-sm font-medium transition hover:opacity-90"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.accentForeground,
                }}
              >
                {t.visitWebsite} ↗
              </a>
            )}
          </section>
        )}

        {/* Contact */}
        {contactRows.length > 0 && (
          <section className="mt-10">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: theme.muted }}
            >
              {t.contact}
            </p>
            <ul
              className="mt-3 overflow-hidden rounded-2xl"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
              }}
            >
              {contactRows.map((row, i) => (
                <li
                  key={row.label}
                  style={{
                    borderBottom:
                      i === contactRows.length - 1
                        ? undefined
                        : `1px solid ${theme.border}`,
                  }}
                >
                  <a
                    href={row.href}
                    target={
                      row.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      row.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition hover:opacity-80"
                  >
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: theme.muted }}
                    >
                      {row.label}
                    </span>
                    <span className="truncate">{row.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* QR Code — white container for reliable scanning on any theme */}
        <section className="mt-12">
          <p
            className="mb-4 text-center text-xs uppercase tracking-widest"
            style={{ color: theme.muted }}
          >
            {t.qrTitle}
          </p>

          <div className="mx-auto flex w-fit flex-col items-center gap-3 rounded-2xl bg-white p-5 shadow-2xl">
            <QRCodeSVG
              value={cardUrl}
              size={140}
              bgColor="#FFFFFF"
              fgColor="#0E5C4D"
              level="M"
            />
            <p className="text-xs font-medium text-foret">
              {t.qrHint}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pb-6 text-center">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest transition hover:opacity-100"
            style={{ color: theme.muted, opacity: 0.7 }}
          >
            {t.poweredBy}
          </Link>
        </footer>
      </div>
    </main>
  );
}
