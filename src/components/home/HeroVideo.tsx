interface HeroVideoProps {
  videoUrl?: string | null;
}

export function HeroVideo({ videoUrl }: HeroVideoProps) {
  if (videoUrl) {
    return (
      <div className="relative h-full min-h-[50vh] w-full overflow-hidden bg-surface lg:min-h-full">
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[50vh] w-full flex-col items-center justify-center gap-2 bg-surface lg:min-h-full">
      <p className="text-[10px] tracking-[0.4em] text-muted">DROP PREVIEW</p>
      <p className="max-w-[200px] text-center text-xs text-muted">
        Upload hero video in Admin → Settings
      </p>
    </div>
  );
}
