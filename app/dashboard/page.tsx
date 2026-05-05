import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { DeleteCardButton } from "@/components/DeleteCardButton";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { FloatingAIAssistant } from "@/components/FloatingAIAssistant";
import { CreateCardButton } from "@/components/CreateCardButton";


async function createNewCard(formData: FormData) {
  
  "use server";

  const { userId } = await auth();
  const cardName = formData.get("card_name") as string;

  if (!userId) {
    redirect("/");
  }

  const newCardId = crypto.randomUUID();

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: newCardId,
      clerk_user_id: userId,
      card_name: cardName || "Untitled card",
      full_name: "",
      title: "",
      bio: "",
      slug: `card-${newCardId}`,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("CREATE CARD ERROR:", error);
    throw new Error(error?.message || "Could not create card");
  }

  redirect(`/dashboard/cards/${data.id}/builder/identity`);
}
  

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; slug?: string }>;
}) {
  const { userId } = await auth();
const { published, slug } = await searchParams;
  if (!userId) {
    redirect("/");
  }
  const { data: cards } = await supabase
  .from("profiles")
.select("id, card_name, full_name, company, title, bio, email, phone, whatsapp, linkedin, website, slug, updated_at, status, profile_image")
  .eq("clerk_user_id", userId)
  .order("created_at", { ascending: false });

const latestCard = cards?.[0];

const aiSuggestions: string[] = [];

if (!latestCard) {
  aiSuggestions.push("Create your first card to start building your digital identity.");
} else {
  if (!latestCard.bio) {
    aiSuggestions.push("Add your bio to build trust.");
  }

  if (!latestCard.linkedin) {
    aiSuggestions.push("Add LinkedIn to strengthen credibility.");
  }

  if (!latestCard.company) {
    aiSuggestions.push("Add company details for stronger positioning.");
  }

  if (!latestCard.website) {
    aiSuggestions.push("Add your website to drive more traffic.");
  }

  if (!latestCard.email && !latestCard.phone && !latestCard.whatsapp) {
    aiSuggestions.push("Add contact channels so people can reach you.");
  }
}

  return (
<main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#facc15_0%,transparent_24%),radial-gradient(circle_at_top_right,#22d3ee_0%,transparent_26%),radial-gradient(circle_at_bottom_left,#818cf8_0%,transparent_28%),linear-gradient(135deg,#020617,#0f172a,#172554)] px-4 py-5 text-white sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        {published === "true" && (
  <div className="rounded-[2.5rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
    <p className="text-4xl">🎉</p>

    <h2 className="mt-4 text-3xl font-black text-slate-950">
      Your card is now live!
    </h2>

    <p className="mt-2 text-slate-600">
      Congratulations. Your Twty Card is published and ready to share.
    </p>

    {slug && (
  <a
    href={`/u/${slug}`}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-6 inline-flex rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-1"
  >
    Open live card in new tab ↗
  </a>
)}
  </div>
)}
<div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
  <div className="flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-yellow-300 text-xl font-black text-slate-950 shadow-lg">
      ✦
    </div>

    <div>
      <p className="text-lg font-black text-white">Twty Cards</p>
      <p className="text-xs font-bold text-white/50">Your digital identity lab</p>
    </div>
  </div>

  <div className="flex items-center gap-3">
<SignOutButton redirectUrl="/">
  <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/20 cursor-pointer">
    Log out
  </span>
</SignOutButton>

    <UserButton />
  </div>
</div>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[2.5rem] sm:p-8">
  <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-yellow-300/20 blur-3xl" />

  <div className="relative">
    <p className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-cyan-100">
      🚀 Your Card Control Center
    </p>

   <h1 className="mt-6 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
      Build your digital identity like a game.
    </h1>

    <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/65">
      Create beautiful business cards, complete your profile step by step, publish, share, and track engagement from one playful control center.
    </p>

<div className="mt-8">
  <CreateCardButton />
</div>

    <div className="mt-8 grid gap-4 md:grid-cols-3">
      <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/60 p-5 shadow-xl">
        <p className="text-sm font-bold text-white/50">Total cards</p>
        <p className="mt-2 text-4xl font-black text-white">{cards?.length || 0}</p>
      </div>

      <div className="rounded-[1.7rem] border border-white/10 bg-white/10 p-5 shadow-xl">
        <p className="text-sm font-bold text-white/50">Published</p>
        <p className="mt-2 text-4xl font-black text-emerald-300">
          {cards?.filter((card) => card.status === "published").length || 0}
        </p>
      </div>

      <div className="rounded-[1.7rem] border border-white/10 bg-white/10 p-5 shadow-xl">
        <p className="text-sm font-bold text-white/50">Drafts</p>
        <p className="mt-2 text-4xl font-black text-yellow-300">
          {cards?.filter((card) => card.status === "draft").length || 0}
        </p>
      </div>
    </div>
  </div>
</div>

       {cards && cards.length > 0 ? (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
{cards.map((card) => {
  const completedFields = [
    card.full_name,
    card.title,
    card.company,
    card.email || card.phone || card.whatsapp || card.linkedin || card.website,
  ].filter(Boolean).length;

  const completion = Math.round((completedFields / 4) * 100);

  return (
      <div
  key={card.id}
  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-cyan-500/20"
>
  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/15 blur-3xl" />

 <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-6 text-white">
   <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black backdrop-blur">
      {card.status || "draft"}
    </div>

<div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-2xl font-black shadow-xl backdrop-blur">
  {card.profile_image ? (
    <img
      src={card.profile_image}
      alt={card.full_name || "Profile"}
      className="h-full w-full object-cover"
    />
  ) : (
    <span>
      {card.full_name
        ?.split(" ")
        .map((word: string) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "TC"}
    </span>
  )}
</div>

    <h3 className="mt-5 text-2xl font-black">
      {card.card_name || card.company || card.full_name || "Untitled card"}
    </h3>

    <p className="mt-1 text-sm font-semibold text-white/70">
      {card.title || "No title yet"}
    </p>
  </div>

  <div className="p-6">
   <p className="text-xs font-bold text-white/50">
  Last updated{" "}
  <span className="text-xs font-bold text-cyan-300">
    {card.updated_at
      ? new Date(card.updated_at).toLocaleDateString()
      : "recently"}
  </span>
</p>

<div className="mt-4">
  <div className="mb-2 flex items-center justify-between">
   <p className="text-xs font-black text-white/50">Mission Progress</p>
    <p className="text-xs font-black text-yellow-300">{completion}% XP</p>
  </div>

  <div className="h-3 overflow-hidden rounded-full bg-white/10">
    <div
     className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-yellow-300 transition-all"
      style={{ width: `${completion}%` }}
    />
  </div>
</div>
<div className="mt-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-300">
  {completion < 40
    ? "Beginner"
    : completion < 70
    ? "Builder"
    : completion < 100
    ? "Pro"
    : "Elite"}
</div>

<div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
  <a
    href={`/dashboard/cards/${card.id}/builder/identity`}
    className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:scale-[1.02]"
  >
    Edit
  </a>

  <a
    href={`/u/${card.slug}`}
    target="_blank"
    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/15"
  >
    Preview
  </a>

  <a
    href={`/dashboard/cards/${card.id}/analytics`}
    className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-center text-sm font-black text-cyan-300 transition hover:bg-cyan-300/20"
  >
    Analytics
  </a>

  <button className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-4 py-3 text-sm font-black text-yellow-300 transition hover:bg-yellow-300/20">
    Share
  </button>
</div>




    <div className="mt-4">
      <DeleteCardButton cardId={card.id} />
    </div>
  </div>
</div>
    );
  })}
  </div>
) : (
  <div className="grid gap-4 md:grid-cols-3">
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-center shadow-sm">
      <p className="text-4xl">💳</p>
      <h3 className="mt-4 text-lg font-black text-slate-950">
        No card yet
      </h3>
      <p className="mt-2 text-sm text-slate-500">
        Your cards will appear here after creation.
      </p>
    </div>
  </div>
)}




      </section>
      <FloatingAIAssistant suggestions={aiSuggestions} />
    </main>
  );
}
