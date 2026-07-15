import { cn } from "@/lib/utils";

/** Bold heading with a short underline and a diagonal tick, echoed above each major section. */
export function SectionHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-0", className)}>
      <h2 className="text-center text-3xl font-extrabold text-primary sm:text-4xl">{children}</h2>
      <div className="mt-3 flex items-end">
        <div className="h-[3px] w-24 bg-primary sm:w-32" />
        <div className="h-[3px] w-5 origin-left -rotate-45 bg-primary" />
      </div>
    </div>
  );
}
