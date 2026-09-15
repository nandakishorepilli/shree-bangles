import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

// Everything under app/admin/(dashboard)/* is protected by this layout.
// app/admin/login lives OUTSIDE this route group, so it's never wrapped by
// this auth check (avoiding a redirect loop).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(SESSION_COOKIE.name)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-blush-50">
      <AdminSidebar adminEmail={session.email} />
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
