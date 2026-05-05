import { supabase } from "@/lib/supabase";
import { ProfileQrCode } from "@/components/ProfileQrCode";
import { defaultAITheme } from "@/lib/ai-theme-schema";
import { TrackedActionLink } from "@/components/TrackedActionLink";

export default async function PublicCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Profile not found</p>
      </main>
    );
  }
  await supabase.from("card_analytics").insert({
  card_id: data.id,
  event_type: "view",
});

  const initials = data.full_name
    ? data.full_name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .slice(0, 2)
    : "TW";

    const genericThemes = {
        luxury: {
          page: "bg-[radial-gradient(circle_at_top,#facc15_0%,transparent_28%),linear-gradient(135deg,#020617,#111827,#000)] text-white",
          card: "bg-white/10 border border-yellow-400/30 shadow-[0_0_45px_rgba(250,204,21,0.22)] backdrop-blur-xl",
          accent: "text-yellow-300",
          button: "bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 text-black shadow-[0_0_25px_rgba(250,204,21,0.45)] hover:scale-105",
          bubble: "bg-yellow-400/15 border border-yellow-300/30 text-yellow-100",
          decor: "✨",
          effect: "before:absolute before:inset-0 before:rounded-[2rem] before:bg-gradient-to-r before:from-transparent before:via-yellow-300/10 before:to-transparent",
        },
      
        tech: {
          page: "bg-[radial-gradient(circle_at_top_right,#22d3ee_0%,transparent_30%),linear-gradient(135deg,#020617,#082f49,#020617)] text-cyan-50",
          card: "bg-cyan-950/40 border border-cyan-300/20 shadow-[0_0_45px_rgba(34,211,238,0.25)] backdrop-blur-xl",
          accent: "text-cyan-300",
          button: "bg-cyan-300 text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.5)] hover:bg-cyan-200 hover:scale-105",
          bubble: "bg-cyan-300/10 border border-cyan-300/30 text-cyan-100",
          decor: "⌁",
          effect: "before:absolute before:inset-0 before:rounded-[2rem] before:bg-[linear-gradient(90deg,transparent,rgba(34,211,238,.12),transparent)]",
        },
      
        nature: {
          page: "bg-[radial-gradient(circle_at_bottom_left,#86efac_0%,transparent_28%),linear-gradient(135deg,#052e16,#14532d,#ecfdf5)] text-emerald-950",
          card: "bg-white/75 border border-emerald-200 shadow-[0_25px_70px_rgba(22,101,52,0.25)] backdrop-blur-xl",
          accent: "text-emerald-700",
          button: "bg-emerald-700 text-white shadow-[0_15px_35px_rgba(21,128,61,0.35)] hover:bg-emerald-600 hover:-translate-y-1",
          bubble: "bg-emerald-100 border border-emerald-200 text-emerald-900",
          decor: "🍃",
          effect: "before:absolute before:-top-10 before:-right-10 before:h-32 before:w-32 before:rounded-full before:bg-emerald-300/30 before:blur-2xl",
        },
      
        creative: {
          page: "bg-[radial-gradient(circle_at_top_left,#f0abfc_0%,transparent_30%),radial-gradient(circle_at_bottom_right,#fb7185_0%,transparent_28%),linear-gradient(135deg,#fff1f2,#faf5ff,#ffffff)] text-slate-900",
          card: "bg-white/70 border border-pink-200 shadow-[0_25px_70px_rgba(236,72,153,0.25)] backdrop-blur-xl",
          accent: "text-fuchsia-600",
          button: "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 text-white shadow-[0_0_28px_rgba(217,70,239,0.35)] hover:rotate-1 hover:scale-105",
          bubble: "bg-pink-100 border border-pink-200 text-pink-900",
          decor: "✦",
          effect: "before:absolute before:inset-0 before:rounded-[2rem] before:bg-[radial-gradient(circle_at_20%_20%,rgba(217,70,239,.16),transparent_25%)]",
        },
      
        minimal: {
          page: "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-950",
          card: "bg-white border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)]",
          accent: "text-slate-900",
          button: "bg-slate-950 text-white shadow-lg hover:bg-slate-800 hover:-translate-y-1",
          bubble: "bg-slate-100 border border-slate-200 text-slate-800",
          decor: "",
          effect: "before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-slate-200",
        },
      
        royal: {
          page: "bg-[radial-gradient(circle_at_top,#c084fc_0%,transparent_26%),linear-gradient(135deg,#1e1b4b,#312e81,#020617)] text-white",
          card: "bg-purple-950/50 border border-purple-300/25 shadow-[0_0_50px_rgba(168,85,247,0.3)] backdrop-blur-xl",
          accent: "text-purple-200",
          button: "bg-gradient-to-r from-purple-300 via-fuchsia-400 to-yellow-300 text-slate-950 shadow-[0_0_30px_rgba(192,132,252,0.45)] hover:scale-105",
          bubble: "bg-purple-300/10 border border-purple-200/30 text-purple-100",
          decor: "◆",
          effect: "before:absolute before:-top-8 before:left-1/2 before:h-24 before:w-24 before:-translate-x-1/2 before:rounded-full before:bg-purple-300/20 before:blur-2xl",
        },
      };
      
      const theme =
  genericThemes[data.generic_theme as keyof typeof genericThemes] ||
  genericThemes.luxury;
const activeAITheme = {
  ...defaultAITheme,
  ...(data.ai_theme?.aiTheme || data.ai_theme || {}),
};

const aiButtonStyle =
  data.theme_mode === "ai"
    ? {
background: activeAITheme.buttons?.background,
color: activeAITheme.buttons?.color,
boxShadow: activeAITheme.buttons?.shadow,
      }
    : undefined;
    
        return (
            <main
 className={`min-h-screen px-5 py-6 ${
  data.theme_mode === "ai" ? "text-white" : theme.page
}`}
 style={
  data.theme_mode === "ai"
    ? {
        background:
          activeAITheme.background?.value ??
          `linear-gradient(135deg, ${data.primary_color}, ${data.secondary_color})`,
      }
    : undefined
}
>
            
              <section className="mx-auto w-full max-w-md">
                {/* Top Bar */}
                <div className="mb-5 flex items-center justify-between">
                  <a
                    href={data.website || "#"}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur"
                  >
                    ✦ {data.full_name ? data.full_name.split(" ")[0] : "Digital Card"}
                  </a>
          
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                    NFC Profile
                  </span>
                </div>
          
                {/* Main Card */}
                <section
  className={`relative animate-[cardEnter_.7s_ease-out] overflow-hidden rounded-[2rem] p-6 ${
    data.theme_mode === "ai" ? "" : `${theme.card} ${theme.effect}`
  }`}
  style={
    data.theme_mode === "ai"
      ? {
          background: activeAITheme.card?.background,
          border: activeAITheme.card.border,
          boxShadow: activeAITheme.card.shadow,
          borderRadius: activeAITheme.card.radius,
          backdropFilter:  activeAITheme.effects?.glass ? "blur(18px)" : undefined,
        }
      : undefined
  }
>
                <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shine_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="pointer-events-none absolute right-8 top-10 h-2 w-2 animate-ping rounded-full bg-white/40" />
                <div className="pointer-events-none absolute bottom-24 left-8 h-1.5 w-1.5 animate-pulse rounded-full bg-white/30" />
                <div className="pointer-events-none absolute left-1/2 top-20 h-1 w-1 animate-ping rounded-full bg-white/20" />

                  {/* Profile Bubble */}
                  <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
  <div className="absolute inset-0 animate-pulse rounded-full bg-white/25 blur-2xl" />

  <div className={`relative flex h-full w-full items-center justify-center rounded-full p-1 shadow-2xl ${theme.bubble}`}>
                    {data.profile_image ? (
                      <img
                        src={data.profile_image}
                        alt={data.full_name || "Profile picture"}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-4xl font-black text-white">
                        {initials}
                      </div>
    )}
    </div>
  </div>
          
                  {/* Name */}
                  <div className="mt-6 text-center">
                    <h1 
  
  className={`mt-1 text-3xl font-light ${
    data.theme_mode === "ai" ? "" : theme.accent
  }`}
  style={
    data.theme_mode === "ai"
      ? { color: activeAITheme.text?.titleColor }
      : undefined
  }
>
                      {data.full_name?.split(" ")[0] || "Your"}
                    </h1>
                    <p
  className="text-4xl font-black leading-none"
  style={
    data.theme_mode === "ai"
      ? { color: activeAITheme.text?.nameColor }
      : undefined
  }
>
                      {data.full_name?.split(" ").slice(1).join(" ") || "Name"}
                    </p>
          
                    <p
  className={`mt-4 text-sm font-bold uppercase tracking-[0.18em] ${
    data.theme_mode === "ai" ? "" : theme.accent
  }`}
  style={
    data.theme_mode === "ai"
      ? { color: activeAITheme.text?.titleColor }
      : undefined
  }
>
                      {data.title || "Your title"}
                    </p>
          
                    <p
  className="mt-5 text-sm leading-relaxed opacity-75"
  style={
    data.theme_mode === "ai"
      ? { color: activeAITheme.text?.bioColor }
      : undefined
  }
>
                      {data.bio || "Your short profile presentation will appear here."}
                    </p>
                  </div>
          
                  {/* Quick Actions */}
                  <div className="mt-8">
                    <h2 className="mb-3 text-left text-sm font-black uppercase tracking-[0.2em] opacity-70">
                      Quick Actions
                    </h2>
          
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`/api/vcard/${slug}`}
                        className={`col-span-2 rounded-2xl px-4 py-4 text-center font-black shadow-lg transition ${
  data.theme_mode === "ai"
    ? "hover:-translate-y-1 active:scale-95"
    : theme.button
}`}
style={aiButtonStyle}
                      >
                        ＋ Save Contact
                        </a>
{data.email && (
  <TrackedActionLink
    cardId={data.id}
    eventType="email_click"
    href={`mailto:${data.email}`}
    className={`rounded-2xl px-5 py-3 font-bold transition ${
      data.theme_mode === "ai"
        ? "hover:-translate-y-1 active:scale-95"
        : theme.button
    }`}
    style={aiButtonStyle}
  >
    Email
  </TrackedActionLink>
)}
                    
          
                      {data.phone && (
<TrackedActionLink
  cardId={data.id}
  eventType="phone_click"
  href={`tel:${data.phone}`}
  className={`rounded-2xl px-5 py-3 font-bold transition ${
    data.theme_mode === "ai"
      ? "hover:-translate-y-1 active:scale-95"
      : theme.button
  }`}
  style={aiButtonStyle}
>
  Call
</TrackedActionLink>
                      )}
          
                      {data.whatsapp && (
<TrackedActionLink
  cardId={data.id}
  eventType="whatsapp_click"
  href={`https://wa.me/${data.whatsapp}`}
  className={`rounded-2xl px-5 py-3 font-bold transition ${
    data.theme_mode === "ai"
      ? "hover:-translate-y-1 active:scale-95"
      : theme.button
  }`}
  style={aiButtonStyle}
>
  WhatsApp
</TrackedActionLink>
                      )}
          
                      {data.linkedin && (
<TrackedActionLink
  cardId={data.id}
  eventType="linkedin_click"
  href={data.linkedin}
  className={`rounded-2xl px-5 py-3 font-bold transition ${
    data.theme_mode === "ai"
      ? "hover:-translate-y-1 active:scale-95"
      : theme.button
  }`}
  style={aiButtonStyle}
>
  LinkedIn
</TrackedActionLink>
                      )}
                    </div>
                  </div>
          
                  <div className="my-7 h-px bg-white/10" />
                  {/* Profile */}
                  <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-5 text-left">
                    <h2 className="text-lg font-black">Profile</h2>
                    <p className="mt-3 text-sm leading-relaxed opacity-75">
                      {data.bio ||
                        "A professional digital profile designed to help people connect quickly, save your contact and discover your work."}
                    </p>
          
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">Digital Card</span>
                      <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">NFC Profile</span>
                      <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">Professional</span>
                      <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">Networking</span>
                    </div>
                  </div>
          
                  <div className="my-7 h-px bg-white/10" />

                 {data.company_description && (
  <section className="mt-6 rounded-[1.7rem] border border-white/10 bg-white/10 p-5 text-left backdrop-blur-xl">
    <div className="flex items-center gap-3">
      {data.company_logo && (
        <img
          src={data.company_logo}
          alt={`${data.company_name || "Company"} logo`}
          className="h-12 w-12 rounded-2xl object-cover shadow-lg"
        />
      )}

      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
          Company
        </p>

        {data.company_name && (
          <h3 className="text-lg font-black text-white">
            {data.company_name}
          </h3>
        )}
      </div>
    </div>

    <p className="mt-4 text-sm leading-6 text-white/80">
      {data.company_description}
    </p>

    {data.company_services && data.company_services.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {data.company_services.map((service: string) => (
          <span
            key={service}
            className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white/80"
          >
            {service}
          </span>
        ))}
      </div>
    )}

    {data.company_website && (
      <a
        href={data.company_website}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-4 inline-flex rounded-2xl px-4 py-3 text-sm font-black transition ${
          data.theme_mode === "ai"
            ? "hover:-translate-y-1 active:scale-95"
            : theme.button
        }`}
        style={aiButtonStyle}
      >
        {data.company_cta_label || "Visit company website"}
      </a>
    )}
  </section>
)}

                  {/* Company / Discover */}
                  {(data.website || data.linkedin) && (
                    <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-5 text-left">
                      <h2 className="text-lg font-black">Discover More</h2>
          
                      <div className="mt-4 grid gap-3">
                        {data.website && (
                          <a
  href={data.website}
  className={`rounded-2xl px-4 py-3 text-center font-black transition ${
    data.theme_mode === "ai"
      ? "hover:-translate-y-1 active:scale-95"
      : theme.button
  }`}
  style={aiButtonStyle}
>
  Visit Website
</a>
                        )}
          
                        {data.linkedin && (
                          <a href={data.linkedin} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center font-bold">
                            LinkedIn Profile
                          </a>
                        )}
                      </div>
                    </div>
                  )}
          
          <div className="my-7 h-px bg-white/10" />

                  {/* QR */}
                  <div className={`mt-6 rounded-3xl p-5 text-center ${
  data.theme_mode === "ai" ? "" : theme.bubble
}`}style={
  data.theme_mode === "ai"
    ? {
        background: activeAITheme.card?.background,
        border: activeAITheme.card.border,
      }
    : undefined
}>
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] opacity-60">
                      Scan my card
                    </p>
                    <ProfileQrCode slug={slug} />
                  </div>
          
                  <p className="mt-6 text-center text-xs opacity-60">
                    Tap. Connect. Remember.
                    <br />
                    Premium digital business card powered by NFC.
                  </p>
                  </section>
              </section>
              <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
  <a
  href={`/api/vcard/${slug}`}
  className={`col-span-2 rrounded-full px-4 py-4 text-center font-black shadow-lg transition ${
    data.theme_mode === "ai"
      ? "hover:-translate-y-1 active:scale-95"
      : theme.button
  }`}
  style={aiButtonStyle}
>
  ＋ Save Contact
</a>
</div>
            </main>
          );
        }