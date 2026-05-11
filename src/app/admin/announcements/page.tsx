"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Post { id: string; title_th: string; title_en: string; body_th: string; body_en: string; published: boolean; created_at: string }

export default function AdminAnnouncementsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ title_th: "", title_en: "", body_th: "", body_en: "", published: false });

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data as Post[]);
  }

  async function save() {
    if (editing) {
      await supabase.from("announcements").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editing.id);
    } else {
      await supabase.from("announcements").insert(form);
    }
    setEditing(null);
    setForm({ title_th: "", title_en: "", body_th: "", body_en: "", published: false });
    fetchPosts();
  }

  async function del(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    fetchPosts();
  }

  function edit(post: Post) {
    setEditing(post);
    setForm({ title_th: post.title_th, title_en: post.title_en, body_th: post.body_th, body_en: post.body_en, published: post.published });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Announcements</h1>

      {/* Form */}
      <div className="bg-(--card) border border-(--border) rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">{editing ? "Edit" : "New"} Announcement</h2>
        {[
          { label: "Title (TH)", key: "title_th" as const },
          { label: "Title (EN)", key: "title_en" as const },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full px-3 py-2 bg-(--muted) border border-(--border) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        ))}
        {[
          { label: "Body (TH)", key: "body_th" as const },
          { label: "Body (EN)", key: "body_en" as const },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <textarea value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} rows={4}
              className="w-full px-3 py-2 bg-(--muted) border border-(--border) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
        ))}
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
          Published
        </label>
        <div className="flex gap-3">
          <button onClick={save} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">{editing ? "Update" : "Create"}</button>
          {editing && <button onClick={() => { setEditing(null); setForm({ title_th: "", title_en: "", body_th: "", body_en: "", published: false }); }} className="px-4 py-2 bg-(--muted) rounded-lg text-sm">Cancel</button>}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-(--card) border border-(--border) rounded-xl p-4 flex justify-between items-start">
            <div>
              <p className="font-semibold">{post.title_th}</p>
              <p className="text-xs text-(--muted-foreground) mt-0.5">{post.title_en}</p>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {post.published ? "Published" : "Draft"}
              </span>
            </div>
            <div className="flex gap-2 ml-4 shrink-0">
              <button onClick={() => edit(post)} className="text-xs text-indigo-600 hover:underline">Edit</button>
              <button onClick={() => del(post.id)} className="text-xs text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
