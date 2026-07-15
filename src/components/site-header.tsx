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
      <nav className="hidden items-center gap-6 text-sm font-semibold text-foreground md:flex">
        <Link href="/#services" className="hover:text-primary">
          Services
        </Link>
        <Link href="/#industries" className="hover:text-primary">
          Industries
        </Link>
        <Link href="/resources" className="hover:text-primary">
          Resources
        </Link>
        <Link href="/#faq" className="hover:text-primary">
          FAQ
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
  );
}
