import { redirect } from "next/navigation";
import { updatePassword } from "../actions";
import { AuthShell } from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Nouveau mot de passe" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  // The recovery email link routes here only AFTER /auth/callback exchanged
  // the code for a session. If no session exists, the link was direct/expired.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/forgot-password?error=${encodeURIComponent("Lien expiré ou invalide. Demandez un nouveau lien.")}`,
    );
  }

  return (
    <AuthShell>
      <h1 className="font-display text-4xl">Nouveau mot de passe</h1>
      <p className="mt-2 text-pierre">Choisissez un mot de passe sécurisé.</p>

      <form action={updatePassword} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Nouveau mot de passe</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="rounded-md border border-pierre-soft bg-creme px-3 py-2.5 outline-none focus:border-foret"
          />
          <span className="text-xs text-pierre">8 caractères minimum.</span>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Confirmer le mot de passe</span>
          <input
            type="password"
            name="confirm"
            required
            minLength={8}
            autoComplete="new-password"
            className="rounded-md border border-pierre-soft bg-creme px-3 py-2.5 outline-none focus:border-foret"
          />
        </label>

        {error && (
          <p className="text-sm text-corail-deep">{decodeURIComponent(error)}</p>
        )}

        <button
          type="submit"
          className="mt-2 rounded-md bg-foret py-3 font-medium text-creme transition hover:bg-foret-deep"
        >
          Mettre à jour
        </button>
      </form>
    </AuthShell>
  );
}
