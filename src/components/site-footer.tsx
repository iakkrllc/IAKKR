import Image from "next/image";
import Link from "next/link";

/** Shared marketing-site footer — used on the homepage and every public page. */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t px-6 py-12 sm:px-10">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/iakkr-logo.png" alt="iakkr" width={80} height={40} className="dark:invert" />
          <p className="mt-3 text-sm text-muted-foreground">The CRM for running your business, any industry.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">Product</span>
          <Link href="/#services" className="text-muted-foreground hover:text-foreground">
            Services
          </Link>
          <Link href="/#industries" className="text-muted-foreground hover:text-foreground">
            Industries
          </Link>
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            Log in
          </Link>
          <Link href="/signup" className="text-muted-foreground hover:text-foreground">
            Sign up
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">Resources</span>
          <Link href="/resources" className="text-muted-foreground hover:text-foreground">
            Guides &amp; checklists
          </Link>
          <Link href="/resources/roi-calculator" className="text-muted-foreground hover:text-foreground">
            ROI calculator
          </Link>
          <Link href="/#faq" className="text-muted-foreground hover:text-foreground">
            FAQ
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">Company</span>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
            Contact
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-5xl border-t pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} iakkr LLC
      </div>
    </footer>
  );
}
