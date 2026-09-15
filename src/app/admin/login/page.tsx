"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = { email: formData.get("email"), password: formData.get("password") };

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Login failed");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blush-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-1 font-display text-2xl text-blush-900">Shree Bangles</h1>
        <p className="mb-6 text-sm text-blush-500">Admin sign in</p>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-blush-700">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-blush-200 px-3 py-2 focus:border-blush-500 focus:outline-none"
          />
        </label>
        <label className="mb-6 block">
          <span className="mb-1 block text-sm font-medium text-blush-700">Password</span>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-blush-200 px-3 py-2 focus:border-blush-500 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-blush-600 py-3 font-medium text-cream-50 hover:bg-blush-700 disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
