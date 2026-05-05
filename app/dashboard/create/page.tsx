import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";

export default async function CreateCardPage({
    searchParams,
  }: {
    searchParams: Promise<{ cardName?: string }>;
  }) {
  const { userId } = await auth();
  const { cardName } = await searchParams;
  

  if (!userId) {
    redirect("/");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#fef3c7,transparent_30%),radial-gradient(circle_at_top_right,#bae6fd,transparent_28%),linear-gradient(135deg,#f8fafc,#ffffff,#fff7ed)] text-slate-900 px-6 py-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-xl shadow-slate-200/70 backdrop-blur">
  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-200/50 blur-2xl" />
  <div className="absolute -bottom-12 left-10 h-40 w-40 rounded-full bg-sky-200/50 blur-2xl" />

  <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
    <div>
      <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-lg">
        🕹️ Digital Card Studio
      </span>

      <a
  href="/dashboard"
  className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-100"
>
  ← Back to card manager
</a>

      <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
        Build your card like a game
      </h1>

      <p className="mt-3 max-w-2xl text-base font-medium text-slate-600">
        Complete the missions, unlock publishing, and create a beautiful digital card people will actually save.
      </p>
    </div>

    <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <p className="text-3xl">🏆</p>
      <p className="mt-2 text-sm font-black text-amber-700">
        Goal
      </p>
      <p className="text-sm font-semibold text-slate-700">
        Publish your first card
      </p>
    </div>
  </div>
</div>
  
        {/* Mission Cards */}
<div className="grid gap-4 md:grid-cols-3">
  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
      🧑‍💼
    </div>

    <h2 className="mt-4 text-xl font-black text-slate-950">
      Mission 1: Build identity
    </h2>

    <p className="mt-2 text-sm text-slate-600">
      Add your name, role and short profile presentation.
    </p>

    <div className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700">
      Required to publish
    </div>
  </div>

  <div className="rounded-3xl border border-sky-200 bg-sky-50 p-6 shadow-sm">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
      📞
    </div>

    <h2 className="mt-4 text-xl font-black text-slate-950">
      Mission 2: Add contact
    </h2>

    <p className="mt-2 text-sm text-slate-600">
      Add at least one way people can reach you.
    </p>

    <div className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-black text-sky-700">
      Phone, email or WhatsApp
    </div>
  </div>

  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
      🎨
    </div>

    <h2 className="mt-4 text-xl font-black text-slate-950">
      Mission 3: Style card
    </h2>

    <p className="mt-2 text-sm text-slate-600">
      Choose a theme and preview your final card.
    </p>

    <div className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-black text-amber-700">
      Make it yours
    </div>
  </div>
</div>


        {/* Main Form Area */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-950">
              Create your digital card
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Fill in your information below. Keep it short, clear and professional.
            </p>
          </div>
  
          <ProfileForm userId={userId} cardName={cardName || "Untitled card"} />
        </div>
      </section>
    </main>
  );
}
