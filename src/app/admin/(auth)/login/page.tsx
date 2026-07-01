import { LogoLockup } from "@/components/brand/LogoLockup";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <LogoLockup size="footer" href={null} />
        </div>
        <p className="mb-8 text-center text-sm text-muted">Admin sign in</p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
