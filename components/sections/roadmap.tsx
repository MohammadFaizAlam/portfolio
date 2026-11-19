"use client";

import { useRef, useState, useLayoutEffect, useEffect, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { AmbientGlow } from "@/components/effects/ambient-glow";
import { useLanguage } from "@/providers/language-provider";
import type { RoadmapItem } from "@/types/roadmap";

interface SpineGeometry {
    top: number;
    height: number;
    nodeRatios: number[];
}

export default function Roadmap() {
    const timelineRef = useRef<HTMLDivElement>(null);
    const spineBoundsRef = useRef<HTMLDivElement>(null);
    const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { content, dict } = useLanguage();
    const prefersReducedMotion = useReducedMotion() ?? false;
    const roadmapItems: RoadmapItem[] = (content.roadmap as RoadmapItem[]) || [];

    const [spine, setSpine] = useState<SpineGeometry>({
        top: 28,
        height: 0,
        nodeRatios: [],
    });
    const [reachedCount, setReachedCount] = useState(0);

    const measureSpine = useCallback(() => {
        const wrapper = timelineRef.current;
        if (!wrapper) return;
        const dots = dotRefs.current.filter((d): d is HTMLDivElement => d !== null);
        if (dots.length < 2) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const centers = dots.map((dot) => {
            const rect = dot.getBoundingClientRect();
            return rect.top + rect.height / 2 - wrapperRect.top;
        });

        const firstY = centers[0];
        const lastY = centers[centers.length - 1];
        const span = Math.max(1, lastY - firstY);
        const ratios = centers.map((y) => Math.max(0, Math.min(1, (y - firstY) / span)));

        setSpine((prev) => {
            if (
                Math.abs(prev.top - firstY) < 0.5 &&
                Math.abs(prev.height - span) < 0.5 &&
                prev.nodeRatios.length === ratios.length
            ) {
                return prev;
            }
            return { top: firstY, height: span, nodeRatios: ratios };
        });
    }, []);

    useLayoutEffect(() => {
        measureSpine();
    }, [measureSpine, roadmapItems.length]);

    useEffect(() => {
        const wrapper = timelineRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver(() => {
            requestAnimationFrame(measureSpine);
        });
        observer.observe(wrapper);

        window.addEventListener("resize", measureSpine, { passive: true });
        const rafId = requestAnimationFrame(measureSpine);

        return () => {
            cancelAnimationFrame(rafId);
            observer.disconnect();
            window.removeEventListener("resize", measureSpine);
        };
    }, [measureSpine]);

    // Track scroll strictly across the exact [firstDotCenter -> lastDotCenter] bounds
    // so the illuminated progress line stays 1:1 locked to the viewport reading line on every device.
    const { scrollYProgress } = useScroll({
        target: spineBoundsRef,
        offset: ["start 58%", "end 58%"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (!spine.nodeRatios.length) return;
        let count = 0;
        for (let i = 0; i < spine.nodeRatios.length; i++) {
            if (latest >= spine.nodeRatios[i] - 0.015) {
                count = i + 1;
            }
        }
        setReachedCount((prev) => (prev === count ? prev : count));
    });

    return (
        <section className="relative container-void bg-transparent overflow-x-clip">
            <AmbientGlow variant="dual" />

            <div className="container mx-auto px-container max-w-6xl relative z-10">
                {/* Editorial Centered Header */}
                <div className="flex flex-col lg:items-center mb-16 sm:mb-22 lg:mb-28 gap-4 lg:text-center">
                    <BlurReveal delay={0} yOffset={16}>
                        <span className="title-counter">[005]</span>
                    </BlurReveal>

                    <BlurReveal delay={0.07} yOffset={22}>
                        <h2 className="title">{dict.title.roadmap}</h2>
                    </BlurReveal>

                    <BlurReveal delay={0.14} yOffset={18}>
                        <p className="text-base sm:text-lg mt-1 max-w-xl font-light leading-relaxed text-muted-foreground">
                            {dict.roadmapDescription}
                        </p>
                    </BlurReveal>
                </div>

                {/* Precision Scroll-Synced Editorial Timeline */}
                <div ref={timelineRef} className="relative">
                    {/* Exact First-Dot-to-Last-Dot Spine Track & Scroll Measurement Target */}
                    <div
                        ref={spineBoundsRef}
                        data-testid="roadmap-spine-bounds"
                        aria-hidden="true"
                        style={
                            spine.height > 0
                                ? { top: `${spine.top}px`, height: `${spine.height}px` }
                                : { top: "28px", bottom: "28px" }
                        }
                        className="absolute left-3.5 lg:left-1/2 w-px -translate-x-1/2 pointer-events-none"
                    >
                        {/* Base hairline track */}
                        <div className="absolute inset-0 bg-foreground/14" />

                        {/* Scroll-locked luminous progression spine (1:1 synced across all viewports) */}
                        <motion.div
                            data-testid="roadmap-spine-progress"
                            style={{
                                scaleY: prefersReducedMotion ? 1 : scrollYProgress,
                                originY: 0,
                            }}
                            className="absolute inset-0 bg-linear-to-b from-foreground/75 via-foreground to-foreground z-10 transform-gpu will-change-transform"
                        />
                    </div>

                    <ol className="flex flex-col w-full gap-10 sm:gap-12 lg:gap-18 relative z-20">
                        {roadmapItems.map((item: RoadmapItem, index: number) => {
                            const isReached = prefersReducedMotion || index < reachedCount;
                            return (
                                <TimelineNode
                                    key={item.id}
                                    item={item}
                                    isEven={index % 2 === 0}
                                    isReached={isReached}
                                    dotRef={(el) => {
                                        dotRefs.current[index] = el;
                                    }}
                                />
                            );
                        })}
                    </ol>
                </div>
            </div>
        </section>
    );
}

function TimelineNode({
    item,
    isEven,
    isReached,
    dotRef,
}: {
    item: RoadmapItem;
    isEven: boolean;
    isReached: boolean;
    dotRef: (el: HTMLDivElement | null) => void;
}) {
    return (
        <li
            className={cn(
                "relative flex items-start justify-between w-full",
                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
            )}
        >
            {/* Opposite Desktop Column — Sculptural Year & Desktop-Only Subtitle aligned to top baseline */}
            <div className="w-[calc(50%-3rem)] hidden lg:flex items-start pt-4">
                <div
                    className={cn(
                        "w-full flex flex-col gap-2",
                        isEven ? "items-end text-right pr-4" : "items-start text-left pl-4"
                    )}
                >
                    <span
                        className={cn(
                            "font-display text-4xl xl:text-5xl font-extrabold tracking-tight uppercase tabular-nums leading-none transition-colors duration-300",
                            isReached ? "text-foreground" : "text-foreground/45"
                        )}
                    >
                        {item.year}
                    </span>
                    <span className="hidden lg:block text-[11px] font-mono tracking-[0.18em] uppercase text-muted-foreground/70">
                        {item.subtitle}
                    </span>
                </div>
            </div>

            {/* Precision Spine Node Marker — mathematically aligned on the exact spine centerline */}
            <div
                ref={dotRef}
                data-testid={`roadmap-dot-${item.id}`}
                data-reached={isReached ? "true" : "false"}
                className={cn(
                    "absolute left-3.5 lg:left-1/2 top-7 lg:top-8 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background z-20 flex items-center justify-center transition-all duration-300 transform-gpu",
                    item.current
                        ? "w-4 h-4"
                        : "w-3.5 h-3.5",
                    isReached
                        ? "border-foreground shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                        : "border-foreground/30"
                )}
            >
                <span
                    className={cn(
                        "rounded-full transition-all duration-300",
                        item.current ? "w-1.5 h-1.5" : "w-1.5 h-1.5",
                        isReached ? "bg-foreground scale-100" : "bg-foreground/35 scale-75"
                    )}
                />
            </div>

            {/* Architectural Editorial Monograph Entry */}
            <div className="w-full lg:w-[calc(50%-3rem)] pl-10 sm:pl-12 lg:pl-0 relative group">
                <BlurReveal yOffset={14} duration={0.48}>
                    <article
                        className={cn(
                            "relative border-t bg-background/54 px-5 py-6 sm:px-7 sm:py-7 transition-colors duration-300",
                            isReached
                                ? "border-foreground/50 bg-background/68"
                                : "border-foreground/16 hover:border-foreground/35 hover:bg-background/64"
                        )}
                    >
                        {/* Mobile/Tablet Year Only (Subtitle strictly desktop-only) */}
                        <div className="flex items-baseline justify-between gap-3 mb-3.5">
                            <div className="flex items-baseline gap-3">
                                <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground uppercase tabular-nums lg:hidden">
                                    {item.year}
                                </span>
                                <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-muted-foreground/65 tabular-nums">
                                    {item.id}
                                </span>
                            </div>

                            {item.current && (
                                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground/85">
                                    Current
                                </span>
                            )}
                        </div>

                        {/* Milestone Title */}
                        <h3 className="font-display text-lg sm:text-xl lg:text-[1.45rem] font-bold tracking-tight text-foreground leading-snug text-balance">
                            {item.title}
                        </h3>

                        {/* Concise Narrative Copy */}
                        <p className="text-muted-foreground text-sm sm:text-[15px] leading-relaxed font-light mt-2.5">
                            {item.description}
                        </p>

                        {/* Quiet Unboxed Editorial Metadata Footer */}
                        {item.stack && item.stack.length > 0 && (
                            <div className="mt-5 pt-4 border-t border-foreground/10 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] sm:text-[11px] font-mono tracking-[0.14em] uppercase text-muted-foreground/75">
                                {item.stack.map((tag, tagIdx) => (
                                    <span key={tag} className="inline-flex items-center gap-2.5">
                                        {tagIdx > 0 && (
                                            <span aria-hidden="true" className="text-foreground/25">
                                                /
                                            </span>
                                        )}
                                        <span>{tag}</span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </article>
                </BlurReveal>
            </div>
        </li>
    );
}