"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrandMark } from "@/components/BrandMark";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Root-relative, not bare fragments. Services and the journey are real pages
 * now, and a bare "#why" resolves against whatever page you are currently on
 * — so from /services it would look for an anchor that isn't there and do
 * nothing. Leading with "/" always returns to the home page first.
 */
const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/journey", label: "Journey" },
  { href: "/#philosophy", label: "Philosophy" },
  { href: "/#why", label: "Why us" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-void/60 backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-3 sm:px-6 md:px-12 md:py-5 lg:px-16">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            onClick={() => window.dispatchEvent(new Event("inreality:replay-intro"))}
            title="Replay intro"
            className="shrink-0 transition-opacity duration-300 hover:opacity-70"
          >
            <BrandMark height={16} className="sm:!text-[20px]" />
          </Link>

          <nav className="hidden items-center gap-7 md:flex lg:gap-9">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm font-bold uppercase tracking-wider text-paper/65 transition-colors duration-300 hover:text-scarlet"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/#contact"
            className="btn-scarlet shrink-0 rounded-full px-4 py-2 font-body text-[11px] font-extrabold uppercase tracking-wider transition-transform duration-300 hover:scale-[1.05] sm:px-6 sm:py-2.5 sm:text-sm"
          >
            Work With Us
          </Link>
        </div>

        {/*
          Below md the links get a row of their own.

          They used to share the top row with the wordmark and the button and
          were cut to the first two to fit — so which links a visitor saw
          depended on how wide their phone was, and on a narrow one even those
          two were clipped mid-word. On their own row all five are present at
          every width, and scroll horizontally if the screen is too narrow for
          the full set. The negative margin lets that scroll run to the edge
          of the screen instead of stopping inside the padding.
        */}
        <nav className="scrollbar-none -mx-5 mt-2.5 flex items-center gap-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 whitespace-nowrap font-body text-[11px] font-bold uppercase tracking-wider text-paper/65"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
