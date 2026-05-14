import { getTranslations } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "announcements" });
  return { title: t("title"), description: t("description") };
}

export default async function AnnouncementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "announcements" });

  const { data: posts } = await supabase
    .from("announcements")
    .select("id, title_th, title_en, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
      <p className="text-(--muted-foreground) text-sm mb-8">{t("description")}</p>

      {!posts?.length ? (
        <p className="text-(--muted-foreground) text-center py-12">{t("no_posts")}</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/announcements/${post.id}`}
              className="block bg-(--card) border border-(--border) rounded-xl p-5 hover:border-indigo-400 hover:shadow-sm transition-all"
            >
              <h2 className="font-semibold text-base mb-1">
                {locale === "th" ? post.title_th : post.title_en}
              </h2>
              <p className="text-xs text-(--muted-foreground)">
                {t("published")} {new Date(post.created_at).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
