"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FormValues = { post1: string; post2: string; post3: string; post4: string; post5: string };

export function InstagramPostsForm({ initialPosts }: { initialPosts: FormValues }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/instagram-posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(posts)
      });
      const data = await response.json();
      if (!response.ok) {
        const errors = data.error?.fieldErrors as Record<string, string[] | undefined> | undefined;
        throw new Error(errors ? Object.values(errors).flat().join(", ") : "Could not save Instagram posts");
      }
      setMessage("Saved successfully.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save Instagram posts");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5 rounded-xl border border-blush-100 bg-white p-5 sm:p-6">
      {(["post1", "post2", "post3", "post4", "post5"] as const).map((field, index) => (
        <label key={field} className="block text-sm font-medium text-blush-700">
          Post {index + 1}
          <input
            type="url"
            value={posts[field]}
            onChange={(event) => setPosts((current) => ({ ...current, [field]: event.target.value }))}
            required
            className="mt-1 w-full rounded-lg border border-blush-200 px-3 py-2 text-blush-900 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
          />
        </label>
      ))}
      {message && <p className="text-sm text-blush-600" role="status">{message}</p>}
      <button type="submit" disabled={saving} className="rounded-full bg-blush-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
