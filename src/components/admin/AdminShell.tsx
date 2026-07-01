import Link from "next/link";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminNav } from "@/components/admin/AdminNav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="flex shrink-0 items-center gap-2">
            <LogoLockup size="header" href={null} className="h-7 sm:h-8" />
            <span className="hidden text-xs font-semibold tracking-[0.2em] text-muted sm:inline">
              ADMIN
            </span>
          </Link>
          <AdminLogoutButton />
        </div>
        <AdminNav />
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
