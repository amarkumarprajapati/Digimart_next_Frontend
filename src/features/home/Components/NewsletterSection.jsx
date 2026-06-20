'use client';

import { useState } from "react";
import { Mail } from "lucide-react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail("");
      setTimeout(() => setIsSuccess(false), 3000);
    }, 800);
  };

  return (
    <section className="container-page py-12">
      <div className="rounded-2xl border border-line bg-surface p-8 sm:p-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Join our mailing list
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              Be the first to hear about new arrivals, restocks and special
              offers. No spam, unsubscribe anytime.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-3 lg:ml-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="field h-11 pl-10 pr-4 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="btn-primary h-11 px-5 text-sm whitespace-nowrap"
            >
              {isSubmitting ? "Joining..." : isSuccess ? "Subscribed" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
