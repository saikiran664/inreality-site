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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5 md:px-12 lg:px-16">
        <Link
          href="/"
          onClick={() => window.dispatchEvent(new Event("inreality:replay-intro"))}
          title="Replay intro"
          className="shrink-0 transition-opacity duration-300 hover:opacity-70"
        >
          <BrandMark height={16} className="sm:!text-[20px]" />
        </Link>

        {/* Full nav from md up; below that the section links move into a
            compact scrollable row so they stay reachable on phones. */}
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

        <nav className="flex min-w-0 flex-1 items-center justify-end gap-4 overflow-x-auto md:hidden">
          {LINKS.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 font-body text-[11px] font-bold uppercase tracking-wider text-paper/65"
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
    </motion.header>
  );
}
