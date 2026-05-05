"use client";

import { useState } from "react";

import Link from "next/link";
import { getNextStep, getPreviousStep } from "@/lib/builder-steps";
import { saveCardStep } from "@/app/actions/save-card-step";
import { publishCard } from "@/app/actions/publish-card";
import { AIFieldButton } from "@/components/AIFieldButton";
import { supabase } from "@/lib/supabase";

export function BuilderStepForm({
  card,
  step,
  selectedGenericTheme,
  setSelectedGenericTheme,
  selectedAITheme,
  setSelectedAITheme,
  profileImageUrl,
  setProfileImageUrl,
  companyLogoUrl,
  setCompanyLogoUrl,
}: {
  card: any;
  step: string;
  selectedGenericTheme: string;
  setSelectedGenericTheme: any;
  selectedAITheme: any;
  setSelectedAITheme: any;
  profileImageUrl: string;
  setProfileImageUrl: any;
  companyLogoUrl: string;
  setCompanyLogoUrl: any;
}) {
  const next = getNextStep(step);
  const previous = getPreviousStep(step);
  const [aiThemePrompt, setAiThemePrompt] = useState(card?.theme_prompt || "");
const [aiThemes, setAiThemes] = useState<any[]>(
  card?.generated_ai_themes || []
);
const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);


async function generateAIThemes() {
  setIsGeneratingTheme(true);

  const res = await fetch("/api/generate-theme", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
body: JSON.stringify({
  themePrompt: aiThemePrompt,
  fullName: card?.full_name,
  title: card?.title,
  logoImage: card?.company_logo || card?.profile_image || "",
}),
  });

  const data = await res.json();

  setAiThemes(data.themes || []);
  setIsGeneratingTheme(false);
}


const [uploadingImage, setUploadingImage] = useState(false);

async function uploadImage(file: File, folder: "profiles" | "logos") {
  setUploadingImage(true);

  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${card.id}-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("profile-images")
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) {
    console.error("UPLOAD ERROR:", error);
    setUploadingImage(false);
    return "";
  }

  const { data } = supabase.storage
    .from("profile-images")
    .getPublicUrl(fileName);

  setUploadingImage(false);
  return data.publicUrl;
}

return (
  <div className="relative z-50">
    {step === "identity" && (
  <form action={saveCardStep} className="relative z-50">
    <input type="hidden" name="cardId" value={card.id} />
    <input type="hidden" name="nextStep" value={next || "company"} />

    <div>
      <h1 className="mb-2 text-4xl font-black">Build your identity ✨</h1>
      <p className="mb-8 text-white/60">
        Start with what people will see first.
      </p>

      <div className="grid gap-5">
        <input
          name="full_name"
          className="rounded-2xl border border-white/10 bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="Full name"
          defaultValue={card?.full_name || ""}
        />

        <input
          name="title"
          className="rounded-2xl border border-white/10 bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="Title"
          defaultValue={card?.title || ""}
        />

        <input type="hidden" name="profile_image" value={profileImageUrl} />

        <label className="flex cursor-pointer items-center gap-4 rounded-3xl border border-dashed border-cyan-300/40 bg-white/10 p-5 transition hover:bg-white/15">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const url = await uploadImage(file, "profiles");
              if (url) setProfileImageUrl(url);
            }}
          />

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-300 text-3xl font-black text-slate-950">
            +
          </div>

          <div>
            <p className="font-black text-white">Add your profile picture</p>
            <p className="mt-1 text-sm text-white/50">
              {uploadingImage ? "Uploading..." : "Click to upload an image"}
            </p>
          </div>
        </label>

        {profileImageUrl && (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-400/15 p-3 text-sm font-bold text-emerald-100">
            <img
              src={profileImageUrl}
              alt="Profile preview"
              className="h-10 w-10 rounded-full object-cover"
            />
            Picture loaded successfully ✅
          </div>
        )}

        <textarea
          name="bio"
          className="min-h-32 rounded-2xl border border-white/10 bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="Short bio"
          defaultValue={card?.bio || ""}
        />

        <AIFieldButton
          field="short professional bio"
          targetName="bio"
          context={card}
        >
          Improve bio with AI ✨
        </AIFieldButton>
      </div>
    </div>

    <div className="mt-10 flex items-center justify-between">
      <div />

      <button
        type="submit"
        className="rounded-2xl bg-white px-6 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-1"
      >
        Next
      </button>
    </div>
  </form>
)}

{step === "skills" && (
  <form action={saveCardStep}>
    <input type="hidden" name="cardId" value={card.id} />
    <input type="hidden" name="nextStep" value={next || "contact"} />

    <div>
      <h1 className="mb-2 text-4xl font-black">Skills & expertise 🧠</h1>
      <p className="mb-8 text-white/60">
        Add the skills you want people to remember.
      </p>

      <div className="grid gap-5">
        <textarea
          name="skills"
          className="min-h-40 rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="Example: Project management, payment systems, EMV, SoftPOS, leadership..."
          defaultValue={
            Array.isArray(card?.skills)
              ? card.skills.join(", ")
              : card?.skills || ""
          }
        />

 <AIFieldButton
  field="professional skills list"
  targetName="skills"
  context={card}
>
  Generate skills with AI ✨
</AIFieldButton>
      </div>
    </div>

    <div className="mt-10 flex items-center justify-between">
      <Link
        href={`/dashboard/cards/${card.id}/builder/${previous}`}
        className="rounded-2xl bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/20"
      >
        Back
      </Link>

      <button
        type="submit"
        className="rounded-2xl bg-white px-6 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-1"
      >
        Next
      </button>
    </div>
  </form>
)}

     {step === "company" && (
<form action={saveCardStep} className="relative z-50">
    <input type="hidden" name="cardId" value={card.id} />
    <input type="hidden" name="nextStep" value={next || "contact"} />

    <div>
      <h1 className="mb-2 text-4xl font-black">Company info 🏢</h1>
      <p className="mb-8 text-white/60">
        Add your company details.
      </p>

      <div className="grid gap-5">
        <input
          name="company"
          className="rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="Company name"
          defaultValue={card?.company || ""}
        />
<input type="hidden" name="company_logo" value={companyLogoUrl} />

<label className="flex cursor-pointer items-center gap-4 rounded-3xl border border-dashed border-yellow-300/40 bg-white/10 p-5 transition hover:bg-white/15">
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = await uploadImage(file, "logos");
      if (url) setCompanyLogoUrl(url);
    }}
  />

  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-300 text-3xl font-black text-slate-950">
    +
  </div>

  <div>
    <p className="font-black text-white">Add your company logo</p>
    <p className="mt-1 text-sm text-white/50">
      {uploadingImage ? "Uploading..." : "Click to upload a logo"}
    </p>
  </div>
</label>

{companyLogoUrl && (
  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-400/15 p-3 text-sm font-bold text-emerald-100">
    <img
      src={companyLogoUrl}
      alt="Company logo preview"
      className="h-10 w-10 rounded-xl object-cover"
    />
    Logo loaded successfully ✅
  </div>
)}



        <textarea
          name="company_description"
          className="min-h-32 rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="Company description"
          defaultValue={card?.company_description || ""}
        />
<AIFieldButton
  field="company description"
  targetName="company_description"
  context={card}
>
  Generate company description ✨
</AIFieldButton>

<textarea
  name="company_services"
  defaultValue={
    Array.isArray(card?.company_services)
      ? card.company_services.join(", ")
      : card?.company_services || ""
  }
  className="min-h-32 rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
  placeholder="Company services"
/>
<AIFieldButton
  field="company services list"
  targetName="company_services"
  context={card}
>
  Generate company services ✨
</AIFieldButton>
        <input
          name="company_website"
          className="rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="Company website"
          defaultValue={card?.company_website || ""}
        />
      </div>
    </div>

    <div className="mt-10 flex items-center justify-between">
      <Link
        href={`/dashboard/cards/${card.id}/builder/${previous}`}
        className="rounded-2xl bg-white/10 px-6 py-4 font-black text-white"
      >
        Back
      </Link>

      <button
        type="submit"
        className="rounded-2xl bg-white px-6 py-4 font-black text-slate-950"
      >
        Next
      </button>
    </div>
  </form>
)}

     {step === "contact" && (
  <form action={saveCardStep}>
    <input type="hidden" name="cardId" value={card.id} />
    <input type="hidden" name="nextStep" value={next || "design"} />

    <div>
      <h1 className="mb-2 text-4xl font-black">Contact channels 📱</h1>
      <p className="mb-8 text-white/60">
        Add all the ways people can reach you.
      </p>

      <div className="grid gap-5">
        <input
          name="email"
          className="rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="Email"
          defaultValue={card?.email || ""}
        />

        <input
          name="phone"
          className="rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="Phone"
          defaultValue={card?.phone || ""}
        />

        <input
          name="whatsapp"
          className="rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="WhatsApp"
          defaultValue={card?.whatsapp || ""}
        />

        <input
          name="linkedin"
          className="rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="LinkedIn"
          defaultValue={card?.linkedin || ""}
        />

        <input
          name="website"
          className="rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="Website"
          defaultValue={card?.website || ""}
        />
      </div>
    </div>

    <div className="mt-10 flex items-center justify-between">
      <Link
        href={`/dashboard/cards/${card.id}/builder/${previous}`}
        className="rounded-2xl bg-white/10 px-6 py-4 font-black text-white"
      >
        Back
      </Link>

      <button
        type="submit"
        className="rounded-2xl bg-white px-6 py-4 font-black text-slate-950"
      >
        Next
      </button>
    </div>
  </form>
)}
     {step === "design" && (
  <form action={saveCardStep}>
    <input type="hidden" name="cardId" value={card.id} />
    <input type="hidden" name="nextStep" value={next || "review"} />

    <input type="hidden" name="generic_theme" value={selectedGenericTheme} />
    <input type="hidden" name="theme_prompt" value={aiThemePrompt} />
    <input
      type="hidden"
      name="ai_theme"
      value={selectedAITheme ? JSON.stringify(selectedAITheme) : ""}
    />

    <div>
      <h1 className="mb-2 text-4xl font-black">Choose the vibe 🎨</h1>
      <p className="mb-8 text-white/60">
        Pick a ready-made style or generate a custom AI theme.
      </p>

      <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
        <h2 className="text-xl font-black">Generic themes</h2>
        <p className="mt-1 text-sm text-white/50">
          Fast, clean presets for your card.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {["luxury", "corporate", "minimal", "tech", "startup", "classic"].map(
            (theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => {
  setSelectedGenericTheme(theme);
  setSelectedAITheme(null);
}}
                className={`rounded-3xl border p-5 text-left font-black capitalize transition hover:-translate-y-1 ${
                  selectedGenericTheme === theme
                    ? "border-yellow-300 bg-yellow-300 text-slate-950"
                    : "border-white/10 bg-white/10 text-white"
                }`}
              >
                {theme}
              </button>
            )
          )}
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/10 p-6">
        <h2 className="text-xl font-black">AI Theme Generator ✨</h2>
        <p className="mt-1 text-sm text-white/50">
          Describe the feeling you want. AI will create 3 visual directions.
        </p>

        <textarea
          className="mt-5 min-h-32 w-full rounded-2xl bg-white p-4 font-bold text-slate-950 outline-none"
          placeholder="Example: premium dark blue and gold, elegant, Swiss luxury, modern fintech..."
          value={aiThemePrompt}
          onChange={(e) => setAiThemePrompt(e.target.value)}
        />

        <button
          type="button"
          onClick={generateAIThemes}
          disabled={isGeneratingTheme}
          className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-300 to-yellow-300 px-6 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-1 disabled:opacity-60"
        >
          {isGeneratingTheme ? "Generating themes..." : "Generate 3 AI themes ✨"}
        </button>
      </div>

      {aiThemes.length > 0 && (
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/10 p-6">
          <h2 className="text-xl font-black">AI generated versions</h2>
          <p className="mt-1 text-sm text-white/50">
            Choose the version that best matches your identity.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {aiThemes.map((theme, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
  setSelectedAITheme(theme);
}}
                className={`overflow-hidden rounded-[2rem] border p-4 text-left transition hover:-translate-y-1 ${
                 selectedAITheme?.aiTheme?.name === theme?.aiTheme?.name
                    ? "border-yellow-300 bg-yellow-300/20"
                    : "border-white/10 bg-white/10"
                }`}
              >
                <div
                  className="h-32 rounded-3xl"
                  style={{
background:
  theme?.aiTheme?.background?.value ||
  `linear-gradient(135deg, ${theme?.primaryColor}, ${theme?.secondaryColor})`,
                  }}
                />

                <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  Version {index + 1}
                </p>

                <h3 className="mt-2 text-lg font-black text-white">
                  {theme.aiTheme?.name || `AI Theme ${index + 1}`}
                </h3>

                <p className="mt-2 text-sm text-white/60">
                  {theme.aiThemeNotes}
                </p>

                <div className="mt-4 flex gap-2">
                  <span
                    className="h-6 w-6 rounded-full border border-white/20"
                    style={{ background: theme.primaryColor }}
                  />
                  <span
                    className="h-6 w-6 rounded-full border border-white/20"
                    style={{ background: theme.secondaryColor }}
                  />
                </div>

                <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-slate-950">
                  Apply this version
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>

    <div className="mt-10 flex items-center justify-between">
      <Link
        href={`/dashboard/cards/${card.id}/builder/${previous}`}
        className="rounded-2xl bg-white/10 px-6 py-4 font-black text-white"
      >
        Back
      </Link>

      <button
        type="submit"
        className="rounded-2xl bg-white px-6 py-4 font-black text-slate-950"
      >
        Next
      </button>
    </div>
  </form>
)}

      {step === "review" && (
  <form action={publishCard}>
    <input type="hidden" name="cardId" value={card.id} />

    <div>
      <h1 className="mb-2 text-4xl font-black">Ready to publish 🚀</h1>
      <p className="mb-8 text-white/60">
        Review your card and make it live.
      </p>

      <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
        <p className="text-2xl font-black">
          Your Twty Card is almost ready 🎉
        </p>
        <p className="mt-2 text-white/60">
          Publish your card and start sharing it with your network.
        </p>
      </div>
    </div>

    <div className="mt-10 flex items-center justify-between">
      <Link
        href={`/dashboard/cards/${card.id}/builder/${previous}`}
        className="rounded-2xl bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/20"
      >
        Back
      </Link>

      <button
        type="submit"
        className="rounded-2xl bg-gradient-to-r from-cyan-300 to-yellow-300 px-6 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-1"
      >
        Publish card 🎉
      </button>
    </div>
  </form>
)}

    </div>
  );
}