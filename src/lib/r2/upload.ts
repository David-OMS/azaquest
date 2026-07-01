import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createR2Client, getR2Bucket, getR2PublicUrl } from "@/lib/r2/client";
import { processProductImage } from "@/lib/images/process-image";

function buildObjectKey(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9.-]/g, "-");
  return `products/${Date.now()}-${base}.webp`;
}

export async function uploadProductImage(
  file: Buffer,
  originalName: string,
): Promise<string> {
  const client = createR2Client();
  const bucket = getR2Bucket();
  const publicUrl = getR2PublicUrl();

  if (!client || !bucket || !publicUrl) {
    throw new Error("R2 is not configured");
  }

  const [processed, key] = await Promise.all([
    processProductImage(file),
    Promise.resolve(buildObjectKey(originalName)),
  ]);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: processed,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${publicUrl}/${key}`;
}

export async function deleteR2Object(url: string): Promise<void> {
  const client = createR2Client();
  const bucket = getR2Bucket();
  const publicUrl = getR2PublicUrl();

  if (!client || !bucket || !publicUrl) return;
  if (!url.startsWith(publicUrl)) return;

  const key = url.slice(publicUrl.length + 1);
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
