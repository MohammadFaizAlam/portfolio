"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import {
    motion,
    useMotionValue,
    useSpring,
    useMotionTemplate,
    useReducedMotion,
} from "framer-motion";
import { useLanguage } from "@/providers/language-provider";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { AmbientGlow } from "@/components/effects/ambient-glow";
import type { StackItem } from "@/types/stack";
import { getStackItemDetails } from "@/lib/portfolio-enhancements";
import { cn } from "@/lib/utils";

export default function Stack() {
    const { content, dict } = useLanguage();
    const prefersReducedMotion = useReducedMotion() ?? false;
    const spotlightContainerRef = useRef<HTMLDivElement>(null);

    const categories = useMemo(
        () => [
            {
                id: "frontend",
                title: dict.frontendStack,
                items: (content.stack?.frontend as StackItem[]) || [],
            },
            {
                id: "backendData",
                title: dict.backendDataStack,
                items: (content.stack?.backendData as StackItem[]) || [],
            },
            {
                id: "tools",
                title: dict.toolsStack,
                items: (content.stack?.tools as StackItem[]) || [],
            },
        ],
        [content.stack, dict.frontendStack, dict.backendDataStack, dict.toolsStack]
    );

    const defaultItem: StackItem = categories[0]?.items[0] || {
        name: "React",
        icon: "/stack/react.svg",
    };

    const [activeItem, setActiveItem] = useState<StackItem>(defaultItem);
    const [activeCategoryTitle, setActiveCategoryTitle] = useState<string>(
        categories[0]?.title || ""
    );
    const [isPointerInside, setIsPointerInside] = useState(false);

    const rectRef = useRef<{ left: number; top: number } | null>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 300, damping: 35, mass: 0.4 });
    const smoothY = useSpring(mouseY, { stiffness: 300, damping: 35, mass: 0.4 });

    const spotlightBackground = useMotionTemplate`radial-gradient(520px circle at ${smoothX}px ${smoothY}px, var(--color-foreground) 0%, transparent 70%)`;

    const handlePointerEnter = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (prefersReducedMotion) return;
            const rect = e.currentTarget.getBoundingClientRect();
            rectRef.current = { left: rect.left, top: rect.top };
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
            setIsPointerInside(true);
        },
        [prefersReducedMotion, mouseX, mouseY]
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (prefersReducedMotion) return;
            if (!rectRef.current && spotlightContainerRef.current) {
                const rect = spotlightContainerRef.current.getBoundingClientRect();
                rectRef.current = { left: rect.left, top: rect.top };
            }
            if (rectRef.current) {
                mouseX.set(e.clientX - rectRef.current.left);
                mouseY.set(e.clientY - rectRef.current.top);
            }
        },
        [prefersReducedMotion, mouseX, mouseY]
    );

    const handlePointerLeave = useCallback(() => {
        rectRef.current = null;
        setIsPointerInside(false);
    }, []);

    const handleSelectTech = useCallback((item: StackItem, categoryTitle: string) => {
        setActiveItem(item);
        setActiveCategoryTitle(categoryTitle);
    }, []);

    const activeDetails = getStackItemDetails(activeItem);

    return (
        <section className="w-full bg-transparent text-foreground overflow-hidden relative container-void">
            <AmbientGlow variant="section-right" />

            <div className="h-full flex flex-col px-container container mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
                    <div className="flex flex-col gap-4">
                        <BlurReveal delay={0} yOffset={16}>
                            <span className="title-counter">[004]</span>
                        </BlurReveal>

                        <BlurReveal delay={0.07} yOffset={24}>
                            <h2 className="title">{dict.title.stack}</h2>
                        </BlurReveal>
                    </div>

                    <BlurReveal delay={0.14} yOffset={20}>
                        <p className="text-sm sm:text-base text-muted-foreground font-light max-w-md leading-relaxed">
                            {dict.stackIntro}
                        </p>
                    </BlurReveal>
                </div>

                {/* Single-Surface Interactive Technology Matrix (No Duplicate Floating HoverCard) */}
                <motion.div
                    ref={spotlightContainerRef}
                    initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                    onPointerEnter={handlePointerEnter}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={handlePointerLeave}
                    className="relative rounded-3xl border border-border/55 bg-background/78 backdrop-blur-md p-6 sm:p-10 lg:p-12 overflow-hidden transform-gpu"
                >
                    {/* Subtle Cursor-Following Radial Spotlight */}
                    {!prefersReducedMotion && (
                        <motion.div
                            aria-hidden="true"
                            style={{
                                background: spotlightBackground,
                                opacity: isPointerInside ? 0.04 : 0,
                            }}
                            className="max-xl:hidden pointer-events-none absolute inset-0 transition-opacity duration-500 z-0"
                        />
                    )}

                    <div className="relative z-10 flex flex-col gap-9 lg:gap-11">
                        {/* Persistent Authoritative Detail Inspector */}
                        <div
                            aria-live="polite"
                            className="pb-7 border-b border-border/50 min-h-[104px] flex items-center"
                        >
                            <motion.div
                                key={activeItem.name}
                                initial={prefersReducedMotion ? false : { opacity: 0.65, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start lg:items-center w-full"
                            >
                                <div className="lg:col-span-4 flex items-center gap-4">
                                    <div className="p-3 rounded-xl border border-border/60 bg-secondary/25 flex items-center justify-center shrink-0">
                                        <Image
                                            src={activeItem.icon}
                                            alt={activeItem.name}
                                            width={24}
                                            height={24}
                                            className="w-6 h-6 object-contain"
                                            unoptimized={activeItem.icon.endsWith(".svg")}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-mono tracking-[0.14em] uppercase text-muted-foreground">
                                            <span>{activeCategoryTitle}</span>
                                            <span aria-hidden="true">·</span>
                                            <span className="text-foreground/70">{activeDetails.proficiency}</span>
                                        </div>
                                        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground uppercase mt-1">
                                            {activeItem.name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <p className="text-sm text-foreground/85 font-light leading-relaxed">
                                        {activeDetails.usage}
                                    </p>
                                </div>

                                <div className="lg:col-span-3 lg:text-right flex flex-col gap-1">
                                    <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-muted-foreground/70">
                                        {dict.stackAppliedIn}
                                    </span>
                                    <span className="text-xs font-mono text-foreground/85 leading-snug">
                                        {activeDetails.appliedIn}
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Balanced 3-Category Matrix */}
                        <div className="flex flex-col gap-9">
                            {categories.map((category, catIndex) => {
                                const isCategoryActive = activeCategoryTitle === category.title;
                                return (
                                    <BlurReveal key={category.id} delay={catIndex * 0.05} yOffset={16}>
                                        <div className="border-b border-border/40 pb-8 last:border-b-0 last:pb-0">
                                            <div className="flex items-center gap-3 mb-5">
                                                <span className="text-[11px] font-mono tracking-widest text-muted-foreground/55 tabular-nums">
                                                    0{catIndex + 1}
                                                </span>
                                                <h3
                                                    className={cn(
                                                        "text-xs font-mono font-medium tracking-[0.2em] uppercase transition-colors duration-200",
                                                        isCategoryActive
                                                            ? "text-foreground"
                                                            : "text-muted-foreground"
                                                    )}
                                                >
                                                    {category.title}
                                                </h3>
                                                {isCategoryActive && (
                                                    <motion.span
                                                        layoutId="stack-active-category-line"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 360,
                                                            damping: 32,
                                                        }}
                                                        className="h-px w-8 bg-foreground/55"
                                                    />
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-3 sm:flex-wrap">
                                                {category.items.map((item: StackItem) => {
                                                    const isSelected = activeItem.name === item.name;
                                                    return (
                                                        <button
                                                            key={item.name}
                                                            type="button"
                                                            onMouseEnter={() =>
                                                                handleSelectTech(item, category.title)
                                                            }
                                                            onFocus={() =>
                                                                handleSelectTech(item, category.title)
                                                            }
                                                            onClick={() =>
                                                                handleSelectTech(item, category.title)
                                                            }
                                                            aria-pressed={isSelected}
                                                            className={cn(
                                                                "group relative flex items-center gap-2.5 sm:gap-3 h-11 sm:h-auto px-3 sm:py-2.5 sm:px-4 rounded-xl sm:shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-ring transition-colors duration-200 min-w-0",
                                                                isSelected
                                                                    ? "border border-transparent"
                                                                    : "border border-border/40 bg-foreground/[0.015] sm:border-transparent sm:bg-transparent"
                                                            )}
                                                        >
                                                            {isSelected && (
                                                                <motion.span
                                                                    layoutId="stack-item-spotlight-pill"
                                                                    transition={
                                                                        prefersReducedMotion
                                                                            ? { duration: 0 }
                                                                            : {
                                                                                  type: "spring",
                                                                                  stiffness: 400,
                                                                                  damping: 32,
                                                                              }
                                                                    }
                                                                    className="absolute inset-0 rounded-xl border border-foreground/25 bg-secondary/50 shadow-sm -z-0"
                                                                />
                                                            )}

                                                            <div
                                                                className={cn(
                                                                    "relative z-10 shrink-0 transition-all duration-200 ease-out",
                                                                    isSelected
                                                                        ? "opacity-100 grayscale-0 scale-105"
                                                                        : "opacity-65 grayscale group-hover:grayscale-0 group-hover:opacity-100"
                                                                )}
                                                            >
                                                                <Image
                                                                    src={item.icon}
                                                                    alt={item.name}
                                                                    width={20}
                                                                    height={20}
                                                                    className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                                                                    unoptimized={item.icon.endsWith(".svg")}
                                                                />
                                                            </div>

                                                            <span
                                                                className={cn(
                                                                    "relative z-10 text-xs sm:text-sm tracking-wide transition-colors duration-200 truncate sm:whitespace-nowrap",
                                                                    isSelected
                                                                        ? "text-foreground font-medium"
                                                                        : "text-muted-foreground group-hover:text-foreground"
                                                                )}
                                                            >
                                                                {item.name}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </BlurReveal>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
