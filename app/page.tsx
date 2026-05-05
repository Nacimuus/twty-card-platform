"use client";

import {
  useAuth,
  SignInButton,
  SignUpButton,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#fef3c7,transparent_32%),radial-gradient(circle_at_top_right,#bae6fd,transparent_30%),linear-gradient(135deg,#f8fafc,#ffffff,#fff7ed)] px-6 py-8 text-slate-950">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="rounded-full bg-white/80 px-5 py-3 font-black shadow-sm">
          ✦ Twty Cards
        </div>

        <div className="flex items-center gap-3">
          
          {!isSignedIn ? (
            <SignInButton mode="modal"
            forceRedirectUrl="/dashboard"
            >

              <button className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                Log in
              </button>
            </SignInButton>
          ) : (
            <>
              
               <a href="/dashboard"
                className="rounded-2xl bg-white px-7 py-4 font-black text-slate-900 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                Dashboard
              </a>
              <SignOutButton redirectUrl="/">
                <button className="rounded-2xl bg-slate-950 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-slate-800 active:scale-95">
                  Log out
                </button>
              </SignOutButton>
              <UserButton />
            </>
          )}
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-6xl items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-700">
            🕹️ Digital Card Studio
          </p>

          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Create a digital card people actually save.
          </h1>

          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-600">
            Build a premium NFC-ready profile with contact buttons, QR code,
            profile presentation, skills bubbles and smart AI styling.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!isSignedIn ? (
              <SignUpButton mode="modal" 
              forceRedirectUrl="/dashboard"
              >
                <button className="rounded-2xl bg-slate-950 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-slate-800 active:scale-95">
                  Start building 🚀
                </button>
              </SignUpButton>
            ) : (
              
                <a href="/dashboard"
                className="rounded-2xl bg-slate-950 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-slate-800 active:scale-95"
              >
                Go to dashboard
              </a>
            )}
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/80 p-4 text-center shadow-sm">
              <p className="text-2xl">⚡</p>
              <p className="mt-2 text-xs font-black text-slate-600">Fast setup</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 text-center shadow-sm">
              <p className="text-2xl">🎨</p>
              <p className="mt-2 text-xs font-black text-slate-600">AI themes</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 text-center shadow-sm">
              <p className="text-2xl">📱</p>
              <p className="mt-2 text-xs font-black text-slate-600">NFC ready</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-sky-300/30 blur-3xl" />

          <div className="relative rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-slate-950 p-6 text-center text-white">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 text-3xl font-black text-slate-950 shadow-xl">
                NT
              </div>

              <h2 className="mt-5 text-3xl font-black">Nacim</h2>
              <p className="text-xl font-light text-amber-300">Touenti</p>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                Payment Systems Expert
              </p>

              <p className="mt-5 text-sm leading-relaxed text-white/70">
                A smart digital card that combines identity, contact, profile
                presentation and NFC sharing.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-amber-400 px-4 py-3 font-black text-slate-950">
                  Save Contact
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-bold">
                  LinkedIn
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-bold">
                  WhatsApp
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-bold">
                  Website
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
