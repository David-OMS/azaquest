import { SplitHero } from "@/components/home/SplitHero";
import { DropsSlider } from "@/components/home/DropsSlider";
import { CategoryQuest } from "@/components/home/CategoryQuest";
import { getCategories, getProducts } from "@/lib/products/get-products";
import { getSiteSettings } from "@/lib/site/get-settings";

export default async function HomePage() {
  const [newDrops, settings, categories] = await Promise.all([
    getProducts({
      status: "available",
      isNewDrop: true,
      sort: "newest",
    }),
    getSiteSettings(),
    getCategories(),
  ]);

  return (
    <>
      <SplitHero
        videoUrl={settings.hero_video_url}
        punchline={settings.hero_punchline}
      />
      <DropsSlider products={newDrops} />
      <CategoryQuest categories={categories} />
    </>
  );
}
