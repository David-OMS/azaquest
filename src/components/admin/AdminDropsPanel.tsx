"use client";

import { useCallback, useEffect, useState } from "react";

interface Drop {
  id: string;
  name: string;
  released_at: string;
  is_active: boolean;
}

export function AdminDropsPanel() {
  const [active, setActive] = useState<Drop | null>(null);
  const [recent, setRecent] = useState<Drop[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/drops");
    const data = await res.json();
    setActive(data.active ?? null);
    setRecent(data.recent ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startDrop = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/drops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() || undefined }),
    });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setMessage(data.error ?? "Failed to start drop");
      return;
    }

    setName("");
    setMessage("Drop started");
    load();
  };

  const clearDrop = async (id: string) => {
    setBusy(true);
    setMessage(null);
    const res = await fetch(`/api/admin/drops/${id}/clear`, { method: "POST" });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setMessage(data.error ?? "Failed to clear drop");
      return;
    }

    setMessage(`Removed ${data.cleared} items from new drops`);
    load();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium">Drops</h1>

      <section className="max-w-xl space-y-4 border border-border p-4 sm:p-6">
        <h2 className="text-sm font-medium">New drop</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Week 12 — Mar 28"
          className="w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-white"
        />
        <button
          type="button"
          disabled={busy}
          onClick={startDrop}
          className="border border-white px-4 py-2 text-xs tracking-wider hover:bg-white hover:text-black disabled:opacity-40"
        >
          Start drop
        </button>
      </section>

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : (
        <section className="space-y-4">
          <h2 className="text-sm font-medium">Current</h2>
          {active ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border border-border p-4">
              <div>
                <p className="font-medium">{active.name}</p>
                <p className="text-xs text-muted">
                  {new Date(active.released_at).toLocaleString("en-NG")}
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => clearDrop(active.id)}
                className="text-xs text-muted hover:text-white"
              >
                Clear drop
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted">No active drop</p>
          )}

          {recent.length > 0 && (
            <>
              <h2 className="text-sm font-medium">Recent</h2>
              <ul className="space-y-2 text-sm text-muted">
                {recent.map((drop) => (
                  <li key={drop.id} className="flex justify-between border-b border-border py-2">
                    <span>{drop.name}</span>
                    <span className="text-xs">
                      {drop.is_active ? "Active" : new Date(drop.released_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {message && <p className="text-sm text-muted">{message}</p>}
    </div>
  );
}
