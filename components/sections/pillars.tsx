"use client";

import React, { useRef, useState, useCallback } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionValueEvent,
    useReducedMotion,
} from "framer-motion";
import { useLanguage } from "@/providers/language-provider";
import { useLenis } from "@/providers/smooth-scroll-provider";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { AmbientGlow } from "@/components/effects/ambient-glow";
import { FluidShaderBackground } from "@/components/effects/fluid-shader-bg";
import { PillarVisualCanvas } from "@/components/sections/pillar-visuals";
import { RichText } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import type { PillarItem } from "@/types/pillars";
import {
    computePillarCardTransform,
    getActivePillarIndex,
} from "@/lib/portfolio-enhancements";

export default function Pillars() {
    const { content, dict } = useLanguage();
    const lenis = useLenis();
    const pillars: PillarItem[] = content.pillars || [];
    const sectionRef = useRef<HTMLDivElement>(null);
    const anchorRefs = useRef<(HTMLDivElement | null)[]>([]);
    const prefersReducedMotion = useReducedMotion() ?? false;

    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const idx = getActivePillarIndex(latest, pillars.length);
        setActiveIndex((prev) => (prev === idx ? prev : idx));
    });

    const scrollToPillar = useCallback(
        (index: number) => {
            const targetEl = anchorRefs.current[index];
            if (!targetEl) return;

            const stickyOffset = -(80 + index * 44);
            if (lenis && !prefersReducedMotion) {
                lenis.scrollTo(targetEl, {
                    offset: stickyOffset,
                    duration: 1.05,
                });
            } else {
                targetEl.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                    block: "start",
                });
            }
        },
        [lenis, prefersReducedMotion]
    );

    if (!pillars.length) return null;

    return (
        <section
            ref={sectionRef}
            data-slot="pillars"
            className="w-full container-void bg-background text-foreground relative border-t border-border/50"
        >
            <AmbientGlow variant="dual" />

            {/* Viewport-pinned WebGL liquid-silk background that flows behind the entire Scrollytelling sequence without breaking sticky children */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    <FluidShaderBackground variant="pillars" />
                </div>
            </div>

            <div className="container mx-auto px-container relative z-10">
                {/* Expansive Section Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-24">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <BlurReveal delay={0} yOffset={16}>
                            <span className="title-counter">[002]</span>
                        </BlurReveal>
                        <BlurReveal delay={0.07} yOffset={24}>
                            <h2 className="title">{dict.title.pillars}</h2>
                        </BlurReveal>
                    </div>

                    <div className="lg:max-w-xl flex flex-col gap-2">
                        <BlurReveal delay={0.14} yOffset={20}>
                            <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                                <RichText>{dict.pillarsIntro}</RichText>
                            </p>
                        </BlurReveal>
                    </div>
                </div>

                {/* Scrollytelling Architectural Matrix Shell */}
                <div className="grid grid-cols-1 xl:grid-cols-[76px_1fr] gap-6 xl:gap-12 items-start">
                    {/* Left Sticky Scrollytelling Index Rail (Desktop xl+) */}
                    <aside
                        aria-label={dict.title.pillars}
                        className="hidden xl:flex flex-col items-center justify-between sticky top-28 h-[460px] py-7 px-2.5 border border-border/60 bg-background/85 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] transform-gpu"
                    >
                        <motion.div
                            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-center justify-between h-full w-full"
                        >
                            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground/55 [writing-mode:vertical-lr] rotate-180 select-none">
                                INDEX
                            </span>

                        <div
                            className="relative flex flex-col items-center gap-4 my-auto"
                            role="tablist"
                            aria-label="Pillar navigation"
                        >
                            {/* Subtle continuous vertical scroll progress track */}
                            <div
                                aria-hidden="true"
                                className="absolute top-2 bottom-2 w-px bg-border/40 -z-10 overflow-hidden"
                            >
                                <motion.div
                                    style={{
                                        scaleY: scrollYProgress,
                                        originY: 0,
                                    }}
                                    className="w-full h-full bg-foreground/50 transform-gpu"
                                />
                            </div>

                            {pillars.map((pillar, idx) => {
                                const isActive = activeIndex === idx;
                                const isPassed = activeIndex > idx;
                                return (
                                    <button
                                        key={pillar.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-label={`${pillar.index} ${pillar.title}`}
                                        onClick={() => scrollToPillar(idx)}
                                        className="group relative flex flex-col items-center gap-1.5 py-2 px-2.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-ring rounded-xl bg-background/90 border border-transparent hover:border-border/60 transition-colors"
                                    >
                                        <span
                                            className={cn(
                                                "text-[10px] font-mono tracking-widest tabular-nums transition-colors duration-300",
                                                isActive
                                                    ? "text-foreground font-bold"
                                                    : isPassed
                                                      ? "text-foreground/60"
                                                      : "text-muted-foreground/45 group-hover:text-muted-foreground"
                                            )}
                                        >
                                            {pillar.index}
                                        </span>
                                        <span
                                            className={cn(
                                                "w-1.5 rounded-full transition-all duration-500 ease-out",
                                                isActive
                                                    ? "h-8 bg-foreground shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                                                    : isPassed
                                                      ? "h-2.5 bg-foreground/45"
                                                      : "h-1.5 bg-border group-hover:bg-foreground/40"
                                            )}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground/60 tabular-nums [writing-mode:vertical-lr] rotate-180 select-none">
                            0{activeIndex + 1}/0{pillars.length}
                        </span>
                        </motion.div>
                    </aside>

                    {/* Progressive Overlapping Sticky Scrollytelling Stack */}
                    <div className="relative flex flex-col">
                        {pillars.map((pillar, index) => {
                            const isLast = index === pillars.length - 1;
                            const isCanvasActive = activeIndex <= index;
                            return (
                                <React.Fragment key={pillar.id}>
                                    {/* Non-sticky scroll anchor so clicking index rail / card headers lands at exact card entry */}
                                    <div
                                        ref={(el) => {
                                            anchorRefs.current[index] = el;
                                        }}
                                        aria-hidden="true"
                                        className="h-px w-full -mt-px pointer-events-none"
                                    />

                                    <div
                                        style={{
                                            top: `calc(5rem + ${index * 44}px)`,
                                            zIndex: (index + 1) * 10,
                                        }}
                                        className="sticky mb-0"
                                    >
                                        <PillarStackCard
                                            pillar={pillar}
                                            index={index}
                                            total={pillars.length}
                                            isActive={activeIndex === index}
                                            isCanvasActive={isCanvasActive}
                                            scrollYProgress={scrollYProgress}
                                            reducedMotion={prefersReducedMotion}
                                            onHeaderClick={() =>
                                                scrollToPillar(index)
                                            }
                                        />
                                    </div>

                                    {/* Scrollytelling Travel Spacer */}
                                    <div
                                        aria-hidden="true"
                                        className={
                                            isLast
                                                ? "h-[16vh] sm:h-[20vh] pointer-events-none shrink-0"
                                                : "h-[36vh] sm:h-[42vh] lg:h-[46vh] pointer-events-none shrink-0"
                                        }
                                    />
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

interface PillarStackCardProps {
    pillar: PillarItem;
    index: number;
    total: number;
    isActive: boolean;
    isCanvasActive: boolean;
    scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
    reducedMotion: boolean;
    onHeaderClick: () => void;
}

function PillarStackCard({
    pillar,
    index,
    total,
    isActive,
    isCanvasActive,
    scrollYProgress,
    reducedMotion,
    onHeaderClick,
}: PillarStackCardProps) {
    const scale = useTransform(scrollYProgress, (p) => {
        return computePillarCardTransform(index, total, p, reducedMotion).scale;
    });

    const rawDimOpacity = useTransform(scrollYProgress, (p) => {
        return computePillarCardTransform(index, total, p, reducedMotion)
            .dimOpacity;
    });

    const primarySpecs = pillar.metrics.slice(0, 2);

    return (
        <motion.article
            style={{
                scale: reducedMotion ? 1 : scale,
                transformOrigin: "top center",
            }}
            className={cn(
                "group relative w-full rounded-[24px] sm:rounded-[30px] border bg-background/95 backdrop-blur-md overflow-hidden transition-colors duration-500 transform-gpu will-change-transform",
                "shadow-[0_-20px_54px_-16px_rgba(0,0,0,0.35)] dark:shadow-[0_-24px_68px_-16px_rgba(0,0,0,0.78)]",
                isActive
                    ? "border-border/80 hover:border-foreground/30"
                    : "border-border/50 hover:border-foreground/20"
            )}
        >
            {/* Top Specular Architectural Hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-foreground/30 to-transparent pointer-events-none z-30" />

            {/* Progressive Stack Depth Dimming Overlay when subsequent cards overlap */}
            <motion.div
                aria-hidden="true"
                style={{ opacity: reducedMotion ? 0 : rawDimOpacity }}
                className="absolute inset-0 bg-background pointer-events-none z-20 will-change-[opacity]"
            />

            {/* Top Architectural Header Strip (44px / h-11 — matches the 44px sticky step so each overlapped card leaves its header neatly exposed) */}
            <button
                type="button"
                onClick={onHeaderClick}
                className="w-full h-11 flex items-center justify-between px-5 sm:px-8 lg:px-12 border-b border-border/45 bg-secondary/[0.06] hover:bg-secondary/[0.14] transition-colors cursor-pointer text-left relative z-30"
            >
                <div className="flex items-center gap-3">
                    <span
                        className={cn(
                            "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                            isActive
                                ? "bg-[#dfc068] shadow-[0_0_8px_rgba(223,192,104,0.7)]"
                                : "bg-foreground/30"
                        )}
                    />
                    <span className="text-[10px] sm:text-xs font-mono tracking-[0.22em] uppercase text-foreground/90 font-medium">
                        {pillar.subsystem}
                    </span>
                    <span
                        aria-hidden="true"
                        className="text-border max-sm:hidden"
                    >
                        —
                    </span>
                    <span className="max-sm:hidden text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-muted-foreground/75">
                        {pillar.title}
                    </span>
                </div>

                <div className="flex items-center gap-2.5 text-[10px] sm:text-xs font-mono tracking-widest text-muted-foreground/70 uppercase tabular-nums">
                    <span className="max-md:hidden">{pillar.subtitle}</span>
                    <span aria-hidden="true" className="max-md:hidden">
                        ·
                    </span>
                    <span className="text-foreground/85 font-semibold">
                        [{pillar.index}]
                    </span>
                </div>
            </button>

            {/* Expansive, Airy 2-Column Architectural Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 p-6 sm:p-9 lg:p-12 xl:p-14 items-center">
                {/* Left Column: Spacious Architectural Typography & Minimalist Specs */}
                <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:col-span-5 flex flex-col justify-between gap-7 sm:gap-9 lg:gap-11 transform-gpu"
                >
                    <div className="flex flex-col gap-4 sm:gap-5">
                        <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-[0.22em] uppercase text-muted-foreground">
                            <span className="text-foreground font-semibold tabular-nums">
                                [{pillar.index}]
                            </span>
                            <span aria-hidden="true" className="text-border">
                                /
                            </span>
                            <span>{pillar.subtitle}</span>
                        </div>

                        <h3 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-black tracking-tighter uppercase leading-[0.94] text-foreground text-balance">
                            {pillar.title}
                        </h3>

                        <p className="text-sm sm:text-base lg:text-[17px] text-muted-foreground font-light leading-relaxed max-w-lg">
                            <RichText>{pillar.description}</RichText>
                        </p>
                    </div>

                    {/* Minimalist Unboxed Architectural Specifications */}
                    <div className="pt-6 sm:pt-7 border-t border-border/45 grid grid-cols-2 gap-6 sm:gap-8">
                        {primarySpecs.map((metric) => (
                            <div
                                key={metric.label}
                                className="flex flex-col gap-1.5"
                            >
                                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-muted-foreground/65">
                                    {metric.label}
                                </span>
                                <span className="text-xs sm:text-sm xl:text-base font-medium tracking-tight text-foreground tabular-nums leading-snug">
                                    {metric.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Column: Minimalist Self-Animating Dark-Glass Visual Canvas */}
                <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55, delay: 0.08 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:col-span-7 w-full transform-gpu"
                >
                    <PillarVisualCanvas
                        pillarId={pillar.id}
                        index={index}
                        isActive={isCanvasActive}
                    />
                </motion.div>
            </div>
        </motion.article>
    );
}
