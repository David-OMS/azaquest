"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/products/new", label: "Add" },
  { href: "/admin/drops", label: "Drops" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/", label: "View site" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto max-w-6xl overflow-x-auto px-4 pb-3">
      <ul className="flex min-w-max gap-1 sm:gap-2">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block whitespace-nowrap px-3 py-1.5 text-xs tracking-wide ${
                  active ? "bg-surface text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
