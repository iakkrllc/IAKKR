"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Fixed back-to-top button — appears once the page has scrolled past the fold. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-24 z-20 flex h-11 w-11 items-center justify-center rounded-full border bg-background text-foreground shadow-md transition-colors hover:bg-muted"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
