import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Privacy Policy | iakkr" };

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12 sm:px-0">
        <div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-1 text-sm text-muted-foreground">Last updated July 2026</p>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">What we collect</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            When you create an account, we collect your name, email address, and the role you sign up as
            (consultant or business owner). If you&apos;re a consultant, the businesses and engagements you create
            — along with assessment answers and content you publish — are stored so you and your linked clients can
            access them. If you subscribe to our newsletter from the homepage, we store that email address
            separately.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">How we use it</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your data is used to run the product: authenticating you, showing you the businesses and engagements
            you&apos;re part of, and sending account-related emails (like confirming your email address). We don&apos;t
            sell your data, and we don&apos;t use it for advertising.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Who can see your information</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A business&apos;s data is visible only to the consultant who created it and the client account it&apos;s
            linked to. Consultants cannot see other consultants&apos; clients, and client accounts only see their own
            business.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Who we share it with</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We use a small number of infrastructure providers to run iakkr: Supabase (authentication and database),
            Resend (sending account emails), and Vercel (hosting). These providers process data on our behalf and
            don&apos;t use it for their own purposes.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Staying signed in</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We use your browser&apos;s local storage to keep you signed in between visits. We don&apos;t use
            advertising or tracking cookies.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Your choices</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You can delete a business or checklist template you created at any time from within the app. To delete
            your account entirely, unsubscribe from the newsletter, or request a copy of your data, email us at{" "}
            <a href="mailto:iakkrllc@gmail.com" className="text-primary hover:underline">
              iakkrllc@gmail.com
            </a>{" "}
            and we&apos;ll take care of it.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Children&apos;s privacy</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            iakkr is a business tool and isn&apos;t directed at, or knowingly used by, anyone under 18.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Changes to this policy</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            If this policy changes in a meaningful way, we&apos;ll update the date at the top of this page.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Questions about this policy? Reach us at{" "}
            <a href="mailto:iakkrllc@gmail.com" className="text-primary hover:underline">
              iakkrllc@gmail.com
            </a>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
