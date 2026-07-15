import Image from "next/image";
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
import {
  ClipboardCheck,
  Users,
  BookOpen,
  LayoutGrid,
  Clock,
  UtensilsCrossed,
  Fuel,
  Sparkles,
  FolderOpen,
  MessageSquare,
  BarChart3,
  Eye,
  FileStack,
  MessagesSquare,
  GaugeCircle,
} from "lucide-react";

const BENEFITS = [
  {
    icon: Eye,
    title: "Full visibility",
    body: "See every engagement's stage at a glance — no more digging through notes to find out where things stand.",
  },
  {
    icon: FileStack,
    title: "Streamlined intake",
    body: "Collect documents from clients without email back-and-forth.",
  },
  {
    icon: MessagesSquare,
    title: "Context, not chaos",
    body: "Every conversation stays attached to the engagement it's about.",
  },
  {
    icon: GaugeCircle,
    title: "One command center",
    body: "Your whole client list, every stage, every score — one dashboard.",
  },
];

const SERVICES = [
  {
    icon: Users,
    title: "Business & engagement management",
    body: "Track every business — your own, or a client's — its stage in your workflow, and your notes in one place.",
  },
  {
    icon: ClipboardCheck,
    title: "Vertical-specific assessments",
    body: "Run checklists built for your industry and score results automatically.",
  },
  {
    icon: BookOpen,
    title: "Content & playbooks",
    body: "Publish guides and best practices tailored to any industry.",
  },
  {
    icon: FolderOpen,
    title: "Document sharing",
    body: "Collect and share files directly on the engagement — no more email attachments.",
  },
  {
    icon: MessageSquare,
    title: "Messaging",
    body: "A running conversation tied to the business it's about.",
  },
  {
    icon: ClipboardCheck,
    title: "Task tracking",
    body: "Turn next steps into tracked tasks with a status and a due date — nothing falls through the cracks.",
  },
  {
    icon: Clock,
    title: "Team time tracking",
    body: "A roster and time clock for your staff, with a timesheet that totals hours automatically.",
  },
  {
    icon: BarChart3,
    title: "Reporting",
    body: "See every business, stage, and assessment score across your whole operation at a glance.",
  },
  {
    icon: LayoutGrid,
    title: "Built for any industry",
    body: "Pick a vertical or type your own at signup — new industries are data, not code.",
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
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur sm:px-10">
        <Image src="/iakkr-logo.png" alt="iakkr" width={90} height={45} priority className="dark:invert" />
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#services" className="hover:text-foreground">
            Services
          </a>
          <a href="#industries" className="hover:text-foreground">
            Industries
          </a>
          <Link href="/resources" className="hover:text-foreground">
            Resources
          </Link>
          <a href="#faq" className="hover:text-foreground">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </header>

      <section className="grid items-center gap-10 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-6 text-left">
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Any industry, any team size
          </Badge>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Run your business from one place
          </h1>
          <p className="max-w-lg text-balance text-lg text-muted-foreground">
            iakkr is a CRM for running a business day to day — assessments, documents, conversations, tasks, and
            your team&apos;s time clock, all in one place. Run your own business directly, or manage engagements
            for many clients as a consultant — any industry.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Get started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <HeroIllustration />
        </div>
      </section>

      <section className="border-t bg-muted/30 px-6 py-10 sm:px-10">
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

      <section className="border-t px-6 py-12 sm:px-10">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex flex-col gap-2">
              <b.icon className="h-6 w-6 text-primary" />
              <h3 className="font-heading text-base font-semibold">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t bg-primary px-6 py-4 text-center text-sm font-medium text-primary-foreground sm:px-10">
        Ready to bring structure to your business? <Link href="/signup" className="underline underline-offset-2">Start free →</Link>
      </section>

      <section id="services" className="border-t px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">What iakkr does</h2>
            <p className="text-muted-foreground">Everything a consulting practice needs, in one place.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <f.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="border-t bg-muted/30 px-6 py-16 sm:px-10 sm:py-20">
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

      <section id="resources" className="border-t px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <BookOpen className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold sm:text-3xl">Free resources, plus a growing library inside</h2>
          <p className="max-w-lg text-balance text-muted-foreground">
            Grab a sample checklist or try the ROI calculator now — or sign up to see the full library consultants
            publish for the businesses they work with, organized by industry.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/resources">Browse free resources</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">Explore after signing up</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 px-6 py-16 text-center sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <h2 className="text-2xl font-bold sm:text-3xl">Built for any business, any industry</h2>
          <p className="text-balance text-muted-foreground">
            iakkr is a new platform — we&apos;re early, and building alongside the business owners and consultants
            who join us. Real customer stories will live here soon.
          </p>
        </div>
      </section>

      <section id="faq" className="border-t px-6 py-16 sm:px-10 sm:py-20">
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

      <footer className="mt-auto border-t px-6 py-12 sm:px-10">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-4">
          <div>
            <Image src="/iakkr-logo.png" alt="iakkr" width={80} height={40} className="dark:invert" />
            <p className="mt-3 text-sm text-muted-foreground">The CRM for running your business, any industry.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-semibold">Product</span>
            <a href="#services" className="text-muted-foreground hover:text-foreground">
              Services
            </a>
            <a href="#industries" className="text-muted-foreground hover:text-foreground">
              Industries
            </a>
            <Link href="/resources" className="text-muted-foreground hover:text-foreground">
              Resources
            </Link>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-semibold">Account</span>
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              Log in
            </Link>
            <Link href="/signup" className="text-muted-foreground hover:text-foreground">
              Sign up
            </Link>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-semibold">Company</span>
            <a href="#faq" className="text-muted-foreground hover:text-foreground">
              FAQ
            </a>
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
    </div>
  );
}
