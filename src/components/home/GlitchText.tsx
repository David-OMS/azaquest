export function GlitchText({ text }: { text: string }) {
  return (
    <h1 className="glitch-text font-display max-w-3xl text-5xl font-bold uppercase leading-[0.92] tracking-[0.02em] text-foreground sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem]">
      {text}
    </h1>
  );
}
