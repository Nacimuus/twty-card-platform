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
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-widest text-pierre">
          Étape {currentIndex + 1} sur {builderSteps.length}
        </p>

        <Link
          href="/dashboard"
          className="text-sm text-pierre transition hover:text-foret"
        >
          ← Tableau de bord
        </Link>
      </div>

      {/* Progress bar */}
      <div className="h-1 overflow-hidden rounded-full bg-pierre-soft">
        <div
          className="h-full rounded-full bg-foret transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {builderSteps.map((step, i) => {
          const active = step.id === currentStep;
          const done = i < currentIndex;
          return (
            <Link
              key={step.id}
              href={`/dashboard/cards/${cardId}/builder/${step.id}`}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-foret text-creme"
                  : done
                    ? "bg-foret/10 text-foret hover:bg-foret/15"
                    : "border border-pierre-soft text-pierre hover:border-foret hover:text-foret"
              }`}
            >
              {step.label}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-creme text-encre">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Mobile: form first, preview below */}
        <div className="grid grid-cols-1 gap-6 lg:hidden">
          <section className="rounded-2xl border border-pierre-soft bg-white p-5 shadow-sm">
            {builderHeader}
            {children}
          </section>

          <aside className="h-fit rounded-2xl border border-pierre-soft bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs uppercase tracking-widest text-pierre">
              Aperçu en direct
            </p>
            {preview}
          </aside>
        </div>

        {/* Desktop: preview left, form right */}
        <div className="hidden gap-8 lg:grid lg:grid-cols-[420px_1fr]">
          <aside className="sticky top-6 h-fit rounded-2xl border border-pierre-soft bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs uppercase tracking-widest text-pierre">
              Aperçu en direct
            </p>
            {preview}
          </aside>

          <section className="rounded-2xl border border-pierre-soft bg-white p-8 shadow-sm">
            {builderHeader}
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
