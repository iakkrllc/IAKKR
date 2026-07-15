import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FileText, Calculator, Download } from "lucide-react";

export const metadata = { title: "Resources | iakkr" };

const DOWNLOADS = [
  {
    href: "/resources/restaurant-opening-checklist.pdf",
    title: "Restaurant Opening Checklist",
    body: "A sample assessment — the same kind consultants run against real clients inside iakkr.",
  },
  {
    href: "/resources/gas-station-compliance-checklist.pdf",
    title: "Gas Station Compliance Checklist",
    body: "Fuel systems, safety, and compliance items for a gas station engagement.",
  },
  {
    href: "/resources/getting-started-with-iakkr.pdf",
    title: "Getting Started with iakkr",
    body: "A short guide for both consultants and business owners on their first week using iakkr.",
  },
];

const FAQS = [
  {
    q: "What industries does iakkr support?",
    a: "We launched with Restaurant Consulting and Gas Station Consulting, with more industries added regularly. Each vertical gets its own assessment checklists and playbooks.",
  },
  {
    q: "How do assessments work?",
    a: "Your consultant runs a checklist built for your industry against your business. Each yes/no question contributes to an overall score, so you can track progress over time.",
  },
  {
    q: "Who can see my business's information?",
    a: "Only you and your assigned consultant. Business owners get a read-only view of their own engagement, assessment history, and relevant content — nothing else.",
  },
  {
    q: "Can I request a new industry?",
    a: "Yes — reach out and we'll prioritize adding it. Since verticals are just data in iakkr, new industries don't require a rebuild.",
  },
  {
    q: "Are the sample checklists above the same ones I'd use in the app?",
    a: "They're representative samples. Once you're signed in, you can build your own checklist templates with whatever questions matter for your engagement.",
  },
  {
    q: "Is there a cost to use iakkr?",
    a: "iakkr is in early access while we onboard our first consultants. Sign up and we'll be in touch about pricing as you get set up.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-6 py-12 sm:px-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-muted-foreground">
            Sample checklists, a getting-started guide, and answers to common questions.
          </p>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Downloads</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {DOWNLOADS.map((d) => (
              <Card key={d.href}>
                <CardHeader>
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{d.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">{d.body}</p>
                  <Button variant="outline" size="sm" asChild className="self-start gap-1.5">
                    <a href={d.href} download>
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Tools</h2>
          <Card className="max-w-md">
            <CardHeader>
              <Calculator className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Consulting ROI Calculator</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Estimate the potential value of structured consulting for your business.
              </p>
              <Button size="sm" asChild className="self-start">
                <Link href="/resources/roi-calculator">Open calculator</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
