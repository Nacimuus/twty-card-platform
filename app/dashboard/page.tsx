import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateCardButton } from "@/components/CreateCardButton";
import { DeleteCardButton } from "@/components/DeleteCardButton";
import { FloatingAIAssistant } from "@/components/FloatingAIAssistant";
import { PalgonicLogo } from "@/components/PalgonicLogo";
import { CartButton } from "@/components/CartButton";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; slug?: string }>;
}) {
  const { published, slug } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: cards } = await supabase
    .from("profiles")
    .select(
      "id, card_name, full_name, company, title, bio, email, phone, whatsapp, linkedin, website, slug, updated_at, status, profile_image",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const publishedCount =
    cards?.filter((c) => c.status === "published").length || 0;
  const draftCount =
    cards?.filter((c) => c.status !== "published").length || 0;

  // ─── AI suggestions based on the latest card ─────────────
  const latestCard = cards?.[0];
  const aiSuggestions: string[] = [];

  if (!latestCard) {
    aiSuggestions.push(
      "Créez votre première carte pour démarrer votre identité digitale.",
    );
  } else {
    if (!latestCard.bio) {
      aiSuggestions.push("Ajoutez une bio pour gagner en crédibilité.");
    }
    if (!latestCard.linkedin) {
      aiSuggestions.push(
        "Ajoutez votre LinkedIn pour renforcer votre profil pro.",
      );
    }
    if (!latestCard.company) {
      aiSuggestions.push("Ajoutez les détails de votre entreprise.");
    }
    if (!latestCard.website) {
      aiSuggestions.push("Ajoutez votre site web pour gagner en visibilité.");
    }
    if (!latestCard.email && !latestCard.phone && !latestCard.whatsapp) {
      aiSuggestions.push(
        "Ajoutez vos coordonnées pour qu'on puisse vous joindre.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-creme text-encre">
      {/* ─── Top nav ────────────────────────────────────── */}
      <nav className="border-b border-pierre-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="transition hover:opacity-80">
            <PalgonicLogo className="text-xl" />
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-pierre sm:inline">{user.email}</span>
            <CartButton />
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-pierre transition hover:text-foret"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* ─── Just-published banner ────────────────────── */}
        {published === "true" && slug && (
          <div className="mb-8 rounded-2xl border border-foret/20 bg-foret/5 p-6">
            <p className="text-xs uppercase tracking-widest text-foret">
              Publiée
            </p>
            <p className="mt-2 font-display text-xl">
              Votre carte est en ligne.
            </p>
            <p className="mt-1 text-sm text-pierre">
              Partagez le lien avec votre réseau.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`/u/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-md bg-foret px-4 py-2 text-sm font-medium text-creme transition hover:bg-foret-deep"
              >
                Ouvrir la carte ↗
              </a>
              {cards?.find((c) => c.slug === slug)?.id && (
                <Link
                  href={`/order/${cards.find((c) => c.slug === slug)!.id}`}
                  className="inline-flex rounded-md border border-foret px-4 py-2 text-sm font-medium text-foret transition hover:bg-foret/5"
                >
                  Commander ma carte NFC →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* ─── Hero ─────────────────────────────────────── */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-tight">
              Vos cartes
            </h1>
            <p className="mt-2 text-pierre">
              Créez, partagez, suivez vos cartes digitales.
            </p>
          </div>
          <CreateCardButton />
        </header>

        {/* ─── Stats ────────────────────────────────────── */}
        {cards && cards.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Stat label="Total" value={cards.length} />
            <Stat label="Publiées" value={publishedCount} />
            <Stat label="Brouillons" value={draftCount} />
          </div>
        )}

        {/* ─── Cards grid / empty state ─────────────────── */}
        {cards && cards.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-pierre-soft bg-white p-10 text-center">
            <p className="font-display text-2xl">
              Aucune carte pour l'instant.
            </p>
            <p className="mt-2 text-sm text-pierre">
              Cliquez sur "Nouvelle carte" pour créer la vôtre.
            </p>
          </div>
        )}
      </div>

      <FloatingAIAssistant suggestions={aiSuggestions} />
    </main>
  );
}

// ════════════════════════════════════════════════════════════
// Subcomponents
// ════════════════════════════════════════════════════════════

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-pierre-soft bg-white p-5">
      <p className="text-xs uppercase tracking-widest text-pierre">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}

function CardItem({ card }: { card: any }) {
  const completedFields = [
    card.full_name,
    card.title,
    card.company,
    card.email ||
      card.phone ||
      card.whatsapp ||
      card.linkedin ||
      card.website,
  ].filter(Boolean).length;

  const completion = Math.round((completedFields / 4) * 100);

  const initials =
    card.full_name
      ?.split(" ")
      .filter(Boolean)
      .map((w: string) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "P";

  const isPublished = card.status === "published";
  const updatedDate = card.updated_at
    ? new Date(card.updated_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="flex flex-col rounded-2xl border border-pierre-soft bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-pierre-soft bg-creme">
            {card.profile_image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={card.profile_image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-sm text-pierre">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base text-encre">
              {card.card_name ||
                card.company ||
                card.full_name ||
                "Sans nom"}
            </p>
            <p className="truncate text-xs text-pierre">
              {card.title || "Sans titre"}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
            isPublished
              ? "bg-foret/10 text-foret"
              : "border border-pierre-soft text-pierre"
          }`}
        >
          {isPublished ? "Publiée" : "Brouillon"}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-pierre">Complétion</span>
          <span className="font-medium text-encre">{completion}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-pierre-soft">
          <div
            className="h-full bg-foret transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {updatedDate && (
        <p className="mt-3 text-xs text-pierre">Modifié le {updatedDate}</p>
      )}

      <div className="mt-5 flex flex-1 flex-col gap-2">
        <Link
          href={`/dashboard/cards/${card.id}/builder/identity`}
          className="rounded-md bg-foret px-3 py-2 text-center text-xs font-medium text-creme transition hover:bg-foret-deep"
        >
          Modifier
        </Link>

        <div className="grid grid-cols-2 gap-2">
          {isPublished && card.slug ? (
            <a
              href={`/u/${card.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-pierre-soft px-3 py-2 text-center text-xs font-medium text-encre transition hover:border-foret hover:text-foret"
            >
              Voir ↗
            </a>
          ) : (
            <span className="rounded-md border border-pierre-soft px-3 py-2 text-center text-xs font-medium text-pierre/60">
              Non publiée
            </span>
          )}

          <Link
            href={`/dashboard/cards/${card.id}/analytics`}
            className="rounded-md border border-pierre-soft px-3 py-2 text-center text-xs font-medium text-encre transition hover:border-foret hover:text-foret"
          >
            Statistiques
          </Link>
        </div>
        <Link
          href={`/order/${card.id}`}
          className="rounded-md bg-corail px-3 py-2 text-center text-xs font-medium text-white transition hover:bg-corail-deep"
        >
          Commander ma carte NFC →
        </Link>
      </div>

      <div className="mt-4 border-t border-pierre-soft pt-3 text-right">
        <DeleteCardButton cardId={card.id} />
      </div>
    </article>
  );
}
