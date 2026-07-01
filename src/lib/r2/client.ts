import { S3Client } from "@aws-sdk/client-s3";

export function createR2Client(): S3Client | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function getR2Bucket(): string | null {
  return process.env.R2_BUCKET_NAME ?? null;
}

export function getR2PublicUrl(): string | null {
  const base = process.env.R2_PUBLIC_URL;
  return base ? base.replace(/\/$/, "") : null;
}
