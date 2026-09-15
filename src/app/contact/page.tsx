"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  // NOTE: this form does not yet send anywhere — it's a UI placeholder.
  // A future iteration should POST to a new /api/contact route that emails
  // the boutique owner or stores inquiries in the database.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-2xl py-14">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-600">Get in Touch</p>
        <h1 className="font-display text-4xl text-blush-900">Contact Us</h1>
        <p className="mt-2 text-blush-500">
          Placeholder contact details — replace with real email, phone, and studio address.
        </p>
      </div>

      {submitted ? (
        <p className="rounded-xl bg-blush-50 p-6 text-center text-blush-700">
          Thank you! Your message has been noted. (This form is a placeholder and isn&apos;t
          connected to a backend yet.)
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blush-700">Name</span>
            <input required className="w-full rounded-lg border border-blush-200 px-3 py-2" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blush-700">Email</span>
            <input type="email" required className="w-full rounded-lg border border-blush-200 px-3 py-2" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blush-700">Message</span>
            <textarea required rows={5} className="w-full rounded-lg border border-blush-200 px-3 py-2" />
          </label>
          <button type="submit" className="rounded-full bg-blush-600 px-8 py-3 font-medium text-cream-50 hover:bg-blush-700">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
