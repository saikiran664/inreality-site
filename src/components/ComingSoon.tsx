"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/data";

/**
 * Where the notify form posts.
 *
 * Unset until a form service is wired up. That is deliberate rather than a
 * placeholder to forget: a form that POSTs nowhere still *looks* like it
 * worked, and every address typed into it is lost silently. With no endpoint
 * configured the form hands off to the mail client instead, which is less
 * slick but cannot swallow a signup.
 */
const NOTIFY_ENDPOINT = process.env.NEXT_PUBLIC_NOTIFY_ENDPOINT ?? "";

type Status = "idle" | "sending" | "done" | "error";

/**
 * The holding page.
 *
 * Styled locally rather than through the site's tokens. Those are tuned for
 * the dark site, which still lives at /preview and still needs them; scoping
 * the light palette to this one file means the holding page can be white
 * without the rest of the codebase changing colour underneath it.
 *
 * Indigo carries every piece of text here and scarlet carries none of it.
 * #ff4000 on white measures 3.5:1, which passes for large display type and
 * fails for anything you actually read, so scarlet is confined to the panel
 * and the rule.
 */
export function ComingSoon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const address = email.trim();
    if (!address) return;

    if (!NOTIFY_ENDPOINT) {
      // No service configured: hand the address to the mail client so it
      // reaches a human instead of disappearing.
      window.location.href = `mailto:${BRAND.contactEmail}?subject=${encodeURIComponent(
        "Notify me when Inreality launches",
      )}&body=${encodeURIComponent(`Please let me know when you launch.\n\n${address}`)}`;
      setStatus("done");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(NOTIFY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: address }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main
      // Read by the `body:has(...)` rule in globals.css, which lifts the white
      // onto <body> so overscroll and mobile browser chrome match the page.
      data-page="coming-soon"
      className="flex min-h-screen flex-col bg-white lg:flex-row"
    >
      {/* Left: the words */}
      <div className="flex flex-1 flex-col justify-between px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
        {/* Plain img, as BrandMark uses: a fixed-height wordmark, and the only
            image on the page, so next/image buys nothing here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-indigo.png"
          alt={BRAND.agencyName}
          className="h-[22px] w-auto sm:h-[26px]"
        />

        <div className="py-14 lg:py-0">
          <h1 className="font-display text-[14vw] leading-[0.95] tracking-tight text-[#2a0a94] sm:text-7xl lg:text-[5.5rem]">
            LAUNCHING
            <br />
            SOON.
          </h1>

          {/* The one piece of scarlet on this side, and it carries no text. */}
          <div className="mt-7 h-1.5 w-20 rounded-full bg-[#ff4000] sm:w-28" />

          <p className="mt-7 max-w-md font-body text-base font-medium leading-relaxed text-[#4b1fe8]/80 sm:text-lg">
            Personal branding, built on story first. We are putting the finishing
            touches to the site.
          </p>

          <form onSubmit={onSubmit} className="mt-9 max-w-md">
            <label
              htmlFor="notify-email"
              className="block font-body text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#4b1fe8]/60"
            >
              Get told when we go live
            </label>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="notify-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="min-w-0 flex-1 rounded-full border border-[#4b1fe8]/25 bg-white px-5 py-3 font-body text-sm font-medium text-[#2a0a94] outline-none transition-colors placeholder:text-[#4b1fe8]/35 focus:border-[#4b1fe8] sm:text-base"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#2a0a94] px-6 py-3 font-body text-xs font-extrabold uppercase tracking-wider text-white transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60 sm:text-sm"
              >
                {status === "sending" ? "Sending" : "Notify me"}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            <p
              aria-live="polite"
              className="mt-3 min-h-5 font-body text-xs font-medium text-[#4b1fe8]/70 sm:text-sm"
            >
              {status === "done" && "Thank you. We will be in touch at launch."}
              {status === "error" &&
                `Something went wrong. Email us at ${BRAND.contactEmail} instead.`}
            </p>
          </form>
        </div>

        <a
          href={`mailto:${BRAND.contactEmail}`}
          className="font-body text-sm font-semibold text-[#4b1fe8] underline decoration-[#ff4000] decoration-2 underline-offset-4 transition-colors hover:text-[#2a0a94]"
        >
          {BRAND.contactEmail}
        </a>
      </div>

      {/* Right: the colour. Decorative only, so it is allowed to be the one
          place scarlet runs at full strength. Short on phones, full height
          from lg where it sits beside the type rather than above it. */}
      <div
        aria-hidden="true"
        className="h-40 w-full shrink-0 sm:h-56 lg:h-auto lg:min-h-screen lg:w-[42%]"
        style={{
          background:
            "linear-gradient(155deg, #2a0a94 0%, #4b1fe8 42%, #e63600 82%, #ff4000 100%)",
        }}
      />
    </main>
  );
}
