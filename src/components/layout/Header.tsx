import { LogoLockup } from "@/components/brand/LogoLockup";
import { HeaderActions } from "@/components/layout/HeaderActions";
import { HEADER_HEIGHT_REM } from "@/lib/layout";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div
        className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6"
        style={{ height: HEADER_HEIGHT_REM }}
      >
        <LogoLockup size="header" priority />
        <HeaderActions />
      </div>
    </header>
  );
}
