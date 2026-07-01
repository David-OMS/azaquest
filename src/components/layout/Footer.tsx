import { LogoLockup } from "@/components/brand/LogoLockup";
import { FooterSubscribe } from "@/components/layout/FooterSubscribe";
import { getSiteSettings } from "@/lib/site/get-settings";
import { resolveIgHandle } from "@/lib/whatsapp";

export async function Footer() {
  const settings = await getSiteSettings();
  const igHandle = resolveIgHandle(settings.ig_handle);
  const phone = settings.whatsapp_number ?? "09027548604";
  const telHref = phone.startsWith("+") ? phone : `+${phone.replace(/\D/g, "")}`;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-display text-sm font-semibold tracking-[0.35em] text-foreground">
              STAY IN THE LOOP
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted">
              Get notified before the next drop sells out.
            </p>
            <div className="mt-6">
              <FooterSubscribe />
            </div>
          </div>

          <div className="space-y-6 text-sm text-muted">
            <p className="font-display text-xs font-semibold tracking-[0.35em] text-foreground">
              CONTACT
            </p>
            <address className="not-italic leading-relaxed">
              No. 50 Owode Street, off Social Club Road,<br />
              Agbe Road, Abule Egba, Lagos, Nigeria
            </address>
            <p>
              <a href={`tel:${telHref}`} className="hover:text-foreground">
                {phone.replace(/^\+?234/, "0")}
              </a>
            </p>
            <p>
              <a
                href={`https://instagram.com/${igHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                @{igHandle}
              </a>
            </p>
            <p className="font-display text-xs tracking-[0.35em] text-foreground">
              NATIONWIDE DELIVERY
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <LogoLockup size="footer" />
        </div>
      </div>
    </footer>
  );
}
