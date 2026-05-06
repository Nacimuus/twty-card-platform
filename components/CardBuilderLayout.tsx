import Link from "next/link";
import { builderSteps, getStepIndex } from "@/lib/builder-steps";

export function CardBuilderLayout({
  cardId,
  currentStep,
  preview,
  children,
}: {
  cardId: string;
  currentStep: string;
  preview: React.ReactNode;
  children: React.ReactNode;
}) {
  const currentIndex = getStepIndex(currentStep);
  const progress = ((currentIndex + 1) / builderSteps.length) * 100;

  const builderHeader = (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-black text-cyan-100">
          Step {currentIndex + 1} of {builderSteps.length}
        </p>

        <Link
          href="/dashboard"
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/20 hover:text-white"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-yellow-300 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {builderSteps.map((step) => (
          <Link
            key={step.id}
            href={`/dashboard/cards/${cardId}/builder/${step.id}`}
            className={`rounded-full px-4 py-2 text-xs font-black transition ${
              step.id === currentStep
                ? "bg-white text-slate-950"
                : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
            }`}
          >
            {step.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fde68a,transparent_30%),radial-gradient(circle_at_top_right,#67e8f9,transparent_28%),linear-gradient(135deg,#020617,#0f172a,#172554)] px-4 py-5 text-white sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Mobile */}
        <div className="grid grid-cols-1 gap-6 lg:hidden">
            <p className="rounded-2xl bg-red-500 p-4 text-white font-black lg:hidden">
  MOBILE FORM FIRST TEST
</p>
          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
            {builderHeader}
            {children}
          </section>

          <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
            <p className="mb-4 text-sm font-black text-cyan-100">
              ✨ Live preview
            </p>
            {preview}
          </aside>
        </div>

        {/* Desktop */}
        <div className="hidden gap-8 lg:grid lg:grid-cols-[420px_1fr]">
          <aside className="sticky top-6 h-fit rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
            <p className="mb-4 text-sm font-black text-cyan-100">
              ✨ Live preview
            </p>
            {preview}
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            {builderHeader}
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}