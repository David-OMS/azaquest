import { SiteShell } from "@/components/layout/SiteShell";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export const dynamic = "force-dynamic";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SiteShell>{children}</SiteShell>
    </ThemeProvider>
  );
}
