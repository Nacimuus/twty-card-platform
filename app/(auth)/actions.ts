"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginWithPassword(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email et mot de passe requis.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent("Identifiants incorrects.")}`);
  }

  redirect(next);
}

export async function signUpWithPassword(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect(`/signup?error=${encodeURIComponent("Email et mot de passe requis.")}`);
  }
  if (password.length < 8) {
    redirect(
      `/signup?error=${encodeURIComponent("Mot de passe trop court (8 caractères minimum).")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    redirect(
      `/signup?error=${encodeURIComponent("Impossible de créer le compte. Vérifiez votre email.")}`,
    );
  }

  // Email confirmation required — send user to "check your inbox" page
  redirect(`/check-email?email=${encodeURIComponent(email)}`);
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    redirect(`/forgot-password?error=${encodeURIComponent("Email requis.")}`);
  }

  const supabase = await createClient();
  // We intentionally don't surface whether the email exists (security best practice).
  // Always show the "email sent" confirmation, regardless of the result.
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  });

  redirect(`/forgot-password?sent=1`);
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!password || password.length < 8) {
    redirect(
      `/reset-password?error=${encodeURIComponent("Mot de passe trop court (8 caractères minimum).")}`,
    );
  }
  if (password !== confirm) {
    redirect(
      `/reset-password?error=${encodeURIComponent("Les mots de passe ne correspondent pas.")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(
      `/reset-password?error=${encodeURIComponent("Impossible de mettre à jour. Le lien est peut-être expiré.")}`,
    );
  }

  redirect(`/dashboard`);
}
