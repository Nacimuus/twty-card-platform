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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fde68a,transparent_30%),radial-gradient(circle_at_top_right,#67e8f9,transparent_28%),linear-gradient(135deg,#020617,#0f172a,#172554)] px-4 py-5 text-white sm:p-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[420px_1fr] lg:gap-8">


        <section className="order-1 rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl md:p-8 lg:order-2">
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
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

          {children}
        </section>

                <aside className="order-2 h-fit rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl lg:sticky lg:top-6 lg:order-1 lg:block lg:p-5">
          <p className="mb-4 text-sm font-black text-cyan-100">
            ✨ Live preview
          </p>
          {preview}
        </aside>
      </div>
    </main>
  );
}