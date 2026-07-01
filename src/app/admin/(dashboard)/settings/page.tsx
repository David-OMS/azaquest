import { AdminHeroVideoUpload } from "@/components/admin/AdminHeroVideoUpload";
import { AdminSiteSettingsForm } from "@/components/admin/AdminSiteSettingsForm";
import { getSiteSettings } from "@/lib/site/get-settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium">Settings</h1>
      <AdminHeroVideoUpload currentUrl={settings.hero_video_url} />
      <AdminSiteSettingsForm initial={settings} />
    </div>
  );
}
