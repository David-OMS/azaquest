import { GlitchText } from "@/components/home/GlitchText";
import { HeroKicker } from "@/components/home/HeroKicker";
import { BeginQuestCTA } from "@/components/home/BeginQuestCTA";
import { HeroVideo } from "@/components/home/HeroVideo";
import { HEADER_HEIGHT_REM } from "@/lib/layout";

interface SplitHeroProps {
  videoUrl?: string | null;
  punchline?: string;
}

export function SplitHero({
  videoUrl,
  punchline = "EVERY QUEST HAS A REWARD.",
}: SplitHeroProps) {
  return (
    <section
      className="grid lg:grid-cols-[40%_60%]"
      style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT_REM})` }}
    >
      <HeroVideo videoUrl={videoUrl} />
      <div className="flex flex-col items-start justify-center px-6 py-20 lg:px-14 lg:py-0">
        <HeroKicker />
        <GlitchText text={punchline} />
        <div className="mt-12">
          <BeginQuestCTA />
        </div>
      </div>
    </section>
  );
}
