import Image, { type ImageProps } from "next/image";

/** Admin previews skip the optimizer — faster in dev and avoids R2 proxy 404 loops. */
export function AdminThumb({
  src,
  alt = "",
  className = "",
  fill,
  sizes,
  width,
  height,
}: Pick<ImageProps, "src" | "alt" | "className" | "fill" | "sizes" | "width" | "height">) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      unoptimized
      className={className}
    />
  );
}
