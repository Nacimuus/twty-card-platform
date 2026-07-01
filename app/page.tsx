import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PalgonicLogo } from "@/components/PalgonicLogo";
import { GENERIC_THEMES, type ThemeKey } from "@/lib/themes";

type Lang = "fr" | "en";

// ============================================================
// Marketing copy — FR + EN
// ============================================================
const COPY = {
  fr: {
    nav: {
      themes: "Thèmes",
      howItWorks: "Fonctionnement",
      pricing: "Tarifs",
      faq: "FAQ",
      signIn: "Se connecter",
      signUp: "Créer mon compte",
      dashboard: "Tableau de bord",
    },
    hero: {
      eyebrow: "Pour indépendants francophones",
      headline: "Une carte. Un tap. Une connexion.",
      subhead:
        "Carte de visite digitale avec NFC + QR. Quatre thèmes artistiques. Gratuite à vie.",
      ctaSignedOut: "Créer ma carte gratuite",
      ctaSignedIn: "Ouvrir mon tableau de bord",
      secondary: "Voir comment ça marche",
      reassurance: "Aucune carte bancaire requise.",
    },
    mockup: {
      role: "Photographe · Paris",
      emailLabel: "Email",
      phoneLabel: "Téléphone",
      saveContact: "Enregistrer le contact",
    },
    showcase: {
      eyebrow: "Thèmes",
      heading: "Choisissez votre style.",
      subhead:
        "Quatre thèmes artistiques. Du luxe parisien à l'inspiration anime. Ou laissez l'IA en générer un sur-mesure.",
      cta: "Choisir le mien",
    },
    howItWorks: {
      eyebrow: "Fonctionnement",
      heading: "Trois gestes. Une identité pro.",
      steps: [
        {
          title: "Créez",
          body: "Identité, entreprise, contact. Tout en quelques minutes, depuis votre téléphone.",
        },
        {
          title: "Partagez",
          body: "Lien, QR code, ou carte NFC physique. Un geste suffit pour transmettre votre profil.",
        },
        {
          title: "Suivez",
          body: "Vues, scans, contacts enregistrés. Mesurez ce qui fonctionne vraiment.",
        },
      ],
    },
    pricing: {
      eyebrow: "Tarifs",
      heading: "Le digital est gratuit. Toujours.",
      subhead:
        "Créez et partagez votre carte digitale sans rien payer. Passez au physique quand vous voulez.",
      footnote:
        "Créez votre compte gratuit et commandez votre carte NFC quand vous êtes prêt.",
      free: {
        label: "Carte digitale",
        price: "Gratuit",
        period: "À vie · pour toujours",
        features: [
          "Carte digitale illimitée",
          "4 thèmes artistiques + IA",
          "QR code et lien de partage",
          "Statistiques de vues et scans",
          "Aucune carte bancaire requise",
        ],
        cta: "Créer ma carte",
      },
      nfc: {
        label: "Cartes NFC",
        price: "dès 2,99 €",
        period: "Achat unique · personnalisable",
        features: [
          "Carte physique NFC + QR",
          "Reliée à votre carte digitale",
          "Personnalisez : nom, logo, date…",
          "Gravure incluse, impression en option",
          "Livraison en Europe",
        ],
        cta: "Personnaliser ma carte",
      },
    },
    faq: {
      eyebrow: "FAQ",
      heading: "Vos questions.",
      items: [
        {
          q: "C'est vraiment gratuit ?",
          a: "Oui. La carte digitale est gratuite à vie, sans carte bancaire requise. Vous payez uniquement si vous commandez une carte NFC physique.",
        },
        {
          q: "Combien coûte une carte NFC ?",
          a: "À partir de 2,99 € pour la carte de base. Le prix évolue selon les options que vous ajoutez (logo, date, impression). La livraison est en supplément.",
        },
        {
          q: "Vendez-vous mes données ?",
          a: "Non. Jamais. Vos données sont stockées en Europe, conformément au RGPD. Vous pouvez les exporter ou les supprimer à tout moment depuis votre tableau de bord.",
        },
        {
          q: "Compatible avec mon téléphone ?",
          a: "Oui. Toutes les cartes Palgonic s'ouvrent dans n'importe quel navigateur, sur iPhone ou Android. Aucune installation requise pour vos contacts.",
        },
        {
          q: "Et si je veux supprimer mon compte ?",
          a: "Vous pouvez supprimer votre compte à tout moment depuis votre tableau de bord. Toutes vos données sont effacées définitivement, sans question posée.",
        },
      ],
    },
    footer: {
      contact: "Contact",
      copyright: "© 2026 Palgonic",
    },
  },
  en: {
    nav: {
      themes: "Themes",
      howItWorks: "How it works",
      pricing: "Pricing",
      faq: "FAQ",
      signIn: "Sign in",
      signUp: "Create account",
      dashboard: "Dashboard",
    },
    hero: {
      eyebrow: "For francophone independents",
      headline: "One card. One tap. One connection.",
      subhead:
        "Digital business card with NFC + QR. Four artistic themes. Free forever.",
      ctaSignedOut: "Create my free card",
      ctaSignedIn: "Open my dashboard",
      secondary: "See how it works",
      reassurance: "No credit card required.",
    },
    mockup: {
      role: "Photographer · Paris",
      emailLabel: "Email",
      phoneLabel: "Phone",
      saveContact: "Save contact",
    },
    showcase: {
      eyebrow: "Themes",
      heading: "Pick your style.",
      subhead:
        "Four artistic themes. From Parisian luxury to anime-inspired pop. Or let AI generate a custom one.",
      cta: "Pick mine",
    },
    howItWorks: {
      eyebrow: "How it works",
      heading: "Three gestures. One pro identity.",
      steps: [
        {
          title: "Create",
          body: "Identity, company, contact. All in minutes, from your phone.",
        },
        {
          title: "Share",
          body: "Link, QR code, or physical NFC card. One gesture to transmit your profile.",
        },
        {
          title: "Track",
          body: "Views, scans, saved contacts. Measure what actually works.",
        },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      heading: "Digital is free. Always.",
      subhead:
        "Create and share your digital card at no cost. Go physical whenever you want.",
      footnote:
        "Create your free account and order your NFC card when you're ready.",
      free: {
        label: "Digital card",
        price: "Free",
        period: "Forever · for life",
        features: [
          "Unlimited digital card",
          "4 artistic themes + AI",
          "QR code and share link",
          "Views and scans analytics",
          "No credit card required",
        ],
        cta: "Create my card",
      },
      nfc: {
        label: "NFC cards",
        price: "from €2.99",
        period: "One-time purchase · customizable",
        features: [
          "Physical NFC + QR card",
          "Linked to your digital card",
          "Customize: name, logo, date…",
          "Engraving included, printing optional",
          "Europe shipping",
        ],
        cta: "Customize my card",
      },
    },
    faq: {
      eyebrow: "FAQ",
      heading: "Your questions.",
      items: [
        {
          q: "Is it really free?",
          a: "Yes. The digital card is free forever, with no credit card required. You only pay if you order a physical NFC card.",
        },
        {
          q: "How much is an NFC card?",
          a: "From €2.99 for the base card. The price grows with the options you add (logo, date, printing). Shipping is extra.",
        },
        {
          q: "Do you sell my data?",
          a: "No. Never. Your data is stored in Europe, in line with GDPR. You can export or delete it at any time from your dashboard.",
        },
        {
          q: "Compatible with my phone?",
          a: "Yes. All Palgonic cards open in any browser, on iPhone or Android. No installation required for your contacts.",
        },
        {
          q: "What if I want to delete my account?",
          a: "You can delete your account at any time from your dashboard. All your data is permanently erased, no questions asked.",
        },
      ],
    },
    footer: {
      contact: "Contact",
      copyright: "© 2026 Palgonic",
    },
  },
} as const;

type T = (typeof COPY)[Lang];

// ============================================================
// Theme showcase personas
// ============================================================
const SHOWCASE = [
  {
    key: "elysee" as ThemeKey,
    initials: "ED",
    name: "Élise Dubois",
    title: { fr: "Avocate · Paris", en: "Attorney · Paris" },
    bio: {
      fr: "Droit des affaires. 15 ans d'expérience.",
      en: "Business law. 15 years of practice.",
    },
  },
  {
    key: "midnight" as ThemeKey,
    initials: "MR",
    name: "Marc Renard",
    title: { fr: "Consultant · Genève", en: "Consultant · Geneva" },
    bio: {
      fr: "Stratégie d'entreprise. Boards & CEO.",
      en: "Corporate strategy. Boards & CEO.",
    },
  },
  {
    key: "provence" as ThemeKey,
    initials: "AG",
    name: "Anaïs Garnier",
    title: { fr: "Galeriste · Lyon", en: "Gallerist · Lyon" },
    bio: {
      fr: "Art contemporain. Marais et Lyon.",
      en: "Contemporary art. Marais & Lyon.",
    },
  },
  {
    key: "tokyo" as ThemeKey,
    initials: "YT",
    name: "Yuki Tanaka",
    title: { fr: "Illustratrice · Bruxelles", en: "Illustrator · Brussels" },
    bio: {
      fr: "Édition jeunesse. Manga et BD.",
      en: "Children's books. Manga & comics.",
    },
  },
] as const;

// ============================================================
// SEO metadata
// ============================================================
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { lang } = await searchParams;
  const isEN = lang === "en";

  return {
    title: isEN
      ? "Palgonic — One card. One tap. One connection."
      : "Palgonic — Une carte. Un tap. Une connexion.",
    description: isEN
      ? "Digital business card with NFC + QR. Four artistic themes. Built for francophone independents. Free forever."
      : "Carte de visite digitale avec NFC + QR. Quatre thèmes artistiques. Faite pour les indépendants francophones. Gratuite à vie.",
    alternates: {
      canonical: isEN ? "/?lang=en" : "/",
      languages: { "fr-FR": "/", "en-US": "/?lang=en" },
    },
    openGraph: {
      type: "website",
      locale: isEN ? "en_US" : "fr_FR",
      siteName: "Palgonic",
    },
  };
}

// ============================================================
// Page
// ============================================================
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const currentLang: Lang = lang === "en" ? "en" : "fr";
  const t = COPY[currentLang];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="bg-creme-paper text-encre">
      <Nav signedIn={!!user} t={t} currentLang={currentLang} />
      <Hero signedIn={!!user} t={t} />
      <ThemeShowcase t={t} lang={currentLang} />
      <HowItWorks t={t} />
      <Pricing t={t} />
      <Faq t={t} />
      <Footer t={t} />
    </main>
  );
}

// ============================================================
// Nav
// ============================================================
function Nav({
  signedIn,
  t,
  currentLang,
}: {
  signedIn: boolean;
  t: T;
  currentLang: Lang;
}) {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="transition hover:opacity-80">
        <PalgonicLogo className="text-2xl" />
      </Link>

      <div className="hidden items-center gap-8 text-sm sm:flex">
        <a href="#themes" className="hover:text-foret transition">
          {t.nav.themes}
        </a>
        <a href="#fonctionnement" className="hover:text-foret transition">
          {t.nav.howItWorks}
        </a>
        <a href="#tarifs" className="hover:text-foret transition">
          {t.nav.pricing}
        </a>
        <a href="#faq" className="hover:text-foret transition">
          {t.nav.faq}
        </a>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/"
            className={
              currentLang === "fr"
                ? "font-bold text-encre"
                : "text-pierre hover:text-encre transition"
            }
          >
            FR
          </Link>
          <span className="text-pierre">·</span>
          <Link
            href="/?lang=en"
            className={
              currentLang === "en"
                ? "font-bold text-encre"
                : "text-pierre hover:text-encre transition"
            }
          >
            EN
          </Link>
        </div>

        {signedIn ? (
          <Link
            href="/dashboard"
            className="rounded-md bg-foret px-4 py-2 text-sm font-medium text-creme transition hover:bg-foret-deep"
          >
            {t.nav.dashboard}
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="hidden text-sm hover:text-foret sm:block transition"
            >
              {t.nav.signIn}
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-foret px-4 py-2 text-sm font-medium text-creme transition hover:bg-foret-deep"
            >
              {t.nav.signUp}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// ============================================================
// Hero
// ============================================================
function Hero({ signedIn, t }: { signedIn: boolean; t: T }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-12 pb-24 sm:pt-20 sm:pb-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="text-xs uppercase tracking-widest text-pierre">
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            {t.hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-encre/80">
            {t.hero.subhead}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={signedIn ? "/dashboard" : "/signup"}
              className="rounded-md bg-foret px-6 py-3.5 font-medium text-creme transition hover:bg-foret-deep"
            >
              {signedIn ? t.hero.ctaSignedIn : t.hero.ctaSignedOut}
            </Link>
            <a
              href="#fonctionnement"
              className="text-sm underline underline-offset-4 hover:text-foret"
            >
              {t.hero.secondary}
            </a>
          </div>
          <p className="mt-6 text-sm text-pierre">{t.hero.reassurance}</p>
        </div>

        <div className="hidden lg:block">
          <CardMockup t={t} />
        </div>
      </div>
    </section>
  );
}

function CardMockup({ t }: { t: T }) {
  return (
    <div className="relative">
      <div
        className="rounded-3xl border bg-white p-8 shadow-2xl"
        style={{ borderColor: "#D9D5CE" }}
      >
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pierre-soft font-display text-2xl text-encre/40">
            LM
          </div>
          <p className="mt-5 font-display text-2xl">Léa Marchand</p>
          <p className="mt-1 text-sm text-pierre">{t.mockup.role}</p>
        </div>

        <div className="mt-8 space-y-3">
          <div className="rounded-xl border border-pierre-soft p-4 text-sm">
            <span className="block text-xs uppercase tracking-wider text-pierre">
              {t.mockup.emailLabel}
            </span>
            <span className="mt-1 block">lea@studio-marchand.fr</span>
          </div>
          <div className="rounded-xl border border-pierre-soft p-4 text-sm">
            <span className="block text-xs uppercase tracking-wider text-pierre">
              {t.mockup.phoneLabel}
            </span>
            <span className="mt-1 block">+33 6 12 34 56 78</span>
          </div>
        </div>

        <div className="mt-6 w-full rounded-xl bg-foret py-3 text-center text-sm font-medium text-creme">
          {t.mockup.saveContact}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Theme showcase
// ============================================================
function ThemeShowcase({ t, lang }: { t: T; lang: Lang }) {
  return (
    <section id="themes" className="border-t border-pierre-soft py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs uppercase tracking-widest text-pierre">
          {t.showcase.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
          {t.showcase.heading}
        </h2>
        <p className="mt-3 max-w-xl text-encre/75">{t.showcase.subhead}</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {SHOWCASE.map((p) => (
            <ThemeShowcaseCard
              key={p.key}
              themeKey={p.key}
              persona={{
                name: p.name,
                initials: p.initials,
                title: p.title[lang],
                bio: p.bio[lang],
              }}
              saveLabel={t.mockup.saveContact}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-sm font-medium text-foret underline-offset-4 transition hover:underline"
          >
            {t.showcase.cta}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ThemeShowcaseCard({
  themeKey,
  persona,
  saveLabel,
}: {
  themeKey: ThemeKey;
  persona: { name: string; initials: string; title: string; bio: string };
  saveLabel: string;
}) {
  const theme = GENERIC_THEMES[themeKey];

  return (
    <div
      className="overflow-hidden rounded-3xl border p-8 shadow-xl transition hover:scale-[1.015]"
      style={{
        background: theme.overlay
          ? `${theme.overlay}, ${theme.background}`
          : theme.background,
        borderColor: theme.border,
        color: theme.foreground,
      }}
    >
      <p
        className="text-[10px] uppercase tracking-widest"
        style={{ color: theme.muted }}
      >
        {theme.name}
      </p>

      <div className="mt-8 flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
          }}
        >
          <span className="font-display text-lg">{persona.initials}</span>
        </div>
        <div className="min-w-0">
          <p className="font-display text-xl leading-tight">{persona.name}</p>
          <p className="text-sm" style={{ color: theme.muted }}>
            {persona.title}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed">{persona.bio}</p>

      <div
        className="mt-6 w-full rounded-xl py-3 text-center text-sm font-medium"
        style={{
          backgroundColor: theme.accent,
          color: theme.accentForeground,
        }}
      >
        {saveLabel}
      </div>
    </div>
  );
}

// ============================================================
// How it works
// ============================================================
function HowItWorks({ t }: { t: T }) {
  return (
    <section
      id="fonctionnement"
      className="border-y border-pierre-soft bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs uppercase tracking-widest text-pierre">
          {t.howItWorks.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
          {t.howItWorks.heading}
        </h2>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {t.howItWorks.steps.map((step, i) => (
            <div key={i}>
              <p className="font-display text-5xl text-foret">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-display text-2xl">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-encre/75">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Pricing — two blocks: free digital + NFC cards
// ============================================================
function Pricing({ t }: { t: T }) {
  return (
    <section id="tarifs" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-xs uppercase tracking-widest text-pierre">
          {t.pricing.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
          {t.pricing.heading}
        </h2>
        <p className="mt-3 max-w-xl text-encre/75">{t.pricing.subhead}</p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {/* Free digital card */}
          <div className="rounded-2xl border border-pierre-soft bg-white p-8">
            <p className="text-sm uppercase tracking-wider text-pierre">
              {t.pricing.free.label}
            </p>
            <p className="mt-4 font-display text-5xl">{t.pricing.free.price}</p>
            <p className="mt-1 text-sm text-pierre">{t.pricing.free.period}</p>

            <ul className="mt-8 space-y-3 text-sm">
              {t.pricing.free.features.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="mt-8 block rounded-md bg-foret py-3 text-center font-medium text-creme transition hover:bg-foret-deep"
            >
              {t.pricing.free.cta}
            </Link>
          </div>

          {/* NFC cards */}
          <div
            className="rounded-2xl border-2 bg-white p-8"
            style={{ borderColor: "#0E5C4D" }}
          >
            <p className="text-sm uppercase tracking-wider text-foret">
              {t.pricing.nfc.label}
            </p>
            <p className="mt-4 font-display text-5xl">{t.pricing.nfc.price}</p>
            <p className="mt-1 text-sm text-pierre">{t.pricing.nfc.period}</p>

            <ul className="mt-8 space-y-3 text-sm">
              {t.pricing.nfc.features.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="mt-8 block rounded-md bg-foret py-3 text-center font-medium text-creme transition hover:bg-foret-deep"
            >
              {t.pricing.nfc.cta}
            </Link>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-pierre">
          {t.pricing.footnote}
        </p>
      </div>
    </section>
  );
}

// ============================================================
// FAQ
// ============================================================
function Faq({ t }: { t: T }) {
  return (
    <section
      id="faq"
      className="border-t border-pierre-soft bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs uppercase tracking-widest text-pierre">
          {t.faq.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
          {t.faq.heading}
        </h2>

        <div className="mt-16 divide-y divide-pierre-soft">
          {t.faq.items.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="pr-4 font-display text-lg">{item.q}</span>
                <span className="text-2xl leading-none text-pierre transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-encre/80">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Footer
// ============================================================
function Footer({ t }: { t: T }) {
  return (
    <footer className="border-t border-pierre-soft py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <PalgonicLogo className="text-lg" />
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-pierre">
          <a href="#themes" className="hover:text-encre transition">
            {t.nav.themes}
          </a>
          <a href="#fonctionnement" className="hover:text-encre transition">
            {t.nav.howItWorks}
          </a>
          <a href="#tarifs" className="hover:text-encre transition">
            {t.nav.pricing}
          </a>
          <a href="#faq" className="hover:text-encre transition">
            {t.nav.faq}
          </a>
          <a
            href="mailto:hello@palgonic.com"
            className="hover:text-encre transition"
          >
            {t.footer.contact}
          </a>
        </div>
        <p className="text-xs text-pierre">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}
