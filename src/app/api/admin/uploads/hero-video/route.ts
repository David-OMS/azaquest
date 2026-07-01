import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { updateSiteSettings } from "@/lib/site/get-settings";
import { uploadHeroVideo } from "@/lib/r2/upload-video";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadHeroVideo(buffer, file.name, file.type);
    const settings = await updateSiteSettings({ hero_video_url: url });

    return NextResponse.json({ url, settings }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
