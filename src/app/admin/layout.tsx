import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

async function getSession() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/th");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-(--card) border-b border-(--border) px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">🧮 Smart Calc — Admin</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
          <Link href="/admin/analytics" className="hover:text-indigo-600 transition-colors">Analytics</Link>
          <Link href="/admin/announcements" className="hover:text-indigo-600 transition-colors">Announcements</Link>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
