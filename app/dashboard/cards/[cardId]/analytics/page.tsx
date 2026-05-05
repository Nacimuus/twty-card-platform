import { supabase } from "@/lib/supabase";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;

  const { data: analytics } = await supabase
    .from("card_analytics")
    .select("event_type")
    .eq("card_id", cardId);

  const countByType = (type: string) =>
    analytics?.filter((item) => item.event_type === type).length || 0;

  const stats = [
    { label: "Views", value: countByType("view") },
    { label: "QR scans", value: countByType("qr_scan") },
    { label: "Email clicks", value: countByType("email_click") },
    { label: "Phone clicks", value: countByType("phone_click") },
    { label: "WhatsApp clicks", value: countByType("whatsapp_click") },
    { label: "vCard downloads", value: countByType("vcard_download") },
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black">Card analytics</h1>
        <p className="mt-2 text-white/60">
          Performance insights for your Twty Card
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[2rem] border border-white/10 bg-white/10 p-6"
            >
              <p className="text-sm font-bold text-white/50">
                {stat.label}
              </p>

              <p className="mt-3 text-4xl font-black">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}