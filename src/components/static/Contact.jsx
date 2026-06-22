'use client';

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { useSubmitContactMessage } from "@/services/api/contact";
import { showToast } from "@/lib/toast";

const CONTACT_ITEMS = [
  {
    icon: Mail,
    title: "Email",
    detail: "support@digimart.com",
    href: "mailto:support@digimart.com",
  },
  {
    icon: Phone,
    title: "Phone",
    detail: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: MapPin,
    title: "Address",
    detail: "123 Business Avenue, Suite 100, Mumbai, India",
  },
  {
    icon: Clock,
    title: "Support hours",
    detail: "Mon – Sat, 9:00 AM – 6:00 PM IST",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const submitContact = useSubmitContactMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContact.mutateAsync(formData);
      showToast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      showToast.error(
        err.response?.data?.message || "Could not send message. Please try again."
      );
    }
  };

  return (
    <div className="bg-canvas">
      <div className="container-page py-6">
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-ink">Contact</span>
        </nav>

        <section className="mb-8">
          <span className="text-sm font-medium uppercase tracking-wide text-brand">
            Get in touch
          </span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            We&apos;re here to help
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            Questions about an order, a product, or anything else? Send us a message and our
            team will respond as soon as possible.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          <aside className="space-y-4 lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-ink">Contact information</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Reach us directly using the details below, or fill out the form.
              </p>

              <ul className="mt-6 space-y-5">
                {CONTACT_ITEMS.map(({ icon: Icon, title, detail, href }) => (
                  <li key={title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
                      <Icon className="h-4 w-4 text-brand" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-ink">{title}</h3>
                      {href ? (
                        <a
                          href={href}
                          className="mt-0.5 block text-sm text-muted transition-colors hover:text-brand"
                        >
                          {detail}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm leading-relaxed text-muted">{detail}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="text-sm font-semibold text-ink">Common topics</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>Order tracking & delivery</li>
                <li>Returns & refunds</li>
                <li>Product availability</li>
                <li>Account & payment issues</li>
              </ul>
              <Link href="/faq" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
                Visit FAQ
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-ink">Send us a message</h2>
              <p className="mt-1 text-sm text-muted">
                All fields are required. We typically reply within one business day.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-body">
                    Name
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="field h-11 px-4 text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-body">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="field h-11 px-4 text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-body">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    rows={5}
                    className="field w-full resize-y px-4 py-3 text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitContact.isPending}
                  className="btn-primary h-11 w-full text-sm disabled:opacity-50 sm:w-auto sm:px-8"
                >
                  {submitContact.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
