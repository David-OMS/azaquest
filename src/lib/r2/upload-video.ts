import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createR2Client, getR2Bucket, getR2PublicUrl } from "@/lib/r2/client";

const MAX_BYTES = 80 * 1024 * 1024; // 80 MB

export async function uploadHeroVideo(
  file: Buffer,
  originalName: string,
  mimeType: string,
): Promise<string> {
  if (file.byteLength > MAX_BYTES) {
    throw new Error("Video must be under 80 MB");
  }

  const client = createR2Client();
  const bucket = getR2Bucket();
  const publicUrl = getR2PublicUrl();

  if (!client || !bucket || !publicUrl) {
    throw new Error("R2 is not configured");
  }

  const ext = originalName.split(".").pop()?.toLowerCase() ?? "mp4";
  const key = `hero/drop-preview-${Date.now()}.${ext}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: mimeType || "video/mp4",
    }),
  );

  return `${publicUrl}/${key}`;
}
