import Link from "next/link";
import { loginWithPassword } from "../actions";
import { AuthShell } from "@/components/AuthShell";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export const metadata = { title: "Se connecter" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <AuthShell>
      <h1 className="font-display text-4xl">Se connecter</h1>
      <p className="mt-2 text-pierre">Bon retour parmi nous.</p>

      <div className="mt-8">
        <GoogleSignInButton
          label="Continuer avec Google"
          next={next || "/dashboard"}
        />
      </div>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-pierre-soft" />
        <span className="text-xs uppercase tracking-widest text-pierre">ou</span>
        <span className="h-px flex-1 bg-pierre-soft" />
      </div>

      <form action={loginWithPassword} className="flex flex-col gap-4">
        {next && <input type="hidden" name="next" value={next} />}

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
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Mot de passe</span>
            <Link
              href="/forgot-password"
              className="text-xs text-pierre underline-offset-2 hover:text-foret hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
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
          Continuer
        </button>
      </form>

      <p className="mt-8 text-sm text-pierre">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="text-foret underline underline-offset-2">
          Créer un compte
        </Link>
      </p>
    </AuthShell>
  );
}
