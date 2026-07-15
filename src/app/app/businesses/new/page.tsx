"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import type { Business, ClientOption, Vertical } from "@/lib/types";
import { useProfile } from "@/lib/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OTHER_VERTICAL = "__other__";

export default function NewBusinessPage() {
  const router = useRouter();
  const { profile } = useProfile();
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [name, setName] = useState("");
  const [verticalId, setVerticalId] = useState("");
  const [customVertical, setCustomVertical] = useState("");
  const [ownerClientId, setOwnerClientId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<{ verticals: Vertical[] }>("/api/verticals").then((res) => setVerticals(res.verticals));
    if (profile?.role === "consultant") {
      apiFetch<{ clients: ClientOption[] }>("/api/clients").then((res) => setClients(res.clients));
    }
  }, [profile?.role]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !verticalId || (verticalId === OTHER_VERTICAL && !customVertical.trim())) {
      toast.error("Enter a business name and pick (or type) an industry");
      return;
    }
    setSubmitting(true);
    try {
      let resolvedVerticalId = verticalId;
      if (verticalId === OTHER_VERTICAL) {
        const res = await apiFetch<{ vertical: Vertical }>("/api/verticals", {
          method: "POST",
          body: JSON.stringify({ name: customVertical.trim() }),
        });
        resolvedVerticalId = res.vertical.id;
      }

      const res = await apiFetch<{ business: Business }>("/api/businesses", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          verticalId: resolvedVerticalId,
          ...(profile?.role === "consultant" ? { ownerClientId: ownerClientId || null } : {}),
        }),
      });
      toast.success("Business created");
      router.push(`/app/businesses/${res.business.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create that business");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-start justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>New business</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Business name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Industry</Label>
              <Select value={verticalId} onValueChange={setVerticalId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick an industry" />
                </SelectTrigger>
                <SelectContent>
                  {verticals.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={OTHER_VERTICAL}>Other — type my own</SelectItem>
                </SelectContent>
              </Select>
              {verticalId === OTHER_VERTICAL && (
                <Input
                  className="mt-1"
                  placeholder="e.g. Auto Detailing"
                  value={customVertical}
                  onChange={(e) => setCustomVertical(e.target.value)}
                />
              )}
            </div>

            {profile?.role === "consultant" && (
              <div className="flex flex-col gap-1.5">
                <Label>Owner (optional)</Label>
                <Select value={ownerClientId} onValueChange={setOwnerClientId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Not linked yet" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  No matching account yet? Leave this blank — you can link it once the owner signs up.
                </p>
              </div>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create business"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
