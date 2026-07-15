import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Terms of Service | iakkr" };

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b px-6 py-4 sm:px-10">
        <Link href="/">
          <Image src="/iakkr-logo.png" alt="iakkr" width={80} height={40} className="dark:invert" />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12 sm:px-0">
        <div>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-1 text-sm text-muted-foreground">Last updated July 2026</p>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Using iakkr</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            iakkr is a platform for business consultants to manage client engagements, run industry-specific
            assessments, and share resources with the businesses they work with. By creating an account, you agree
            to these terms.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Accounts</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You&apos;re responsible for the accuracy of the information you provide and for keeping your login
            credentials secure. Consultant accounts are responsible for the businesses and content they create;
            client accounts see a read-only view of the engagement they&apos;re linked to.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Acceptable use</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Don&apos;t use iakkr to store or share anything unlawful, and don&apos;t try to access data belonging to
            an account that isn&apos;t yours. We may suspend accounts that violate this.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Content you publish</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Consultants remain responsible for the accuracy of checklists and articles they publish. iakkr doesn&apos;t
            review or verify consulting advice shared through the platform.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">No warranty</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            iakkr is provided as-is, without warranties of any kind. We&apos;re a new product and actively building
            — features may change as we improve the platform.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Account deletion</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You can request deletion of your account and associated data at any time by emailing{" "}
            <a href="mailto:iakkrllc@gmail.com" className="text-primary hover:underline">
              iakkrllc@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Changes to these terms</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We may update these terms as the product evolves. Material changes will update the date at the top of
            this page.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Questions about these terms? Reach us at{" "}
            <a href="mailto:iakkrllc@gmail.com" className="text-primary hover:underline">
              iakkrllc@gmail.com
            </a>
            .
          </p>
        </section>
      </main>
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground sm:px-10">
        © {new Date().getFullYear()} iakkr LLC ·{" "}
        <Link href="/privacy" className="hover:text-foreground">
          Privacy
        </Link>{" "}
        ·{" "}
        <Link href="/contact" className="hover:text-foreground">
          Contact
        </Link>
      </footer>
    </div>
  );
}
