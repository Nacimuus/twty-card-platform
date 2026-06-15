"use client";

import type { ComputedTheme } from "@/lib/themes";

type CardLike = {
  full_name?: string;
  title?: string;
  bio?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  linkedin?: string;
  website?: string;
  profile_image?: string;
  company?: string;
  company_description?: string;
  company_logo?: string;
  company_services?: string[];
  skills?: string[];
};

/**
 * Live preview rendered alongside the builder. Mirrors the public card
 * layout (compact version) and uses the same theme resolution → true WYSIWYG.
 */
export function CardPreview({
  card,
  profileImage,
  companyLogo,
  theme,
}: {
  card: CardLike;
  profileImage?: string;
  companyLogo?: string;
  theme: ComputedTheme;
}) {
  const photo = profileImage || card?.profile_image || "";
  const logo = companyLogo || card?.company_logo || "";

  const initials =
    (card?.full_name || "")
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "P";

  const skills: string[] = Array.isArray(card?.skills)
    ? card.skills.filter(Boolean)
    : [];

  const services: string[] = Array.isArray(card?.company_services)
    ? card.company_services.filter(Boolean)
    : [];

  const contactRows = [
    card?.email && { label: "Email", value: card.email },
    card?.phone && { label: "Téléphone", value: card.phone },
    card?.whatsapp && { label: "WhatsApp", value: card.whatsapp },
    card?.linkedin && { label: "LinkedIn", value: card.linkedin },
    card?.website && { label: "Site", value: card.website },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div
      className="overflow-hidden rounded-2xl border p-5 text-sm"
      style={{
        background: theme.overlay
          ? `${theme.overlay}, ${theme.background}`
          : theme.background,
        borderColor: theme.border,
        color: theme.foreground,
      }}
    >
      {/* Hero */}
      <div className="text-center">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={card?.full_name || ""}
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className="font-display text-xl"
              style={{ color: theme.muted }}
            >
              {initials}
            </span>
          )}
        </div>

        {card?.full_name && (
          <p className="mt-3 font-display text-xl leading-tight">
            {card.full_name}
          </p>
        )}
        {card?.title && (
          <p className="mt-1 text-xs" style={{ color: theme.muted }}>
            {card.title}
          </p>
        )}
      </div>

      {/* Bio */}
      {card?.bio && (
        <div className="mt-5">
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: theme.muted }}
          >
            À propos
          </p>
          <p className="mt-1.5 line-clamp-4 whitespace-pre-line text-xs leading-relaxed">
            {card.bio}
          </p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-5">
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: theme.muted }}
          >
            Compétences
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {skills.slice(0, 5).map((s) => (
              <span
                key={s}
                className="rounded-full px-2 py-0.5 text-[10px]"
                style={{
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.surface,
                  color: theme.foreground,
                }}
              >
                {s}
              </span>
            ))}
            {skills.length > 5 && (
              <span
                className="text-[10px]"
                style={{ color: theme.muted }}
              >
                +{skills.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Company */}
      {card?.company && (
        <div
          className="mt-5 rounded-xl p-3"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div className="flex items-center gap-2.5">
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={card.company}
                className="h-8 w-8 rounded-md object-cover"
                style={{ border: `1px solid ${theme.border}` }}
              />
            )}
            <div>
              <p
                className="text-[10px] uppercase tracking-widest"
                style={{ color: theme.muted }}
              >
                Entreprise
              </p>
              <p className="font-display text-sm leading-tight">
                {card.company}
              </p>
            </div>
          </div>

          {card?.company_description && (
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed">
              {card.company_description}
            </p>
          )}

          {services.length > 0 && (
            <p
              className="mt-2 text-[11px]"
              style={{ color: theme.muted }}
            >
              {services.slice(0, 3).join(" · ")}
              {services.length > 3 && ` · +${services.length - 3}`}
            </p>
          )}
        </div>
      )}

      {/* Contact */}
      {contactRows.length > 0 && (
        <div className="mt-5">
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: theme.muted }}
          >
            Contact
          </p>
          <ul
            className="mt-2 overflow-hidden rounded-xl"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            {contactRows.map((row, i) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-3 px-3 py-2 text-[11px]"
                style={{
                  borderBottom:
                    i === contactRows.length - 1
                      ? undefined
                      : `1px solid ${theme.border}`,
                }}
              >
                <span
                  className="text-[9px] uppercase tracking-wider"
                  style={{ color: theme.muted }}
                >
                  {row.label}
                </span>
                <span className="truncate">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA (visual only — not interactive in preview) */}
      <div
        className="mt-5 rounded-xl py-2.5 text-center text-xs font-medium"
        style={{
          backgroundColor: theme.accent,
          color: theme.accentForeground,
        }}
      >
        Enregistrer le contact
      </div>
    </div>
  );
}
