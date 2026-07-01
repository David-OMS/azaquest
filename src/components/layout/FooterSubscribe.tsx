"use client";

import { useState } from "react";

export function FooterSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setMessage(data.error ?? "Something went wrong");
      return;
    }

    setStatus("done");
    setMessage("You're on the list.");
    setEmail("");
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email for drop alerts"
          className="flex-1 border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-foreground"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="border border-foreground bg-foreground px-6 py-3 font-display text-xs font-semibold tracking-[0.35em] text-background transition-colors hover:bg-transparent hover:text-foreground disabled:opacity-50"
        >
          {status === "loading" ? "..." : "SUBSCRIBE"}
        </button>
      </form>
      {message && (
        <p className={`mt-3 text-xs ${status === "error" ? "text-red-400" : "text-muted"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
