import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateCardForm } from "@/components/CreateCardForm";

export default async function NewCardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }
<a
  href="/dashboard"
  className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-100"
>
  ← Back to card manager
</a>
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fef3c7,transparent_30%),radial-gradient(circle_at_top_right,#bae6fd,transparent_28%),linear-gradient(135deg,#f8fafc,#ffffff,#fff7ed)] px-6 py-10 text-slate-900">
      <section className="mx-auto flex min-h-[80vh] w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-white/80 bg-white p-8 shadow-xl">
          <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-700">
            Step 1
          </p>

          <h1 className="mt-5 text-4xl font-black text-slate-950">
            Name your eBusiness card
          </h1>

          <p className="mt-3 text-sm font-medium text-slate-500">
            Example: Nacim Personal, Twty Consulting, Sales Profile, Event Card.
          </p>

          <CreateCardForm />
        </div>
      </section>
    </main>
  );
}