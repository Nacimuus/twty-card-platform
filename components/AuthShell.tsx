import Link from "next/link";
import { PalgonicLogo } from "@/components/PalgonicLogo";

/**
 * Shared layout for all auth pages — top nav with PalgonicLogo,
 * centered card-width container below for the form.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-creme-paper">
      <nav className="mx-auto flex max-w-6xl items-center px-6 py-6">
        <Link href="/" className="transition hover:opacity-80">
          <PalgonicLogo className="text-2xl" />
        </Link>
      </nav>

      <div className="mx-auto w-full max-w-md px-6 pb-16 pt-8">
        {children}
      </div>
    </main>
  );
}
