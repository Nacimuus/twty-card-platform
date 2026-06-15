import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify ownership before showing analytics
  const { data: card } = await supabase
    .from("profiles")
    .select("id, card_name")
    .eq("id", cardId)
    .eq("user_id", user.id)
    .single();
  if (!card) notFound();

  const { data: analytics } = await supabase
    .from("card_analytics")
    .select("event_type")
    .eq("card_id", cardId);

  const countByType = (type: string) =>
    analytics?.filter((item) => item.event_type === type).length || 0;

  const stats = [
    { label: "Vues", value: countByType("view") },
    { label: "Scans QR", value: countByType("qr_scan") },
    { label: "Clics email", value: countByType("email_click") },
    { label: "Clics téléphone", value: countByType("phone_click") },
    { label: "Clics WhatsApp", value: countByType("whatsapp_click") },
    { label: "Téléchargements vCard", value: countByType("vcard_download") },
  ];

  return (
    <main className="min-h-screen bg-creme p-6 text-encre">
      <section className="mx-auto max-w-6xl">
        <h1 className="font-display text-4xl">Statistiques</h1>
        <p className="mt-2 text-pierre">
          Performance de votre carte Palgonic.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-pierre-soft bg-white p-6"
            >
              <p className="text-sm text-pierre">{stat.label}</p>
              <p className="mt-3 font-display text-4xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}