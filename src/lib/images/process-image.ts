import sharp from "sharp";

const MAX_WIDTH = 900;
const QUALITY = 78;
export async function processProductImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();
}
