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
    const pillars: PillarItem[] = (content.pillars as PillarItem[]) || [];
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

            const stickyOffset = -(84 + index * 44);
            if (lenis && !prefersReducedMotion) {
                lenis.scrollTo(targetEl, {
                    offset: stickyOffset,
                    duration: 0.9,
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
            className="w-full container-void bg-transparent text-foreground relative"
        >
            <AmbientGlow variant="dual" />

            <div className="container mx-auto px-container relative z-10">
                {/* Clean, Spacious Section Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-14 sm:mb-18 lg:mb-20">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <BlurReveal delay={0} yOffset={16}>
                            <span className="title-counter">[003]</span>
                        </BlurReveal>
                        <BlurReveal delay={0.07} yOffset={24}>
                            <h2 className="title">{dict.title.pillars}</h2>
                        </BlurReveal>
                    </div>

                    <div className="lg:max-w-md">
                        <BlurReveal delay={0.14} yOffset={18}>
                            <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                                <RichText>{dict.pillarsIntro}</RichText>
                            </p>
                        </BlurReveal>
                    </div>
                </div>

                {/* Architectural Matrix Shell with Precision Vertical Index Gauge */}
                <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] gap-6 xl:gap-12 items-start">
                    {/* Frameless Precision Vertical Index Gauge (Desktop xl+) */}
                    <aside
                        aria-label={dict.title.pillars}
                        className="hidden xl:flex flex-col justify-between sticky top-32 h-[380px] pl-1 select-none"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.22em] uppercase text-muted-foreground/60 tabular-nums">
                            <span className="text-foreground font-semibold">
                                0{activeIndex + 1}
                            </span>
                            <span className="text-border">/</span>
                            <span>0{pillars.length}</span>
                        </div>

                        <div
                            className="relative flex flex-col justify-between py-2 my-6 flex-1"
                            role="tablist"
                            aria-label="Pillar navigation"
                        >
                            {/* Precision Hairline Track */}
                            <div
                                aria-hidden="true"
                                className="absolute left-[3px] top-0 bottom-0 w-px bg-foreground/12 overflow-hidden"
                            >
                                <motion.div
                                    style={{
                                        scaleY: prefersReducedMotion ? 1 : scrollYProgress,
                                        originY: 0,
                                    }}
                                    className="w-full h-full bg-foreground/85 transform-gpu"
                                />
                            </div>

                            {pillars.map((pillar, idx) => {
                                const isActive = activeIndex === idx;
                                const isPassed = activeIndex > idx;
                                const shortLabel =
                                    pillar.subsystem.split("/")[1]?.trim() || pillar.index;

                                return (
                                    <button
                                        key={pillar.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-label={`Scroll to ${pillar.index} ${pillar.title}`}
                                        onClick={() => scrollToPillar(idx)}
                                        className="group relative flex items-center gap-3.5 py-2 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring rounded-sm"
                                    >
                                        <span className="relative flex items-center">
                                            <span
                                                className={cn(
                                                    "block rounded-full transition-all duration-300",
                                                    isActive
                                                        ? "w-[7px] h-[7px] bg-foreground shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                                                        : isPassed
                                                          ? "w-[5px] h-[5px] ml-px bg-foreground/55"
                                                          : "w-[5px] h-[5px] ml-px bg-foreground/25 group-hover:bg-foreground/60"
                                                )}
                                            />
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    "ml-2 h-px transition-all duration-300 ease-out",
                                                    isActive
                                                        ? "w-5 bg-foreground"
                                                        : "w-2 bg-foreground/20 group-hover:w-3.5 group-hover:bg-foreground/50"
                                                )}
                                            />
                                        </span>

                                        <span className="flex flex-col">
                                            <span
                                                className={cn(
                                                    "text-[10px] font-mono tracking-[0.2em] uppercase tabular-nums transition-colors duration-200",
                                                    isActive
                                                        ? "text-foreground font-semibold"
                                                        : "text-muted-foreground/55 group-hover:text-muted-foreground"
                                                )}
                                            >
                                                {pillar.index}
                                            </span>
                                            <span
                                                className={cn(
                                                    "text-[11px] font-mono tracking-[0.14em] uppercase transition-colors duration-200",
                                                    isActive
                                                        ? "text-foreground/90"
                                                        : "text-muted-foreground/45 group-hover:text-foreground/75"
                                                )}
                                            >
                                                {shortLabel}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="h-px w-8 bg-foreground/15" aria-hidden="true" />
                    </aside>

                    {/* Progressive Overlapping Sticky Scrollytelling Stack */}
                    <div className="relative flex flex-col">
                        {pillars.map((pillar, index) => {
                            const isLast = index === pillars.length - 1;
                            const isCanvasActive = activeIndex <= index;
                            return (
                                <React.Fragment key={pillar.id}>
                                    <div
                                        ref={(el) => {
                                            anchorRefs.current[index] = el;
                                        }}
                                        aria-hidden="true"
                                        className="h-px w-full -mt-px pointer-events-none"
                                    />

                                    <div
                                        style={{
                                            top: `calc(5.25rem + ${index * 44}px)`,
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
                                            onHeaderClick={() => scrollToPillar(index)}
                                        />
                                    </div>

                                    {/* Snappy Scrollytelling Travel Spacer */}
                                    <div
                                        aria-hidden="true"
                                        className={
                                            isLast
                                                ? "h-[8vh] sm:h-[10vh] pointer-events-none shrink-0"
                                                : "h-[20vh] sm:h-[24vh] lg:h-[28vh] pointer-events-none shrink-0"
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
        return computePillarCardTransform(index, total, p, reducedMotion).dimOpacity;
    });

    const displayMetrics = pillar.metrics.slice(0, 4);

    return (
        <motion.article
            style={{
                scale: reducedMotion ? 1 : scale,
                transformOrigin: "top center",
            }}
            className={cn(
                // Opaque rich obsidian surface (zero sticky backdrop-blur jank over live WebGL)
                "group relative w-full rounded-[22px] sm:rounded-[26px] border bg-[#0b0b0a] overflow-hidden transition-colors duration-300 transform-gpu will-change-transform",
                "shadow-[0_-20px_54px_-16px_rgba(0,0,0,0.65)]",
                isActive
                    ? "border-foreground/18 hover:border-foreground/28"
                    : "border-foreground/10 hover:border-foreground/20"
            )}
        >
            {/* Subtle Surface Atmospheric Sheen */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_80%_0%,rgba(223,192,104,0.045)_0%,transparent_65%)]"
            />

            {/* Top Specular Architectural Hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-foreground/30 to-transparent pointer-events-none z-30" />

            {/* Progressive Stack Depth Dimming Overlay */}
            <motion.div
                aria-hidden="true"
                style={{ opacity: reducedMotion ? 0 : rawDimOpacity }}
                className="absolute inset-0 bg-[#070706] pointer-events-none z-20 will-change-[opacity]"
            />

            {/* Clean Top Architectural Header Strip (44px / h-11 — matches sticky offset) */}
            <button
                type="button"
                onClick={onHeaderClick}
                className="w-full h-11 flex items-center justify-between px-5 sm:px-8 lg:px-10 border-b border-foreground/[0.08] bg-white/[0.02] hover:bg-white/[0.045] transition-colors cursor-pointer text-left relative z-30 focus-visible:outline-2 focus-visible:outline-ring"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase text-foreground/90 font-medium whitespace-nowrap">
                        {pillar.subsystem}
                    </span>
                    <span aria-hidden="true" className="text-foreground/20 max-sm:hidden">
                        —
                    </span>
                    <span className="max-sm:hidden text-[10px] sm:text-xs font-mono tracking-[0.16em] uppercase text-muted-foreground/75 truncate">
                        {pillar.title}
                    </span>
                </div>

                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-foreground/85 font-semibold uppercase tabular-nums shrink-0">
                    [{pillar.index}]
                </span>
            </button>

            {/* Asymmetric 5/7 Architectural Instrument Layout */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-9 lg:gap-10 p-5 sm:p-8 lg:p-10 xl:p-11 items-stretch">
                {/* Left 5 Columns: Crisp Editorial Narrative + Hairline-Ruled Spec Table */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-7 sm:gap-9">
                    <div className="flex flex-col gap-3.5 pt-1">
                        <h3 className="font-display text-2xl sm:text-3xl xl:text-[2.35rem] font-bold tracking-tight uppercase leading-[1.0] text-foreground text-balance">
                            {pillar.title}
                        </h3>

                        <p className="text-sm sm:text-[15px] text-muted-foreground font-light leading-relaxed">
                            <RichText>{pillar.description}</RichText>
                        </p>
                    </div>

                    {/* Hairline-Divided Architectural Spec Ledger */}
                    <dl className="border-t border-foreground/10 grid grid-cols-2">
                        {displayMetrics.map((metric, mIdx) => (
                            <div
                                key={metric.label}
                                className={cn(
                                    "flex flex-col gap-1 py-4",
                                    mIdx % 2 === 0 ? "pr-4" : "pl-4 border-l border-foreground/10",
                                    mIdx >= 2 && "border-t border-foreground/10 pb-1"
                                )}
                            >
                                <dt className="text-[9px] sm:text-[10px] font-mono tracking-[0.18em] uppercase text-muted-foreground/65">
                                    {metric.label}
                                </dt>
                                <dd className="text-xs sm:text-[13px] font-medium tracking-tight text-foreground/95 tabular-nums leading-snug">
                                    {metric.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Right 7 Columns: Expansive Zero-Lag Instrument Visualization Stage */}
                <div className="lg:col-span-7 flex items-center w-full transform-gpu">
                    <PillarVisualCanvas
                        pillarId={pillar.id}
                        index={index}
                        isActive={isCanvasActive}
                    />
                </div>
            </div>
        </motion.article>
    );
}
