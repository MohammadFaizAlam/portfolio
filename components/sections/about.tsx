"use client";

import { ArrowRight } from "lucide-react";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { useLanguage } from "@/providers/language-provider";
import { useState } from "react";
import { AboutModal } from "@/components/modals/about-modal";
import { HangingProfile } from "@/components/widgets/hanging-profile";
import { AmbientGlow } from "@/components/effects/ambient-glow";
import { RichText } from "@/lib/markdown";

export default function About() {
    const { content, dict } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="w-full container-void bg-transparent text-foreground overflow-x-clip relative">
            <AmbientGlow variant="section-left" />

            <div className="container mx-auto px-container relative z-10">
                <div className="flex flex-col xl:flex-row gap-12 xl:gap-24">
                    <div className="xl:w-[28%] shrink-0">
                        <div className="flex flex-col gap-4 sticky top-28">
                            <BlurReveal delay={0} yOffset={16}>
                                <span className="title-counter">[001]</span>
                            </BlurReveal>

                            <BlurReveal delay={0.07} yOffset={24}>
                                <h2 className="title relative z-10">{dict.title.about}</h2>
                            </BlurReveal>

                            <BlurReveal delay={0.14} yOffset={24}>
                                <div className="mt-6 hidden xl:block">
                                    <HangingProfile />
                                </div>
                            </BlurReveal>
                        </div>
                    </div>

                    <div className="xl:w-[72%] flex flex-col gap-12 sm:gap-14">
                        <div className="space-y-7 sm:space-y-8">
                            <BlurReveal delay={0.08} yOffset={22} duration={0.6}>
                                <h3 className="font-display text-2xl sm:text-3xl lg:text-[2.65rem] font-semibold leading-[1.12] tracking-tight text-balance max-w-2xl">
                                    <RichText>{content.about.intro}</RichText>
                                </h3>
                            </BlurReveal>

                            <BlurReveal delay={0.14} yOffset={18} duration={0.58}>
                                <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
                                    <RichText>{content.about.description}</RichText>
                                </p>
                            </BlurReveal>

                            <BlurReveal delay={0.18} yOffset={14}>
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(true)}
                                        className="group relative inline-flex cursor-pointer items-center gap-2.5 text-sm sm:text-base font-medium py-1.5 text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring rounded-sm"
                                    >
                                        <span className="relative z-10 border-b border-foreground/35 pb-1 group-hover:border-foreground transition-colors duration-200">
                                            {dict.readFullVersion}
                                        </span>
                                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </button>

                                    <AboutModal open={isOpen} onOpenChange={setIsOpen} />
                                </>
                            </BlurReveal>
                        </div>

                        {/* Architectural Hairline Ledger — Flush, Even, Zero Floating Cards */}
                        {content.about.proofMetrics && content.about.proofMetrics.length > 0 && (
                            <BlurReveal delay={0.22} yOffset={18}>
                                <div className="border-y border-foreground/12 bg-background/30 backdrop-blur-[2px]">
                                    <dl className="grid grid-cols-2 lg:grid-cols-4">
                                        {content.about.proofMetrics.map((metric, idx) => (
                                            <div
                                                key={metric.label}
                                                className={[
                                                    "group flex flex-col justify-between gap-4 py-6 sm:py-7 px-4 sm:px-6 transition-colors duration-300 hover:bg-foreground/[0.025]",
                                                    idx % 2 === 1 ? "border-l border-foreground/10" : "",
                                                    idx >= 2 ? "border-t border-foreground/10 lg:border-t-0" : "",
                                                    idx > 0 ? "lg:border-l lg:border-foreground/10" : "",
                                                ].join(" ")}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <dt className="text-[10px] sm:text-[11px] font-mono tracking-[0.16em] uppercase text-muted-foreground/80">
                                                        {metric.label}
                                                    </dt>
                                                    <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">
                                                        0{idx + 1}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <dd className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums leading-none">
                                                        {metric.value}
                                                    </dd>
                                                    <span className="text-[11px] text-muted-foreground/70 font-light">
                                                        {metric.context}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </BlurReveal>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
