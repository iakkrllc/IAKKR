"use client";

import { ENGAGEMENT_STAGES, ENGAGEMENT_STAGE_LABELS, type EngagementStage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

/** Horizontal 5-stage progress indicator for an engagement's workflow position. */
export function StageStepper({ stage }: { stage: EngagementStage }) {
  const currentIndex = ENGAGEMENT_STAGES.indexOf(stage);

  return (
    <div className="flex items-center">
      {ENGAGEMENT_STAGES.map((s, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        return (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  done && "border-primary bg-primary text-primary-foreground",
                  current && "border-primary text-primary",
                  !done && !current && "border-muted-foreground/30 text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-center text-[11px] leading-tight whitespace-nowrap",
                  current ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {ENGAGEMENT_STAGE_LABELS[s]}
              </span>
            </div>
            {i < ENGAGEMENT_STAGES.length - 1 && (
              <div className={cn("mx-1 h-0.5 flex-1", done ? "bg-primary" : "bg-muted-foreground/20")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
