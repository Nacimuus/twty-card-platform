import Link from "next/link";
import { signUpWithPassword } from "../actions";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Créer un compte" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell>
      <h1 className="font-display text-4xl">Créer un compte</h1>
      <p className="mt-2 text-pierre">
        Votre identité pro, prête en deux minutes.
      </p>

      <form action={signUpWithPassword} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-md border border-pierre-soft bg-creme px-3 py-2.5 outline-none focus:border-foret"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Mot de passe</span>
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

        {error && (
          <p className="text-sm text-corail-deep">{decodeURIComponent(error)}</p>
        )}

        <button
          type="submit"
          className="mt-2 rounded-md bg-foret py-3 font-medium text-creme transition hover:bg-foret-deep"
        >
          Créer le compte
        </button>
      </form>

      <p className="mt-8 text-sm text-pierre">
        Déjà inscrit ?{" "}
        <Link href="/login" className="text-foret underline underline-offset-2">
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}
