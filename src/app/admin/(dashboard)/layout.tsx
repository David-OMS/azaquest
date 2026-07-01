import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminEmail, getSessionUser } from "@/lib/auth/require-admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const adminEmail = getAdminEmail();

  if (!user) {
    redirect("/admin/login");
  }

  if (adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    redirect("/admin/login?error=forbidden");
  }

  return <AdminShell>{children}</AdminShell>;
}
