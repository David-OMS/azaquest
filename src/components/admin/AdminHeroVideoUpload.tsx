"use client";

import { useState } from "react";

interface AdminHeroVideoUploadProps {
  currentUrl?: string | null;
}

export function AdminHeroVideoUpload({ currentUrl }: AdminHeroVideoUploadProps) {
  const [url, setUrl] = useState(currentUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/admin/uploads/hero-video", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      return;
    }

    setUrl(data.url);
    setSuccess(true);
  };

  return (
    <section className="max-w-xl space-y-4 border border-border p-6">
      <div>
        <h2 className="text-sm font-medium tracking-[0.15em]">HERO DROP VIDEO</h2>
        <p className="mt-2 text-sm text-muted">
          Upload the IG drop rotation clip. It appears on the left side of the homepage editorial.
          MP4 or MOV, under 80 MB.
        </p>
      </div>

      {url && (
        <div className="aspect-[9/16] max-h-64 w-full overflow-hidden bg-surface">
          <video src={url} muted loop playsInline controls className="h-full w-full object-cover" />
        </div>
      )}

      <input
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        disabled={uploading}
        onChange={handleUpload}
        className="text-sm text-muted"
      />

      {uploading && <p className="text-xs text-muted">Uploading to R2...</p>}
      {success && <p className="text-xs text-green-400">Video live on homepage.</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </section>
  );
}
