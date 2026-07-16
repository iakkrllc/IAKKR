import Image from "next/image";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { ScrollToTop } from "@/components/scroll-to-top";

const SOLUTION_COLUMNS = [
  {
    title: "Solutions by Role",
    items: [
      { href: "/#paths", label: "Consultants" },
      { href: "/#paths", label: "Business Owners" },
    ],
  },
  {
    title: "Solutions by Function",
    items: [
      { href: "/#services", label: "Business & Engagement Management" },
      { href: "/#services", label: "Vertical-Specific Assessments" },
      { href: "/#services", label: "Document Sharing" },
      { href: "/#services", label: "Messaging" },
      { href: "/#services", label: "Task Tracking" },
      { href: "/#services", label: "Team Time Tracking" },
      { href: "/#services", label: "Reporting" },
    ],
  },
  {
    title: "Solutions by Industry",
    items: [
      { href: "/#industries", label: "Restaurant Consulting" },
      { href: "/#industries", label: "Gas Station Consulting" },
      { href: "/#industries", label: "Add Your Own Industry" },
    ],
  },
  {
    title: "Solutions by Problem",
    items: [
      { href: "/#services", label: "Centralize and Organize Your Work" },
      { href: "/#services", label: "Unify Documents and Conversations" },
      { href: "/#services", label: "Simplify Your Workflows" },
      { href: "/#services", label: "Give Your Team Access Anywhere" },
    ],
  },
];

const ROW_1 = [
  { href: "/#services", label: "Product" },
  { href: "/#industries", label: "Solutions" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#company", label: "Company" },
];

const ROW_2 = [
  { href: "/#how-it-works", label: "How iakkr Works" },
  { href: "/resources", label: "Guides & Checklists" },
  { href: "/resources/roi-calculator", label: "ROI Calculator" },
  { href: "/#faq", label: "FAQ" },
];

const ROW_3 = [
  { href: "/#company", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/privacy", label: "Privacy Policy" },
];

/** Shared marketing-site footer — used on the homepage and every public page. */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t px-6 py-8 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center gap-3">
          <Image src="/iakkr-logo.png" alt="iakkr" width={70} height={35} className="dark:invert" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTION_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-primary">{col.title}</span>
              <ul className="flex flex-col gap-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-foreground hover:text-primary">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 border-t pt-6 text-sm font-medium">
          {ROW_1.map((l) => (
            <Link key={l.label} href={l.href} className="text-foreground hover:text-primary">
              {l.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 border-t pt-6 text-sm text-muted-foreground">
          {ROW_2.map((l) => (
            <Link key={l.label} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-primary pt-6 text-sm text-muted-foreground">
          {ROW_3.map((l) => (
            <Link key={l.label} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
          <Link
            href="/privacy"
            className="rounded-full border px-4 py-1.5 text-xs font-medium hover:bg-muted"
          >
            Do Not Sell or Share My Personal Information
          </Link>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            The CRM for running your business, any industry.
          </span>
          <span>© {new Date().getFullYear()} iakkr LLC</span>
        </div>
      </div>

      <ScrollToTop />
      <Link
        href="/contact"
        aria-label="Contact us"
        className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        <MessageSquare className="h-5 w-5" />
      </Link>
    </footer>
  );
}
