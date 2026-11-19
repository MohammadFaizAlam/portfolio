"use client";

import { useLanguage } from "@/providers/language-provider";

const Separator = () => (
    <span
        aria-hidden="true"
        className="text-xl sm:text-2xl md:text-3xl font-mono text-foreground/20 select-none"
    >
        /
    </span>
);

export default function ManifestoFlow({ reverse = false }: { reverse?: boolean }) {
  const { content } = useLanguage();
  const manifestoItems = content?.manifesto || [];

  if (!manifestoItems.length) return null;

  return (
    <div
      aria-hidden="true"
      data-manifesto-flow="true"
      className="relative w-full overflow-hidden border-y border-foreground/[0.08] py-9 sm:py-12 select-none pointer-events-none bg-transparent"
    >
      <div className="flex w-full overflow-hidden marquee-track [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div
          className={`animate-scroll transform-gpu will-change-transform flex min-w-full shrink-0 items-center justify-around gap-8 pr-8 xl:gap-14 xl:pr-14 ${
            reverse ? "direction-reverse" : ""
          }`}
        >
          {manifestoItems.map((item: string, index: number) => (
            <div key={`t1-${index}`} className="flex items-center gap-8 xl:gap-14">
              <span className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight uppercase text-foreground/[0.18] whitespace-nowrap">
                {item}
              </span>
              <Separator />
            </div>
          ))}
        </div>

        <div
          className={`animate-scroll transform-gpu will-change-transform flex min-w-full shrink-0 items-center justify-around gap-8 pr-8 xl:gap-14 xl:pr-14 ${
            reverse ? "direction-reverse" : ""
          }`}
        >
          {manifestoItems.map((item: string, index: number) => (
            <div key={`t2-${index}`} className="flex items-center gap-8 xl:gap-14">
              <span className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight uppercase text-foreground/[0.18] whitespace-nowrap">
                {item}
              </span>
              <Separator />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}