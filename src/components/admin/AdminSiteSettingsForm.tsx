"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/site/get-settings";

interface AdminSiteSettingsFormProps {
  initial: SiteSettings;
}

export function AdminSiteSettingsForm({ initial }: AdminSiteSettingsFormProps) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const update = (field: keyof SiteSettings, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hero_punchline: form.hero_punchline,
        whatsapp_number: form.whatsapp_number || null,
        ig_handle: form.ig_handle,
        empty_drop_message: form.empty_drop_message,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMessage(data.error ?? "Save failed");
      return;
    }

    setForm(data.settings);
    setMessage("Settings saved");
  };

  return (
    <form onSubmit={handleSave} className="max-w-xl space-y-4 border border-border p-4 sm:p-6">
      <h2 className="text-sm font-medium tracking-[0.15em]">COPY & CONTACT</h2>

      <label className="block space-y-1 text-sm">
        <span className="text-muted">Hero punchline</span>
        <input
          value={form.hero_punchline}
          onChange={(e) => update("hero_punchline", e.target.value)}
          className="w-full border border-border bg-surface px-3 py-2 outline-none focus:border-white"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="text-muted">Empty drop message</span>
        <input
          value={form.empty_drop_message}
          onChange={(e) => update("empty_drop_message", e.target.value)}
          className="w-full border border-border bg-surface px-3 py-2 outline-none focus:border-white"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="text-muted">WhatsApp number (digits, e.g. 2349027548604)</span>
        <input
          value={form.whatsapp_number ?? ""}
          onChange={(e) => update("whatsapp_number", e.target.value)}
          className="w-full border border-border bg-surface px-3 py-2 outline-none focus:border-white"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="text-muted">Instagram handle</span>
        <input
          value={form.ig_handle}
          onChange={(e) => update("ig_handle", e.target.value)}
          className="w-full border border-border bg-surface px-3 py-2 outline-none focus:border-white"
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className="border border-white px-4 py-2 text-xs tracking-wider hover:bg-white hover:text-black disabled:opacity-40"
      >
        {saving ? "Saving..." : "Save settings"}
      </button>

      {message && <p className="text-xs text-muted">{message}</p>}
    </form>
  );
}
