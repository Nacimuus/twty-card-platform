import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Vérifiez votre email" };

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const decoded = email ? decodeURIComponent(email) : null;

  return (
    <AuthShell>
      <h1 className="font-display text-4xl">Vérifiez votre boîte mail</h1>
      <p className="mt-4 leading-relaxed text-encre/80">
        {decoded ? (
          <>
            Nous avons envoyé un email de confirmation à{" "}
            <span className="font-medium">{decoded}</span>. Cliquez sur le lien
            pour activer votre compte.
          </>
        ) : (
          <>
            Nous avons envoyé un email de confirmation. Cliquez sur le lien pour
            activer votre compte.
          </>
        )}
      </p>
      <p className="mt-4 text-sm text-pierre leading-relaxed">
        Pensez à vérifier vos spams. L&apos;email peut prendre une minute à
        arriver.
      </p>

      <div className="mt-10 space-y-3 text-sm">
        <p className="text-pierre">
          Compte confirmé ?{" "}
          <Link
            href="/login"
            className="text-foret underline underline-offset-2"
          >
            Se connecter
          </Link>
        </p>
        <p className="text-pierre">
          Mauvaise adresse ?{" "}
          <Link
            href="/signup"
            className="text-foret underline underline-offset-2"
          >
            Recommencer
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
