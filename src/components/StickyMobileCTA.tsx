"use client";

import { useEffect, useState } from "react";

/**
 * Phone-only action bar. On mobile the header CTA scrolls out of reach within
 * a screen or two, leaving the whole middle of the page with no way to act —
 * this keeps one always within thumb reach.
 *
 * It stays hidden until the hero has scrolled past (the hero has its own CTA,
 * so showing both at once is just clutter) and hides again over the contact
 * section, where it would cover the real thing it points at.
 */
export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.9;
      const contact = document.getElementById("contact");
      // Suppress once the contact section is genuinely on screen, not merely
      // approaching — otherwise the bar disappears while still useful.
      const atContact = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.75
        : false;
      setVisible(pastHero && !atContact);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300 md:hidden ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      // Hidden from assistive tech when off-screen: the link is still in the
      // DOM, and a screen reader would otherwise reach a control nobody can see.
      aria-hidden={!visible}
    >
      <a
        href="#contact"
        tabIndex={visible ? 0 : -1}
        className="btn-scarlet flex w-full items-center justify-center rounded-full px-6 py-4 font-body text-sm font-extrabold uppercase tracking-wider shadow-lg"
      >
        Work with us
      </a>
    </div>
  );
}
