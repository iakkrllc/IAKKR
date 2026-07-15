import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";

/** Shared marketing-site header — used on the homepage and every public page. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-6 py-3.5 backdrop-blur sm:px-10">
      <Link href="/">
        <Image src="/iakkr-logo.png" alt="iakkr" width={90} height={45} priority className="dark:invert" />
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
        <Link href="/#services" className="hover:text-foreground">
          Services
        </Link>
        <Link href="/#industries" className="hover:text-foreground">
          Industries
        </Link>
        <Link href="/resources" className="hover:text-foreground">
          Resources
        </Link>
        <Link href="/#faq" className="hover:text-foreground">
          FAQ
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground sm:flex"
        >
          <UserRound className="h-4 w-4" /> Log In
        </Link>
        <div className="hidden h-6 w-px bg-border sm:block" />
        <Button variant="secondary" asChild className="rounded-full">
          <Link href="/contact">Talk to us</Link>
        </Button>
        <Button asChild className="rounded-full">
          <Link href="/signup">Sign up free</Link>
        </Button>
      </div>
    </header>
  );
}
