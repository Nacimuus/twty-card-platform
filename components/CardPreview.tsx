import { AITheme, defaultAITheme } from "@/lib/ai-theme-schema";

type CardPreviewProps = {
    fullName: string;
    title: string;
    bio: string;
    phone: string;
    email: string;
    whatsapp: string;
    linkedin: string;
    website: string;
    profileImage: string;
    themeMode: string;
    genericTheme: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundStyle: string;
    buttonStyle: string;
    aiTheme?: AITheme;
company?: string;
companyDescription?: string;
companyWebsite?: string;
companyLogo?: string;
companyServices?: string[];
companyCtaLabel?: string;
  };
  
  export function CardPreview({
        fullName,
        title,
        bio,
        phone,
        email,
        whatsapp,
        linkedin,
        website,
        profileImage,
        themeMode,
        genericTheme,
        primaryColor,
        secondaryColor,
        backgroundStyle,
        buttonStyle,
         aiTheme,
company,
companyDescription,
companyWebsite,
companyLogo,
companyServices,
companyCtaLabel,
      }: CardPreviewProps) {

     const activeAITheme = {
  ...defaultAITheme,
  ...(aiTheme || {}),
  background: {
    ...defaultAITheme.background,
    ...(aiTheme?.background || {}),
  },
  card: {
    ...defaultAITheme.card,
    ...(aiTheme?.card || {}),
  },
  text: {
    ...defaultAITheme.text,
    ...(aiTheme?.text || {}),
  },
  buttons: {
    ...defaultAITheme.buttons,
    ...(aiTheme?.buttons || {}),
  },
  effects: {
    ...defaultAITheme.effects,
    ...(aiTheme?.effects || {}),
  },
};
const textureClass =
  activeAITheme.background.texture === "grain"
    ? "bg-[radial-gradient(circle,#ffffff22_1px,transparent_1px)] bg-[length:18px_18px]"
    : activeAITheme.background.texture === "luxury"
    ? "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_25%),radial-gradient(circle_at_80%_30%,rgba(250,204,21,0.16),transparent_22%)]"
    : activeAITheme.background.texture === "carbon"
    ? "bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%),linear-gradient(-45deg,rgba(255,255,255,0.05)_25%,transparent_25%)] bg-[length:18px_18px]"
    : activeAITheme.background.texture === "marble"
    ? "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_25%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.12),transparent_30%)]"
    : activeAITheme.background.texture === "mesh"
    ? "bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.22),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(250,204,21,0.22),transparent_25%)]"
    : activeAITheme.background.texture === "paper"
    ? "bg-[radial-gradient(circle,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[length:14px_14px]"
    : "";
      const aiButtonStyle =
  themeMode === "ai"
    ? {
        background: activeAITheme.buttons.background,
        color: activeAITheme.buttons.color,
        boxShadow: activeAITheme.buttons.shadow,
      }
    : undefined;

const aiIconClass =
  activeAITheme.iconStyle === "luxury"
    ? "border border-yellow-300/40 bg-yellow-300/15 text-yellow-100 shadow-[0_0_20px_rgba(250,204,21,0.35)]"
    : activeAITheme.iconStyle === "neon"
    ? "border border-cyan-300/40 bg-cyan-300/15 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.45)]"
    : activeAITheme.iconStyle === "glass"
    ? "border border-white/20 bg-white/10 text-white backdrop-blur-xl"
    : "border border-slate-200 bg-white/10 text-white";

const aiIntroClass =
  activeAITheme.animation?.intro === "scale"
    ? "animate-[cardScale_.9s_ease-out]"
    : activeAITheme.animation?.intro === "reveal"
    ? "animate-[cardReveal_.9s_ease-out]"
    : activeAITheme.animation?.intro === "curtain"
    ? "animate-[cardCurtain_.9s_ease-out]"
    : "animate-[cardFade_.9s_ease-out]";

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
              effect: "",
            },
          
            minimal: {
              page: "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-950",
              card: "bg-white border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)]",
              accent: "text-slate-900",
              button: "bg-slate-950 text-white shadow-lg hover:bg-slate-800 hover:-translate-y-1",
              bubble: "bg-slate-100 border border-slate-200 text-slate-800",
              decor: "",
              effect: "",
            },
          };
          
          const theme =
            genericThemes[genericTheme as keyof typeof genericThemes] ||
            genericThemes.luxury;
        


    return (
        <div className={`relative sticky top-6 self-start overflow-hidden rounded-[2rem] p-5 shadow-2xl ${
  themeMode === "ai" ? "text-white" : theme.page
}`}
        
        style={
  themeMode === "ai"
    ? {
        background: activeAITheme.background.value ?? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      }
    : undefined
}
            >
    {themeMode === "ai" && activeAITheme.effects.animatedGradient && (
  <div className="absolute inset-0 animate-pulse opacity-30 blur-3xl">
    <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,white,transparent_25%),radial-gradient(circle_at_80%_30%,white,transparent_20%),radial-gradient(circle_at_50%_80%,white,transparent_20%)]" />
  </div>
)}

{themeMode === "ai" && activeAITheme.effects.sparkles && (
  <div className="pointer-events-none absolute inset-0 opacity-30">
    <div className="h-full w-full bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)] bg-[length:24px_24px]" />
  </div>
)}

{themeMode === "ai" && activeAITheme.effects.floatingOrbs && (
  <>
    <div className="absolute left-6 top-10 h-24 w-24 animate-bounce rounded-full bg-white/10 blur-2xl" />
    <div className="absolute bottom-10 right-6 h-32 w-32 animate-pulse rounded-full bg-white/10 blur-3xl" />
  </>
)}

{themeMode === "ai" && activeAITheme.effects.noiseTexture && (
  <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay">
    <div className="h-full w-full bg-[url('/noise.png')]" />
  </div>
)}

{themeMode === "ai" && activeAITheme.background.texture !== "none" && (
  <div
    className={`pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay ${textureClass}`}
  />
)}

  <div
  key={
    themeMode === "ai"
      ? `${activeAITheme.name}-${activeAITheme.background.value}`
      : genericTheme
  }
  className={`relative overflow-hidden rounded-[1.5rem] p-6 text-center ${
    themeMode === "ai" ? aiIntroClass : theme.card
  }`}
  
  style={
    themeMode === "ai"
      ? {
          background: activeAITheme.card.background,
          border: activeAITheme.card.border,
          boxShadow: activeAITheme.card.shadow,
          borderRadius: activeAITheme.card.radius,
          backdropFilter: activeAITheme.effects.glass ? "blur(18px)" : undefined,
        }
      : undefined
  }
>
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-amber-300 bg-white/10 shadow-lg">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl">
                👤
              </div>
            )}
          </div>
  
          <h2
  className="mt-5 text-2xl font-black"
  style={
    themeMode === "ai"
      ? { color: activeAITheme.text.nameColor }
      : undefined
  }
>
  {fullName || "Your name"}
</h2>

<p
  className={`mt-1 text-sm font-semibold ${
    themeMode === "ai" ? "" : theme.accent
  }`}
  style={
    themeMode === "ai"
      ? { color: activeAITheme.text.titleColor }
      : undefined
  }
>
  {title || "Your title"}
</p>

<p
  className="mt-4 text-sm leading-relaxed"
  style={
    themeMode === "ai"
      ? { color: activeAITheme.text.bioColor }
      : undefined
  }
>
  {bio || "Your short profile presentation will appear here."}
</p>

{companyDescription && (
  <section className="mt-6 rounded-[1.7rem] border border-white/10 bg-white/10 p-5 text-left backdrop-blur-xl">
    <div className="flex items-center gap-3">
      {companyLogo && (
        <img
          src={companyLogo}
          alt="Company logo"
          className="h-12 w-12 rounded-2xl object-cover"
        />
      )}

      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
          Company
        </p>

        {company && (
          <h3 className="text-lg font-black text-white">
            {company}
          </h3>
        )}
      </div>
    </div>

    <p className="mt-4 text-sm leading-6 text-white/80">
      {companyDescription}
    </p>

    {companyServices && companyServices.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {companyServices.map((service) => (
          <span
            key={service}
            className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white/80"
          >
            {service}
          </span>
        ))}
      </div>
    )}

    {companyWebsite && (
      <a
        href={companyWebsite}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex rounded-full bg-amber-400 px-4 py-2 text-xs font-black text-slate-950 shadow-lg"
      >
        {companyCtaLabel || "Visit company website"}
      </a>
    )}
  </section>
)}
  
          <div className="mt-6 grid grid-cols-2 gap-3">
            {phone && <button
  className={`rounded-2xl p-3 text-sm font-bold transition ${
    themeMode === "ai"
      ? "hover:-translate-y-1 active:scale-95"
      : theme.button
  }`}
  style={aiButtonStyle}
  
>Call</button>}
            {email && <button
  className={`rounded-2xl p-3 text-sm font-bold transition ${
    themeMode === "ai"
      ? "hover:-translate-y-1 active:scale-95"
      : theme.button
  }`}
  style={aiButtonStyle}
>Email</button>}
            {whatsapp && <button
  className={`rounded-2xl p-3 text-sm font-bold transition ${
    themeMode === "ai"
      ? "hover:-translate-y-1 active:scale-95"
      : theme.button
  }`}
  style={aiButtonStyle}
>WhatsApp</button>}
            {linkedin && <button
  className={`rounded-2xl p-3 text-sm font-bold transition ${
    themeMode === "ai"
      ? "hover:-translate-y-1 active:scale-95"
      : theme.button
  }`}
  style={aiButtonStyle}
>LinkedIn</button>}
            {website && <button
  className={`rounded-2xl p-3 text-sm font-bold transition ${
    themeMode === "ai"
      ? "hover:-translate-y-1 active:scale-95"
      : theme.button
  }`}
  style={aiButtonStyle}
>Website</button>}
          </div>
  
          <button
  className={`mt-6 w-full rounded-full px-5 py-3 font-black transition ${
    themeMode === "ai"
      ? "hover:-translate-y-1 active:scale-95"
      : theme.button
  }`}
  style={aiButtonStyle}
>
  Save contact
</button>
        </div>
      </div>
    );
  }

