import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Shared marketing-site header — used on the homepage and every public page. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur sm:px-10">
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
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign up free</Link>
        </Button>
      </div>
    </header>
  );
}
