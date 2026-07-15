"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Hero email capture — hands off straight into signup with the email pre-filled. */
export function HeroSignupForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(email.trim() ? `/signup?email=${encodeURIComponent(email.trim())}` : "/signup");
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          placeholder="Company email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-full border-white/30 bg-white/10 text-white placeholder:text-white/60 focus-visible:border-white/50 focus-visible:ring-white/30"
        />
        <Button
          type="submit"
          size="lg"
          className="shrink-0 rounded-full bg-foreground text-background hover:bg-foreground/85"
        >
          Get started
        </Button>
      </form>
      <p className="text-xs text-white/70">
        By submitting, I agree to the{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
