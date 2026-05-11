import { getTranslations } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "announcements" });

  const { data: post } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link href={`/${locale}/announcements`} className="text-sm text-indigo-600 hover:text-indigo-700 mb-6 inline-flex items-center gap-1">
        ← {t("back_to_list")}
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-2">
        {locale === "th" ? post.title_th : post.title_en}
      </h1>
      <p className="text-xs text-(--muted-foreground) mb-6">
        {t("published")} {new Date(post.created_at).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
        {locale === "th" ? post.body_th : post.body_en}
      </div>
    </div>
  );
}
