"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCT_MENU = [
  {
    heading: "Product",
    items: [
      { href: "/#services", label: "Overview" },
      { href: "/#company", label: "Why iakkr" },
    ],
  },
  {
    heading: "Features",
    items: [
      { href: "/#services", label: "Centralize and Organize Your Work" },
      { href: "/#services", label: "Unify Documents and Conversations" },
      { href: "/#services", label: "Simplify Your Workflows" },
      { href: "/#services", label: "Give Your Team Access Anywhere" },
    ],
  },
  {
    heading: "Get Started",
    items: [
      { href: "/signup", label: "Sign up free" },
      { href: "/#pricing", label: "See pricing" },
    ],
  },
];

/** Shared marketing-site header — used on the homepage and every public page. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <header
        className={cn(
          "sticky top-0 z-20 flex items-center justify-between border-b bg-background/95 px-6 py-3.5 backdrop-blur transition-colors sm:px-10",
          open && "border-primary",
        )}
      >
        <Link href="/" onClick={() => setOpen(false)}>
          <Image src="/iakkr-logo.png" alt="iakkr" width={90} height={45} priority className="dark:invert" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-foreground md:flex">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={cn(
              "flex flex-col items-center gap-1 hover:text-primary",
              open && "text-primary",
            )}
          >
            Product
            <span className={cn("h-1 w-1 rounded-full bg-primary", open ? "opacity-100" : "opacity-0")} />
          </button>
          <Link href="/#industries" className="hover:text-primary" onClick={() => setOpen(false)}>
            Solutions
          </Link>
          <Link href="/#pricing" className="hover:text-primary" onClick={() => setOpen(false)}>
            Pricing
          </Link>
          <Link href="/resources" className="hover:text-primary" onClick={() => setOpen(false)}>
            Resources
          </Link>
          <div className="hidden h-5 w-px bg-border lg:block" />
          <Link
            href="/#company"
            className="hidden text-muted-foreground hover:text-primary lg:inline"
            onClick={() => setOpen(false)}
          >
            Company
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden h-6 w-px bg-border sm:block" />
          <Link
            href="/login"
            className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground sm:flex"
          >
            <UserRound className="h-4 w-4" /> Log In
          </Link>
          <Button asChild className="rounded-full">
            <Link href="/signup">Sign up free</Link>
          </Button>
          <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/85">
            <Link href="/contact">Talk to us</Link>
          </Button>
        </div>
      </header>

      {open && (
        <div className="absolute inset-x-0 top-full z-20 border-b bg-background shadow-lg">
          <div className="mx-auto grid max-w-4xl gap-10 px-6 py-10 sm:grid-cols-3 sm:px-10">
            {PRODUCT_MENU.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-primary">{col.heading}</span>
                <ul className="flex flex-col gap-2.5">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="text-sm text-foreground hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
