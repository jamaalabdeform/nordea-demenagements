import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Demandes", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-stone-100/70">
      <header className="sticky top-0 z-30 border-b border-ink/8 bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin-demo" aria-label="Tableau de bord">
              <Logo compact />
            </Link>
            <span className="hidden rounded-full bg-marine-50 px-3 py-1 text-xs font-medium text-marine-700 sm:inline">Espace entreprise · démo</span>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-ink-2 hover:bg-stone-100" target="_blank">
              <span className="hidden sm:inline">Voir le site</span>
              <ExternalLink className="size-4" strokeWidth={1.6} aria-hidden />
            </Link>
            <form action={logout}>
              <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-ink-2 hover:bg-stone-100" aria-label="Se déconnecter">
                <LogOut className="size-4" strokeWidth={1.6} aria-hidden />
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main id="contenu" className="mx-auto max-w-[90rem] px-4 pb-24 pt-8 sm:px-8 sm:pt-10">
        {children}
      </main>
    </div>
  );
}
