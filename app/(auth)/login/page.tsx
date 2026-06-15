import Link from "next/link";
import { loginWithPassword } from "../actions";

export const metadata = { title: "Se connecter" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-creme">
      <div className="w-full max-w-md">
        <h1 className="font-display text-4xl">Se connecter</h1>
        <p className="mt-2 text-pierre">Bon retour parmi nous.</p>

        <form action={loginWithPassword} className="mt-8 flex flex-col gap-4">
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
            <span className="text-sm font-medium">Mot de passe</span>
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
            className="mt-2 rounded-md bg-foret text-creme py-3 font-medium transition hover:bg-foret-deep"
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
      </div>
    </main>
  );
}