"use client";

import { useState } from "react";
import Link from "next/link";
import {
  computeCardPrice,
  defaultCardConfig,
  formatEuros,
  type CardConfig,
  type Material,
  type Finish,
  type SideElements,
} from "@/lib/card-pricing";
import { PhysicalCardPreview, type CardData } from "@/components/PhysicalCardPreview";

type Product = {
  id: string;
  name: string;
  base_price: number;
  in_stock: boolean;
};

const ELEMENT_KEYS: { key: keyof SideElements; label: string; hint: string }[] =
  [
    { key: "contact", label: "Coordonnées", hint: "Email, téléphone, site web" },
    { key: "logo", label: "Logo", hint: "Votre logo ou photo" },
    { key: "qr", label: "QR code", hint: "Vers votre carte digitale" },
  ];

export function CardOrderClient({
  data,
  products,
  sourceCardId,
}: {
  data: CardData;
  products: Product[];
  sourceCardId: string;
}) {
  const [config, setConfig] = useState<CardConfig>(defaultCardConfig());
  const breakdown = computeCardPrice(config);

  // ─── Update helpers ───────────────────────────────
  function setMaterial(material: Material) {
    setConfig((c) => ({ ...c, material }));
  }
  function setFinish(finish: Finish) {
    setConfig((c) => ({ ...c, finish }));
  }
  function toggleFront(key: keyof SideElements) {
    setConfig((c) => ({
      ...c,
      front: { ...c.front, [key]: !c.front[key] },
    }));
  }
  function toggleBackEnabled() {
    setConfig((c) => ({
      ...c,
      back: { ...c.back, enabled: !c.back.enabled },
    }));
  }
  function toggleBack(key: keyof SideElements) {
    setConfig((c) => ({
      ...c,
      back: {
        ...c.back,
        elements: { ...c.back.elements, [key]: !c.back.elements[key] },
      },
    }));
  }

  function addToCart() {
    // Cart logic is wired in Phase 10.4. For now, log the config + price.
    console.log("ORDER CONFIG:", { sourceCardId, config, total: breakdown.total });
    alert(
      `Configuration prête : ${formatEuros(breakdown.total)}\n\n(Le panier arrive à l'étape suivante.)`,
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* ─── LEFT: options ─────────────────────────── */}
        <div className="order-2 lg:order-1">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Personnalisez votre carte
          </h1>
          <p className="mt-2 text-pierre">
            Les informations proviennent de votre carte digitale.
          </p>

          {/* Material */}
          <section className="mt-8">
            <h2 className="font-display text-lg">Matériau</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {products.map((p) => {
                const selected = config.material === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={!p.in_stock}
                    onClick={() => setMaterial(p.id as Material)}
                    className={`rounded-xl border p-3 text-left text-sm transition ${
                      selected
                        ? "border-foret bg-foret/5"
                        : "border-pierre-soft hover:border-pierre"
                    } ${!p.in_stock ? "cursor-not-allowed opacity-45" : ""}`}
                  >
                    <span className="block font-medium">{p.name}</span>
                    <span className="mt-1 block text-xs text-pierre">
                      {p.in_stock ? formatEuros(p.base_price) : "Épuisé"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Front elements */}
          <section className="mt-8">
            <h2 className="font-display text-lg">Recto</h2>
            <p className="text-xs text-pierre">
              Votre nom est inclus. +0,30 € par élément ajouté.
            </p>
            <div className="mt-3 space-y-2">
              {ELEMENT_KEYS.map((el) => (
                <ToggleRow
                  key={el.key}
                  label={el.label}
                  hint={el.hint}
                  checked={config.front[el.key]}
                  onChange={() => toggleFront(el.key)}
                />
              ))}
            </div>
          </section>

          {/* Back side */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg">Verso</h2>
                <p className="text-xs text-pierre">
                  Débloquez la 2e face pour +0,50 €.
                </p>
              </div>
              <ToggleSwitch
                checked={config.back.enabled}
                onChange={toggleBackEnabled}
              />
            </div>

            {config.back.enabled && (
              <div className="mt-3 space-y-2 border-l-2 border-pierre-soft pl-4">
                {ELEMENT_KEYS.map((el) => (
                  <ToggleRow
                    key={el.key}
                    label={el.label}
                    hint={el.hint}
                    checked={config.back.elements[el.key]}
                    onChange={() => toggleBack(el.key)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Finish */}
          <section className="mt-8">
            <h2 className="font-display text-lg">Finition</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFinish("engraving")}
                className={`rounded-xl border p-4 text-left transition ${
                  config.finish === "engraving"
                    ? "border-foret bg-foret/5"
                    : "border-pierre-soft hover:border-pierre"
                }`}
              >
                <span className="block text-sm font-medium">Gravure</span>
                <span className="mt-1 block text-xs text-pierre">
                  Incluse · gratuit
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFinish("printing")}
                className={`rounded-xl border p-4 text-left transition ${
                  config.finish === "printing"
                    ? "border-foret bg-foret/5"
                    : "border-pierre-soft hover:border-pierre"
                }`}
              >
                <span className="block text-sm font-medium">Impression</span>
                <span className="mt-1 block text-xs text-pierre">+1,00 €</span>
              </button>
            </div>
          </section>
        </div>

        {/* ─── RIGHT: preview + price ─────────────────── */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-8">
            <div className="space-y-5">
              <PhysicalCardPreview
                side="front"
                data={data}
                elements={config.front}
                finish={config.finish}
                label="Recto"
              />
              {config.back.enabled && (
                <PhysicalCardPreview
                  side="back"
                  data={data}
                  elements={config.back.elements}
                  finish={config.finish}
                  label="Verso"
                />
              )}
            </div>

            {/* Price breakdown */}
            <div className="mt-6 rounded-2xl border border-pierre-soft bg-white p-5">
              <div className="space-y-1.5 text-sm">
                {breakdown.lines.map((line, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-encre/75">{line.label}</span>
                    <span>{formatEuros(line.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-pierre-soft pt-4">
                <span className="text-sm text-pierre">
                  Livraison incluse
                </span>
                <span className="font-display text-2xl">
                  {formatEuros(breakdown.total)}
                </span>
              </div>

              <button
                type="button"
                onClick={addToCart}
                className="mt-5 w-full rounded-md bg-foret py-3.5 font-medium text-creme transition hover:bg-foret-deep"
              >
                Ajouter au panier
              </button>

              <Link
                href="/dashboard"
                className="mt-3 block text-center text-sm text-pierre underline-offset-2 hover:text-foret hover:underline"
              >
                Retour au tableau de bord
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Small UI helpers ─────────────────────────────
function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
        checked ? "border-foret bg-foret/5" : "border-pierre-soft hover:border-pierre"
      }`}
    >
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-pierre">{hint}</span>
      </span>
      <ToggleSwitch checked={checked} onChange={onChange} asSpan />
    </button>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  asSpan = false,
}: {
  checked: boolean;
  onChange?: () => void;
  asSpan?: boolean;
}) {
  const inner = (
    <span
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        checked ? "bg-foret" : "bg-pierre-soft"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </span>
  );

  if (asSpan) return inner;

  return (
    <button type="button" onClick={onChange} aria-pressed={checked}>
      {inner}
    </button>
  );
}
