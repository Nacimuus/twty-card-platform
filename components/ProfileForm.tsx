"use client";

import {
    useState,
    useEffect,
    type Dispatch,
    type SetStateAction,
  } from "react";
import { supabase } from "@/lib/supabase";
import { CardPreview } from "@/components/CardPreview";

export function ProfileForm({
    userId,
    cardName,
  }: {
    userId: string;
    cardName?: string;
  }) {
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
 const [company, setCompany] = useState("");
const [companyDescription, setCompanyDescription] = useState("");
const [companyWebsite, setCompanyWebsite] = useState("");
const [companyLogo, setCompanyLogo] = useState("");
const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
const [companyServices, setCompanyServices] = useState<string[]>([]);
const [companyCtaLabel, setCompanyCtaLabel] = useState("Visit company website");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [themeMode, setThemeMode] = useState("generic");
  const [genericTheme, setGenericTheme] = useState("luxury");
  const [themePrompt, setThemePrompt] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#061B2B");
  const [secondaryColor, setSecondaryColor] = useState("#D6B35A");
  const [backgroundStyle, setBackgroundStyle] = useState("dark-gradient");
  const [buttonStyle, setButtonStyle] = useState("rounded-gold");
  const [aiThemeNotes, setAiThemeNotes] = useState("");
  const [identityIntro, setIdentityIntro] = useState("");
  const [profilePresentation, setProfilePresentation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [aiTheme, setAiTheme] = useState<any>(null);
const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
const [aiThemeHistory, setAiThemeHistory] = useState<any[]>([]);
const [themeVariations, setThemeVariations] = useState<any[]>([]);
  const hasContact = email.trim() || phone.trim() || whatsapp.trim();
  

const requiredFields = [
  fullName.trim(),
  title.trim(),
  bio.trim(),
  hasContact,
];

const completedRequiredFields = requiredFields.filter(Boolean).length;
const progress = Math.round(
  (completedRequiredFields / requiredFields.length) * 100
);

const canSave = completedRequiredFields === requiredFields.length;
const missingFields = [
    !fullName.trim() ? "full name" : null,
    !title.trim() ? "title" : null,
    !bio.trim() ? "bio" : null,
    !hasContact ? "one contact method" : null,
  ].filter(Boolean);
  
  const identityComplete = fullName.trim() && title.trim() && bio.trim();
  const contactComplete = Boolean(hasContact);
  const themeComplete = Boolean(genericTheme || aiThemeNotes);

async function generateTheme() {
  try {
    setIsGeneratingTheme(true);

    const response = await fetch("/api/generate-theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        themePrompt,
        fullName,
        title,
        logoImage: profileImage,
      }),
    });

    const data = await response.json();
    console.log("AI theme response:", data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate theme");
    }

    const variations = data.themes || [];
    const firstVariation = variations[0];

    if (!firstVariation) {
      throw new Error("No theme variation generated");
    }

    setThemeVariations(variations);

    setPrimaryColor(firstVariation.primaryColor);
    setSecondaryColor(firstVariation.secondaryColor);
    setBackgroundStyle(firstVariation.backgroundStyle);
    setButtonStyle(firstVariation.buttonStyle);
    setAiThemeNotes(firstVariation.aiThemeNotes || "");
    setAiTheme(firstVariation.aiTheme);
    setThemeMode("ai");

    const newHistory = [...(aiThemeHistory || []), firstVariation.aiTheme];
    setAiThemeHistory(newHistory);

    setMessage("AI theme generated! Choose your favorite variation.");

    await supabase
      .from("profiles")
      .update({
        primary_color: firstVariation.primaryColor,
        secondary_color: firstVariation.secondaryColor,
        background_style: firstVariation.backgroundStyle,
        button_style: firstVariation.buttonStyle,
        ai_theme: firstVariation.aiTheme,
        theme_mode: "ai",
        ai_theme_history: newHistory,
      })
      .eq("clerk_user_id", userId);
  } catch (error) {
    console.error(error);
    alert("Theme generation failed");
  } finally {
    setIsGeneratingTheme(false);
  }
}



  useEffect(() => {
    setIsDirty(true);
  }, [
    fullName,
    title,
    company,
    companyDescription,
companyWebsite,
companyLogo,
companyLogoFile,
companyServices,
companyCtaLabel,
    phone,
    email,
    whatsapp,
    linkedin,
    website,
    bio,
    profileImage,
    identityIntro,
    profilePresentation,
    skills,
    
  ]);
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);
  async function generateBio() {
    setMessage("Generating bio with AI...");

    try {
      const response = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, title, bio }),
      });

      const data = await response.json();
      console.log("AI theme response:", data);

      if (!response.ok) {
        setMessage(data.error || "AI generation failed");
        return;
      }

      setBio(data.bio);
      setMessage("AI bio generated!");
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Could not call AI route.");
    }
  }

  async function generateSkills() {
    setMessage("Generating skills with AI...");
  
    try {
      const response = await fetch("/api/generate-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          title,
          bio,
          identityIntro,
          profilePresentation,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setMessage(data.error || "AI skill generation failed");
        return;
      }
  
      setSkills(data.skills);
      setMessage("Skills generated!");
    } catch (error) {
      console.error(error);
      setMessage("Could not generate skills.");
    }
  }

async function generateCompanyDescription() {
  setMessage("Generating company presentation with AI...");

  try {
    const response = await fetch("/api/generate-company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName: company,
        title,
        bio,
        profilePresentation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "AI company generation failed");
      return;
    }

    setCompanyDescription(data.companyDescription);
    setMessage("Company presentation generated!");
  } catch (error) {
    console.error(error);
    setMessage("Could not generate company presentation.");
  }
}

  async function saveProfile() {
    if (!canSave) {
        setMessage("Please complete all required fields before publishing.");
        return;
      }
    setMessage("Saving...");

    const cleanSlug = (text: string) =>
        text
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      
      const baseSlug = `${cleanSlug(fullName)}-${cleanSlug(company || cardName || "card")}`;
      const uniqueSlug = baseSlug;
    let imageUrl = profileImage;
let companyLogoUrl = companyLogo;

if (companyLogoFile) {
  setMessage("Uploading company logo...");

  const fileExt = companyLogoFile.name.split(".").pop();
  const fileName = `${userId}-company-${Date.now()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("profile-images")
    .upload(fileName, companyLogoFile, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    setMessage("Company logo upload error: " + uploadError.message);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("profile-images")
    .getPublicUrl(uploadData.path);

  companyLogoUrl = publicUrlData.publicUrl;
  setCompanyLogo(companyLogoUrl);
}

if (selectedFile) {
  setMessage("Uploading image...");

  const fileExt = selectedFile.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, selectedFile, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        setMessage("Upload error: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(uploadData.path);

      imageUrl = publicUrlData.publicUrl;
      setProfileImage(imageUrl);
    }
    const { data: existingCard, error: checkError } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .eq("full_name", fullName)
    .eq("company", company)
    .maybeSingle();
  
  if (checkError) {
    setMessage("Error checking existing cards: " + checkError.message);
    return;
  }
  
  if (existingCard) {
    alert("This name and company combination already exists.");
    setMessage("This name and company combination already exists.");
    return;
  }
    const { data, error } = await supabase
      .from("profiles")
      .insert(
        {
          clerk_user_id: userId,
          card_name: cardName,
          company,
company_name: company,
company_description: companyDescription,
company_website: companyWebsite,
company_logo: companyLogoUrl,
company_services: companyServices,
company_cta_label: companyCtaLabel,
          slug: uniqueSlug,
          full_name: fullName,
          title,
          bio,
          phone,
          email,
          whatsapp,
          linkedin,
          website,
          profile_image: imageUrl,
          theme_mode: themeMode,
          generic_theme: genericTheme,
          theme_prompt: themePrompt,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          background_style: backgroundStyle,
          button_style: buttonStyle,
          ai_theme_notes: aiThemeNotes,
          identity_intro: identityIntro,
          profile_presentation: profilePresentation,
          skills,
          ai_theme: aiTheme,
          ai_theme_history: aiThemeHistory,
          
        },
      
      )
      .select();

    if (error) {
      console.error("Supabase error:", error);
      setMessage("Error: " + error.message);
      return;
    }

    console.log("Saved data:", data);
    const finalUrl = `/u/${uniqueSlug}`;

    setProfileUrl(finalUrl);
    setMessage("✅ Card published successfully!");
    setIsDirty(false);
    
    window.open(finalUrl, "_blank");
  }

  return (
        <div className="w-full space-y-8">
     {/* Progress / Motivation */}
<div className="relative overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br from-white via-amber-50 to-sky-50 p-6 shadow-lg shadow-slate-200/70">
  <div className="absolute right-4 top-4 text-5xl opacity-10">✨</div>

  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
    <div>
      <p className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-amber-600 shadow-sm">
        Level 1 · Profile Quest
      </p>

      <h3 className="mt-4 text-2xl font-black text-slate-950">
        Complete your missions
      </h3>

      <p className="mt-2 text-sm font-medium text-slate-600">
        Every completed section brings you closer to publishing your card.
      </p>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm font-black">
          <span className="text-slate-700">XP Progress</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
            {progress}% XP
          </span>
        </div>

        <div className="mt-3 h-4 overflow-hidden rounded-full bg-white shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-yellow-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>

    <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white shadow-xl">
      <p className="text-3xl">{canSave ? "🚀" : "🔒"}</p>
      <p className="mt-2 text-sm text-white/60">Current status</p>
      <p className="font-black">
        {canSave ? "Publish unlocked" : "Keep going"}
      </p>
    </div>
  </div>
</div>
  
      {/* Identity */}
      <section className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-lg shadow-slate-200/60">
        <div className="mb-5">
        <div className="flex items-center justify-between gap-3">
  <div>
    <h3 className="text-xl font-black text-slate-950">
      1. Identity <span className="text-amber-500">*</span>
    </h3>
    <p className="text-sm text-slate-500">Who are you?</p>
    <textarea
  className="mt-4 min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
  placeholder="Short identity intro shown under your name..."
  value={identityIntro}
  onChange={(e) => setIdentityIntro(e.target.value)}
  
/>
<input
  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
  placeholder="Company name"
  value={company}
  onChange={(e) => setCompany(e.target.value)}
/>
  </div>

  <span
    className={`rounded-full px-3 py-1 text-xs font-black ${
      identityComplete
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-100 text-slate-500"
    }`}
  >
    {identityComplete ? "✅ Complete" : "Missing"}
  </span>
</div>
        </div>
  
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
  
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            placeholder="Title / Role"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
  
        <div className="mt-4">
          <textarea
            className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            placeholder="Short profile presentation..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
  
          <button
            type="button"
            onClick={generateBio}
            className="mt-3 rounded-full border border-amber-300 bg-amber-50 px-5 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-100 hover:shadow-md"
          >
            ✨ Improve Bio with AI
          </button>
        </div>
      </section>
  {/*profile presentation*/}

  <section className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-lg shadow-slate-200/60">
  <div className="mb-5">
    <h3 className="text-xl font-black text-slate-950">
      2. Profile presentation
    </h3>
    <p className="text-sm text-slate-500">
      A deeper explanation of who you are and what you do.
    </p>
  </div>

  <textarea
    className="min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
    placeholder="Example: I help companies design, deploy and scale payment solutions..."
    value={profilePresentation}
    onChange={(e) => setProfilePresentation(e.target.value)}
  />
</section>

<section className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-lg shadow-slate-200/60">
  <div className="mb-5">
    <h3 className="text-xl font-black text-slate-950">
      3. Skills bubbles
    </h3>
    <p className="text-sm text-slate-500">
      Add your main skills. Later we can generate them with AI.
    </p>
  </div>
  <button
  type="button"
  onClick={generateSkills}
  className="mb-4 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-slate-800 active:scale-95"
>
  ✨ Generate skills with AI
</button>
  <input
    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
    placeholder="Example: EMV, Project Management, PCI DSS, SoftPOS"
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = e.currentTarget.value.trim();
        if (!value) return;
        setSkills([...skills, value]);
        e.currentTarget.value = "";
      }
    }}
  />

  <div className="mt-4 flex flex-wrap gap-2">
    {skills.map((skill) => (
      <button
        key={skill}
        type="button"
        onClick={() => setSkills(skills.filter((s) => s !== skill))}
        className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700"
      >
        {skill} ×
      </button>
    ))}
  </div>
</section>



{/* Company */}
<section className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-lg shadow-slate-200/60">
  <div className="mb-5">
    <h3 className="text-xl font-black text-slate-950">
      4. Company presentation
    </h3>
    <p className="text-sm text-slate-500">
      Present the company behind the card.
    </p>
  </div>

  <div className="grid gap-4 md:grid-cols-2">
    <input
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
      placeholder="Company name"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
    />

    <input
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
      placeholder="Company website"
      value={companyWebsite}
      onChange={(e) => setCompanyWebsite(e.target.value)}
    />
  </div>

  <textarea
    className="mt-4 min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
    placeholder="Company mission, services, values, expertise..."
    value={companyDescription}
    onChange={(e) => setCompanyDescription(e.target.value)}
  />

  <button
    type="button"
    onClick={generateCompanyDescription}
    className="mt-3 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-slate-800 active:scale-95"
  >
    ✨ Generate company presentation with AI
  </button>

  <div className="mt-6">
    <label className="mb-2 block text-sm font-bold text-slate-700">
      Company logo
    </label>

    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCompanyLogoFile(file);
        setMessage("Company logo selected. Click Save Profile to upload.");
      }}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
    />

    {(companyLogo || companyLogoFile) && (
      <img
        src={companyLogoFile ? URL.createObjectURL(companyLogoFile) : companyLogo}
        alt="Company logo preview"
        className="mt-4 h-16 w-16 rounded-2xl border border-slate-200 object-cover shadow-sm"
      />
    )}
  </div>

  <div className="mt-6">
    <label className="mb-2 block text-sm font-bold text-slate-700">
      Company services
    </label>

    <input
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
      placeholder="Example: Payment Systems, Project Management, Training"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const value = e.currentTarget.value.trim();
          if (!value) return;
          setCompanyServices([...companyServices, value]);
          e.currentTarget.value = "";
        }
      }}
    />

    <div className="mt-4 flex flex-wrap gap-2">
      {companyServices.map((service) => (
        <button
          key={service}
          type="button"
          onClick={() =>
            setCompanyServices(companyServices.filter((s) => s !== service))
          }
          className="rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700"
        >
          {service} ×
        </button>
      ))}
    </div>
  </div>

  <div className="mt-6">
    <label className="mb-2 block text-sm font-bold text-slate-700">
      CTA button text
    </label>

    <select
      value={companyCtaLabel}
      onChange={(e) => setCompanyCtaLabel(e.target.value)}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
    >
      <option value="Visit company website">Visit company website</option>
      <option value="Discover our services">Discover our services</option>
      <option value="Book a call">Book a call</option>
      <option value="Work with us">Work with us</option>
      <option value="Get in touch">Get in touch</option>
    </select>
  </div>
</section>

      {/* Contact */}
      <section className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-lg shadow-slate-200/60">
        <div className="mb-5">
        <div className="flex items-center justify-between gap-3">
  <div>
    <h3 className="text-xl font-black text-slate-950">
      2. Contact links <span className="text-amber-500">*</span>
    </h3>
    <p className="text-sm text-slate-500">
      These become action buttons on your card.
    </p>
  </div>

  <span
    className={`rounded-full px-3 py-1 text-xs font-black ${
      contactComplete
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-100 text-slate-500"
    }`}
  >
    {contactComplete ? "✅ Complete" : "Missing"}
  </span>
</div>
        </div>
  
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Phone", phone, setPhone, "+33600000000"],
            ["Email", email, setEmail, "hello@company.com"],
            ["WhatsApp", whatsapp, setWhatsapp, "33600000000"],
            ["LinkedIn", linkedin, setLinkedin, "https://linkedin.com/in/..."],
            ["Website", website, setWebsite, "https://yourwebsite.com"],
          ].map(([label, value, setter, placeholder]) => (
            <div key={label as string}>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                {label as string}
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                placeholder={placeholder as string}
                value={value as string}
                onChange={(e) =>
                    (setter as Dispatch<SetStateAction<string>>)(e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </section>
  
      {/* Profile Picture */}
      <section className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-lg shadow-slate-200/60">
        <div className="mb-5">
          <h3 className="text-xl font-black text-slate-950">3. Profile picture</h3>
          <p className="text-sm text-slate-500">
            Add a clear picture to make your card more human.
          </p>
        </div>
  
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-amber-300 hover:bg-amber-50">
            <span className="text-3xl">📸</span>
            <span className="mt-2 font-bold text-slate-800">
              Upload profile picture
            </span>
            <span className="mt-1 text-sm text-slate-500">
              JPG, PNG or WEBP
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setSelectedFile(file);
                setMessage("Image selected. Click Save Profile to upload and save.");
              }}
            />
          </label>
  
          {(profileImage || selectedFile) && (
            <div className="flex flex-col items-center rounded-3xl bg-slate-50 p-5">
              <img
                src={selectedFile ? URL.createObjectURL(selectedFile) : profileImage}
                alt="Profile preview"
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <p className="mt-3 text-sm font-semibold text-slate-600">Preview</p>
            </div>
          )}
        </div>
      </section>
  
      {/* Theme */}
      <section className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-lg shadow-slate-200/60">
        <div className="mb-5">
        <div className="flex items-center justify-between gap-3">
  <div>
    <h3 className="text-xl font-black text-slate-950">4. Card style</h3>
    <p className="text-sm text-slate-500">
      Choose a ready-made style or generate one with AI.
    </p>
  </div>

  <span
    className={`rounded-full px-3 py-1 text-xs font-black ${
      themeComplete
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-100 text-slate-500"
    }`}
  >
    {themeComplete ? "✅ Selected" : "Choose style"}
  </span>
</div>
        </div>
  
        <div className="grid gap-4 md:grid-cols-2">
<button
  type="button"
  onClick={() => setThemeMode("generic")}
  className={`rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ${
    themeMode === "generic"
      ? "border-amber-400 bg-amber-50"
      : "border-slate-200 bg-slate-50"
  }`}
>
          
            <p className="text-2xl">🎨</p>
            <p className="mt-3 font-black text-slate-900">Generic theme</p>
            <p className="mt-1 text-sm text-slate-500">
              Fast, clean and ready to use.
            </p>
          </button>
  
<button
  type="button"
  onClick={() => setThemeMode("ai")}
  className={`rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ${
    themeMode === "ai"
      ? "border-sky-400 bg-sky-50"
      : "border-slate-200 bg-slate-50"
  }`}
>
  <p className="text-2xl">🤖</p>
            <p className="mt-3 font-black text-slate-900">AI theme</p>
            <p className="mt-1 text-sm text-slate-500">
              Describe your vibe and let AI design it.
            </p>
          </button>
        </div>
  
        {themeMode === "generic" && (
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Choose your style
            </label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              value={genericTheme}
              onChange={(e) => setGenericTheme(e.target.value)}
            >
              <option value="luxury">Luxury</option>
              <option value="corporate">Corporate</option>
              <option value="minimal">Minimal</option>
              <option value="tech">Tech</option>
              <option value="startup">Startup</option>
              <option value="classic">Classic</option>
            </select>
          </div>
        )}
  
{themeMode === "ai" && (
  <div className="mt-5">

    <div className="mb-4 flex flex-wrap gap-2">
      {[
        "Luxury Banking",
        "Swiss Gold",
        "Tech Neon",
        "African Premium",
        "Minimal CEO",
        "Creative Glow",
      ].map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => setThemePrompt(preset)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
        >
          {preset}
        </button>
      ))}
    </div>

    <textarea
              className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              placeholder="Example: premium dark blue and gold, elegant, Swiss luxury, match my logo."
              value={themePrompt}
              onChange={(e) => setThemePrompt(e.target.value)}
            />
  
            <button
              type="button"
              onClick={generateTheme}
              disabled={isGeneratingTheme}
              className="mt-3 rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
  {isGeneratingTheme
    ? "Generating theme..."
    : "🤖 Generate Theme with AI"}
            </button>
            {themeVariations.length > 0 && (
  <div className="mt-5 grid gap-3 md:grid-cols-3">
    {themeVariations.map((variation, index) => (
      <button
        key={index}
        type="button"
onClick={async () => {
  setPrimaryColor(variation.primaryColor);
  setSecondaryColor(variation.secondaryColor);
  setBackgroundStyle(variation.backgroundStyle);
  setButtonStyle(variation.buttonStyle);
  setAiThemeNotes(variation.aiThemeNotes || "");
  setAiTheme(variation.aiTheme);
  setThemeMode("ai");

  const newHistory = [...aiThemeHistory, variation.aiTheme];
  setAiThemeHistory(newHistory);

  await supabase
    .from("profiles")
    .update({
      primary_color: variation.primaryColor,
      secondary_color: variation.secondaryColor,
      background_style: variation.backgroundStyle,
      button_style: variation.buttonStyle,
      ai_theme: variation.aiTheme,
      ai_theme_history: newHistory,
      theme_mode: "ai",
    })
    .eq("clerk_user_id", userId);
}}
        className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div
          className="h-16 rounded-xl"
          style={{
            background:
              variation.aiTheme?.background?.value ||
              `linear-gradient(135deg, ${variation.primaryColor}, ${variation.secondaryColor})`,
          }}
        />

        <p className="mt-3 text-sm font-black text-slate-900">
          {variation.aiTheme?.name || `Variation ${index + 1}`}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {variation.backgroundStyle}
        </p>
      </button>
    ))}
  </div>
)}
  
            {aiThemeNotes && (
              <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-slate-700">
                <p><strong>Primary:</strong> {primaryColor}</p>
                <p><strong>Secondary:</strong> {secondaryColor}</p>
                <p><strong>Background:</strong> {backgroundStyle}</p>
                <p><strong>Buttons:</strong> {buttonStyle}</p>
                <p className="mt-2">{aiThemeNotes}</p>
              </div>
            )}
          </div>
        )}
      </section>
  

{/* Save */}
<div className="relative overflow-hidden rounded-[2rem] border border-amber-200 bg-gradient-to-br from-yellow-50 via-amber-50 to-white p-6 shadow-xl shadow-amber-100">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-yellow-300/30 blur-2xl" />
    <div>
    <p className="text-sm font-bold text-slate-900">
  {canSave ? "Ready to publish? 🚀" : `Complete ${missingFields.length} more step(s) to publish 🔒`}
</p>

{!canSave && (
  <p className="mt-1 text-sm text-slate-500">
    Missing: {missingFields.join(", ")}
  </p>
)}

{message && (
  <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 shadow-sm">
    {message}
  </div>
)}

      {profileUrl && (
        <a
          href={profileUrl}
          className="mt-2 inline-block text-sm font-bold text-sky-600 underline"
        >
          View my card
        </a>
      )}
    </div>

    <CardPreview
fullName={fullName}
title={title}
bio={bio}
phone={phone}
email={email}
whatsapp={whatsapp}
linkedin={linkedin}
website={website}
profileImage={
  selectedFile ? URL.createObjectURL(selectedFile) : profileImage
}
themeMode={themeMode}
genericTheme={genericTheme}
primaryColor={primaryColor}
secondaryColor={secondaryColor}
backgroundStyle={backgroundStyle}
buttonStyle={buttonStyle}
aiTheme={aiTheme}
company={company}
companyDescription={companyDescription}
companyWebsite={companyWebsite}
companyLogo={
  companyLogoFile ? URL.createObjectURL(companyLogoFile) : companyLogo
}
companyServices={companyServices}
companyCtaLabel={companyCtaLabel}
/>

    <button
  type="button"
  onClick={saveProfile}
  disabled={!canSave}
  className={`rounded-2xl px-8 py-4 font-black shadow-lg transition active:scale-95 ${
    canSave
      ? "bg-slate-950 text-white hover:-translate-y-1 hover:bg-slate-800"
      : "cursor-not-allowed bg-slate-200 text-slate-400"
  }`}
>
  {canSave ? "Save & Publish 🚀" : "Complete missions first 🔒"}
</button>
  </div>
</div>
</div>
  );
}