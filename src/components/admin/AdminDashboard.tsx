"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface AdminStats {
  available: number;
  sold: number;
  soldThisWeek: number;
  newDrops: number;
  archiveReady: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [archiveMsg, setArchiveMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.stats ?? null))
      .finally(() => setLoading(false));
  }, []);

  const runArchive = async (action: "cleanup" | "export") => {
    setBusy(true);
    setArchiveMsg(null);
    const res = await fetch("/api/admin/archive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: action === "export" ? "export" : "cleanup" }),
    });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setArchiveMsg(data.error ?? "Something went wrong");
      return;
    }

    if (action === "export") {
      setArchiveMsg(`Backup saved (${data.count} items).`);
    } else {
      setArchiveMsg(`Done — photos removed from ${data.processed} old sold items.`);
      const statsRes = await fetch("/api/admin/stats");
      const statsData = await statsRes.json();
      setStats(statsData.stats ?? null);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium">Dashboard</h1>

      {loading ? (
        <p className="text-sm text-muted">...</p>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="In shop" value={stats.available} />
          <StatCard label="New drops" value={stats.newDrops} />
          <StatCard label="Sold this week" value={stats.soldThisWeek} />
          <StatCard label="Sold total" value={stats.sold} />
          <StatCard label="Old sold" value={stats.archiveReady} />
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink href="/admin/products/new" label="Add product" />
        <QuickLink href="/admin/products" label="Products" />
        <QuickLink href="/admin/products/sold" label="Sold" />
        <QuickLink href="/admin/drops" label="Drops" />
        <QuickLink href="/admin/settings" label="Settings" />
      </div>

      <section className="space-y-4 border border-border p-4 sm:p-6">
        <h2 className="text-sm font-medium">Old sold items</h2>
        <p className="text-sm text-muted">
          Sold over a month ago? You can delete the photos to free up space. The item still shows on the sold page.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy || !stats?.archiveReady}
            onClick={() => runArchive("cleanup")}
            className="border border-white px-4 py-2 text-xs tracking-wider hover:bg-white hover:text-black disabled:opacity-40"
          >
            Remove old photos ({stats?.archiveReady ?? 0})
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => runArchive("export")}
            className="border border-border px-4 py-2 text-xs tracking-wider hover:border-white"
          >
            Download backup
          </button>
        </div>
        {archiveMsg && <p className="text-xs text-muted">{archiveMsg}</p>}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-surface p-4">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="border border-border px-4 py-3 text-center text-xs tracking-wider hover:border-white"
    >
      {label}
    </Link>
  );
}
