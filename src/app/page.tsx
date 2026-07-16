import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HeroIllustration } from "@/components/hero-illustration";
import { NewsletterForm } from "@/components/newsletter-form";
import { HeroSignupForm } from "@/components/hero-signup-form";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SectionHeading } from "@/components/section-heading";
import {
  CentralizeIllustration,
  UnifyIllustration,
  SimplifyIllustration,
  AccessIllustration,
} from "@/components/feature-illustrations";
import {
  BookOpen,
  UtensilsCrossed,
  Fuel,
  Sparkles,
  UserPlus,
  ListChecks,
  LineChart,
} from "lucide-react";

const FEATURE_ROWS = [
  {
    illustration: CentralizeIllustration,
    title: "Centralize and organize your work",
    body: [
      "Track every business — your own, or a client's — its stage in your workflow, and your notes in one central place.",
      "Whether it's one business you run yourself or a full roster of consulting clients, everything lives on the engagement it belongs to.",
    ],
  },
  {
    illustration: UnifyIllustration,
    title: "Unify your documents and conversations",
    body: [
      "No more hunting through email for the file or message you need.",
      "iakkr keeps documents and conversations attached to the engagement they're about, so you can always refer back to them later.",
    ],
  },
  {
    illustration: SimplifyIllustration,
    title: "Simplify your workflows",
    body: [
      "Turn next steps into tracked tasks with a status and a due date — nothing falls through the cracks.",
      "Run vertical-specific assessments that score automatically, so you always know exactly where an engagement stands.",
    ],
  },
  {
    illustration: AccessIllustration,
    title: "Give your team access anywhere",
    body: [
      "View, edit, and manage every business from any internet-connected device.",
      "Your team clocks in and out, and every business, stage, and assessment score rolls up into one report.",
    ],
  },
];

const HOW_IT_WORKS = [
  {
    icon: UserPlus,
    title: "Sign up and pick your path",
    body: "Join as a business owner running your own operation, or as a consultant managing engagements for many clients.",
  },
  {
    icon: ListChecks,
    title: "Add a business, run an assessment",
    body: "Pick an industry — or type your own — and run a checklist built for it. Every yes/no question rolls up into a score automatically.",
  },
  {
    icon: LineChart,
    title: "Run it day to day",
    body: "Tasks, documents, messages, and your team's time clock all stay attached to the engagement, with reporting across every business at a glance.",
  },
];

const INDUSTRIES = [
  { icon: UtensilsCrossed, name: "Restaurant Consulting" },
  { icon: Fuel, name: "Gas Station Consulting" },
];

const FAQS = [
  {
    q: "What industries does iakkr support?",
    a: "Any industry. Pick from the list at signup or type your own — Restaurant and Gas Station Consulting are seeded to start, and every industry gets its own assessment checklists and playbooks.",
  },
  {
    q: "Do I need a consultant to use iakkr?",
    a: "No. Sign up as a business owner and create your own business directly — you manage stages, documents, tasks, messaging, and your team's time clock yourself. Consultants are a separate signup path for managing many client businesses.",
  },
  {
    q: "How do assessments work?",
    a: "Run a checklist built for your industry against your business. Each yes/no question contributes to an overall score, so you can track progress over time.",
  },
  {
    q: "Who can see my business's information?",
    a: "Only you, and your consultant if you're linked to one. A linked business owner gets a read-only view of their own engagement, assessment history, and relevant content — nothing else.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <section className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 bg-primary px-6 py-16 text-white sm:px-10 sm:py-24 lg:py-28">
          <Badge className="w-fit gap-1.5 border border-white/30 bg-white/10 text-white">
            <Sparkles className="h-3.5 w-3.5" /> Any industry, any team size
          </Badge>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            All your business, in one place with iakkr
          </h1>
          <p className="max-w-lg text-balance text-lg text-white/85">
            iakkr is a CRM for running a business day to day — assessments, documents, conversations, tasks, and
            your team&apos;s time clock, all in one place. Run your own business directly, or manage engagements
            for many clients as a consultant — any industry.
          </p>
          <HeroSignupForm />
        </div>
        <div className="flex items-center justify-center bg-background px-6 py-16 sm:px-10">
          <HeroIllustration />
        </div>
      </section>

      <section className="border-y bg-foreground px-6 py-3 text-center text-sm font-medium text-background sm:px-10">
        Now in early access — onboarding our first consulting practices and business owners.
      </section>

      <section className="border-b bg-muted/30 px-6 py-10 sm:px-10">
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Run your own business</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sign up as a business owner, create your business under any industry, and manage it yourself —
                stages, documents, tasks, messaging, and your team&apos;s time clock.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Manage many clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sign up as a consultant to run engagements for as many client businesses as you take on, each with
                its own workflow and reporting.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="services" className="scroll-mt-20 px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <SectionHeading className="mb-16">What iakkr does</SectionHeading>
          <div className="flex flex-col gap-20">
            {FEATURE_ROWS.map((f, i) => (
              <div
                key={f.title}
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="flex flex-col items-start gap-4">
                  <h3 className="text-balance text-2xl font-bold sm:text-3xl">{f.title}</h3>
                  {f.body.map((p) => (
                    <p key={p} className="text-muted-foreground">
                      {p}
                    </p>
                  ))}
                  <Button asChild className="mt-2 rounded-full">
                    <Link href="/signup">Learn more +</Link>
                  </Button>
                </div>
                <div className="flex justify-center">
                  <f.illustration />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <SectionHeading className="mb-14">How iakkr works</SectionHeading>
          <div className="grid gap-10 sm:grid-cols-3">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.title} className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="scroll-mt-20 border-t bg-muted/30 px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold sm:text-3xl">Built for any industry</h2>
            <p className="max-w-md text-balance text-muted-foreground">
              Checklists and playbooks are specific to your industry. Pick one below, or type your own at
              signup — new industries are added as data, not code.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {INDUSTRIES.map((v) => (
              <Card key={v.name} className="w-48">
                <CardContent className="flex flex-col items-center gap-2 py-6">
                  <v.icon className="h-7 w-7 text-primary" />
                  <span className="text-sm font-medium">{v.name}</span>
                </CardContent>
              </Card>
            ))}
            <Card className="flex w-48 items-center justify-center border-dashed">
              <CardContent className="py-6 text-sm text-muted-foreground">+ your industry</CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 border-t px-6 py-16 text-center sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <h2 className="text-2xl font-bold sm:text-3xl">Pricing</h2>
          <p className="text-balance text-muted-foreground">
            Free during early access. We&apos;re onboarding our first consultants and business owners now — sign
            up and we&apos;ll be in touch about pricing as you grow.
          </p>
          <Button asChild className="mt-2 rounded-full">
            <Link href="/signup">Sign up free</Link>
          </Button>
        </div>
      </section>

      <section id="company" className="scroll-mt-20 border-t px-6 py-16 text-center sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <Badge variant="secondary">Early access</Badge>
          <h2 className="text-2xl font-bold sm:text-3xl">Built early, in the open</h2>
          <p className="text-balance text-muted-foreground">
            iakkr is a new platform — we&apos;re onboarding our first consultants and business owners now, and
            building alongside them. No fake logos or borrowed reviews here: real customer stories will show up
            on this page once they exist.
          </p>
          <Button asChild className="mt-2 rounded-full">
            <Link href="/signup">Be one of the first</Link>
          </Button>
        </div>
      </section>

      <section id="resources" className="scroll-mt-20 border-t bg-muted/30 px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <BookOpen className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold sm:text-3xl">Free resources, plus a growing library inside</h2>
          <p className="max-w-lg text-balance text-muted-foreground">
            Grab a sample checklist or try the ROI calculator now — or sign up to see the full library consultants
            publish for the businesses they work with, organized by industry.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full">
              <Link href="/resources">Browse free resources</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/signup">Explore after signing up</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 border-t px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-t bg-muted/30 px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Get consulting insights in your inbox</h2>
          <p className="text-muted-foreground">Occasional updates on new verticals, features, and playbooks. No spam.</p>
          <NewsletterForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
