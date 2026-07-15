"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function RoiCalculatorPage() {
  const [locations, setLocations] = useState("1");
  const [monthlyRevenue, setMonthlyRevenue] = useState("50000");
  const [inefficiency, setInefficiency] = useState("8");

  const locationsNum = Math.max(0, Number(locations) || 0);
  const revenueNum = Math.max(0, Number(monthlyRevenue) || 0);
  const inefficiencyNum = Math.min(100, Math.max(0, Number(inefficiency) || 0));

  const monthlySavings = locationsNum * revenueNum * (inefficiencyNum / 100);
  const annualSavings = monthlySavings * 12;

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b px-6 py-4 sm:px-10">
        <Link href="/">
          <Image src="/iakkr-logo.png" alt="iakkr" width={80} height={40} className="dark:invert" />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-6 py-12 sm:px-0">
        <div>
          <Link href="/resources" className="text-sm text-muted-foreground hover:underline">
            ← Back to resources
          </Link>
          <h1 className="mt-2 text-3xl font-bold">Consulting ROI Calculator</h1>
          <p className="mt-1 text-muted-foreground">
            A rough estimate of what addressing operational inefficiencies could be worth to your business.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your numbers</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="locations">Number of locations</Label>
              <Input
                id="locations"
                type="number"
                min="0"
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="revenue">Average monthly revenue per location</Label>
              <Input
                id="revenue"
                type="number"
                min="0"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inefficiency">Estimated inefficiency to address (%)</Label>
              <Input
                id="inefficiency"
                type="number"
                min="0"
                max="100"
                value={inefficiency}
                onChange={(e) => setInefficiency(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                A rough estimate of revenue lost to gaps like inconsistent processes, compliance issues, or missed
                upsells — most operators land between 3–12%.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Estimated impact</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Estimated monthly value</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(monthlySavings)}</p>
            <p className="mt-3 text-sm text-muted-foreground">Estimated annual value</p>
            <p className="text-2xl font-bold">{formatCurrency(annualSavings)}</p>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          This is a rough planning estimate, not a guarantee — actual results depend on your business and the
          engagement itself.
        </p>

        <Button asChild size="lg">
          <Link href="/signup">Get started with a consultant</Link>
        </Button>
      </main>
    </div>
  );
}
