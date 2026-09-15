"use client";

import { useState } from "react";
import { getWhatsappOrderUrl, shreeBanglesContact } from "@/lib/business";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const message = String(formData.get("message") ?? "");
    const whatsappUrl = getWhatsappOrderUrl(`Hello, my name is ${name}.\nEmail: ${email}\n\n${message}`);

    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setSubmitted(true);
    }
  }

  return (
    <div className="mx-auto max-w-2xl py-14">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-600">Get in Touch</p>
        <h1 className="font-display text-4xl text-blush-900">Contact Us</h1>
        <p className="mt-2 text-blush-500">We&apos;d love to hear from you.</p>
      </div>

      <div className="mb-10 space-y-2 text-center text-blush-800">
        <p><a href={`mailto:${shreeBanglesContact.email}`}>{shreeBanglesContact.email}</a></p>
        <p><a href={`tel:${shreeBanglesContact.phone.replace(/\s/g, "")}`}>{shreeBanglesContact.phone} (Phone / WhatsApp)</a></p>
        <p>{shreeBanglesContact.address}</p>
        <p><a href={shreeBanglesContact.instagramUrl} target="_blank" rel="noreferrer">Instagram</a></p>
      </div>

      {submitted ? (
        <p className="rounded-xl bg-blush-50 p-6 text-center text-blush-700">
          Thank you! WhatsApp has opened with your message.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blush-700">Name</span>
            <input name="name" required className="w-full rounded-lg border border-blush-200 px-3 py-2" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blush-700">Email</span>
            <input name="email" type="email" required className="w-full rounded-lg border border-blush-200 px-3 py-2" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-blush-700">Message</span>
            <textarea name="message" required rows={5} className="w-full rounded-lg border border-blush-200 px-3 py-2" />
          </label>
          <button type="submit" className="rounded-full bg-blush-600 px-8 py-3 font-medium text-cream-50 hover:bg-blush-700">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
