import Link from "next/link";
import { requestPasswordReset } from "../actions";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Mot de passe oublié" };

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;

  // Confirmation state — email has been sent (or pretended to be)
  if (sent) {
    return (
      <AuthShell>
        <h1 className="font-display text-4xl">Email envoyé</h1>
        <p className="mt-4 leading-relaxed text-encre/80">
          Si un compte existe avec cette adresse, vous recevrez un email avec un
          lien pour réinitialiser votre mot de passe.
        </p>
        <p className="mt-4 text-sm text-pierre">
          Pensez à vérifier vos spams. L&apos;email peut prendre une minute à
          arriver.
        </p>
        <p className="mt-10 text-sm text-pierre">
          <Link
            href="/login"
            className="text-foret underline underline-offset-2"
          >
            Retour à la connexion
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="font-display text-4xl">Mot de passe oublié</h1>
      <p className="mt-2 text-pierre">
        Entrez votre email. Nous vous enverrons un lien pour le réinitialiser.
      </p>

      <form
        action={requestPasswordReset}
        className="mt-8 flex flex-col gap-4"
      >
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

        {error && (
          <p className="text-sm text-corail-deep">{decodeURIComponent(error)}</p>
        )}

        <button
          type="submit"
          className="mt-2 rounded-md bg-foret py-3 font-medium text-creme transition hover:bg-foret-deep"
        >
          Envoyer le lien
        </button>
      </form>

      <p className="mt-8 text-sm text-pierre">
        <Link href="/login" className="text-foret underline underline-offset-2">
          Retour à la connexion
        </Link>
      </p>
    </AuthShell>
  );
}
