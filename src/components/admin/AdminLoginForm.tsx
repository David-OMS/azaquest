"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/ssr-browser";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <p className="text-sm text-muted">
        Check your email for the magic link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-xs text-muted">
          Admin email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-border bg-surface px-3 py-2 text-sm text-white outline-none focus:border-white"
          placeholder="you@example.com"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full border border-white bg-white py-3 text-sm font-medium tracking-wider text-black transition-colors hover:bg-transparent hover:text-white disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send magic link"}
      </button>
    </form>
  );
}
