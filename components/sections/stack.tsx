"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
    motion,
    useMotionValue,
    useSpring,
    useMotionTemplate,
    useReducedMotion,
    AnimatePresence,
} from "framer-motion";
import { useLanguage } from "@/providers/language-provider";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { AmbientGlow } from "@/components/effects/ambient-glow";
import { FluidShaderBackground } from "@/components/effects/fluid-shader-bg";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { StackItem } from "@/types/stack";
import { getStackItemDetails } from "@/lib/portfolio-enhancements";
import { cn } from "@/lib/utils";

export default function Stack() {
    const { content, dict, language } = useLanguage();
    const prefersReducedMotion = useReducedMotion() ?? false;
    const spotlightContainerRef = useRef<HTMLDivElement>(null);

    const categories = [
        {
            id: "frontend",
            title: dict.frontendStack,
            items: content.stack?.frontend || [],
        },
        {
            id: "backend",
            title: dict.backendStack,
            items: content.stack?.backend || [],
        },
        {
            id: "database",
            title: dict.databaseStack,
            items: content.stack?.database || [],
        },
        {
            id: "tools",
            title: dict.toolsStack,
            items: content.stack?.tools || [],
        },
    ];

    const defaultItem: StackItem = categories[0]?.items[0] || {
        name: "React",
        icon: "/stack/react.svg",
    };

    const [activeItem, setActiveItem] = useState<StackItem>(defaultItem);
    const [activeCategoryTitle, setActiveCategoryTitle] = useState<string>(
        categories[0]?.title || ""
    );
    const [isPointerInside, setIsPointerInside] = useState(false);

    // Subtle cursor-following spotlight coordinates
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

    const activeDetails = getStackItemDetails(activeItem, language);

    return (
        <section className="w-full bg-background text-foreground overflow-hidden relative py-16 md:py-24 lg:py-32 xl:py-40 2xl:py-36">
            <AmbientGlow variant="section-right" />
            <FluidShaderBackground variant="stack" />

            <div className="h-full flex flex-col px-container container mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
                    <div className="flex flex-col gap-4">
                        <BlurReveal>
                            <span className="title-counter">[003]</span>
                        </BlurReveal>

                        <BlurReveal>
                            <h2 className="title">{dict.title.stack}</h2>
                        </BlurReveal>
                    </div>

                    <BlurReveal>
                        <p className="text-sm sm:text-base text-muted-foreground font-light max-w-md">
                            {dict.stackIntro}
                        </p>
                    </BlurReveal>
                </div>

                {/* Interactive Category Spotlight Surface */}
                <div
                    ref={spotlightContainerRef}
                    onPointerEnter={handlePointerEnter}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={handlePointerLeave}
                    className="relative rounded-3xl border border-border/50 bg-secondary/[0.03] backdrop-blur-sm p-6 sm:p-10 lg:p-12 overflow-hidden"
                >
                    {/* Subtle Cursor-Following Radial Spotlight */}
                    {!prefersReducedMotion && (
                        <motion.div
                            aria-hidden="true"
                            style={{
                                background: spotlightBackground,
                                opacity: isPointerInside ? 0.035 : 0,
                            }}
                            className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-0"
                        />
                    )}

                    <div className="relative z-10 flex flex-col gap-8 lg:gap-10">
                        {/* Persistent Interactive Detail Inspector (Top of spotlight container for immediate visibility) */}
                        <div
                            aria-live="polite"
                            className="pb-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeItem.name}
                                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full justify-between"
                                >
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="p-3 rounded-xl border border-border/50 bg-secondary/30 flex items-center justify-center">
                                            <Image
                                                src={activeItem.icon}
                                                alt={activeItem.name}
                                                width={24}
                                                height={24}
                                                className="w-6 h-6 object-contain"
                                                unoptimized={activeItem.icon.endsWith(".svg")}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                                                <span>{dict.stackActiveSelection}</span>
                                                <span aria-hidden="true">·</span>
                                                <span>{activeCategoryTitle}</span>
                                            </div>
                                            <div className="flex items-baseline gap-3 mt-0.5">
                                                <h4 className="text-lg font-bold tracking-tight text-foreground uppercase">
                                                    {activeItem.name}
                                                </h4>
                                                <span className="text-xs font-mono text-foreground/70">
                                                    / {activeDetails.proficiency}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">
                                        {activeDetails.usage}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        {categories.map((category, catIndex) => {
                            const isCategoryActive = activeCategoryTitle === category.title;
                            return (
                                <BlurReveal key={category.id}>
                                    <div className="border-b border-border/40 pb-8 last:border-b-0 last:pb-0">
                                        <div className="flex items-center gap-3 mb-5">
                                            <span className="text-[10px] font-mono tracking-widest text-muted-foreground/50 tabular-nums">
                                                0{catIndex + 1}
                                            </span>
                                            <h3
                                                className={cn(
                                                    "text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300",
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
                                                    className="h-px w-8 bg-foreground/50"
                                                />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                                            {category.items.map((item: StackItem) => {
                                                const isSelected = activeItem.name === item.name;
                                                const itemDetails = getStackItemDetails(item, language);

                                                return (
                                                    <HoverCard
                                                        key={item.name}
                                                        openDelay={40}
                                                        closeDelay={60}
                                                    >
                                                        <HoverCardTrigger asChild>
                                                            <button
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
                                                                className="group relative flex items-center gap-3 py-2.5 px-4 rounded-xl shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-ring transition-colors duration-300"
                                                            >
                                                                {isSelected && (
                                                                    <motion.span
                                                                        layoutId="stack-item-spotlight-pill"
                                                                        transition={
                                                                            prefersReducedMotion
                                                                                ? { duration: 0 }
                                                                                : {
                                                                                      type: "spring",
                                                                                      stiffness: 380,
                                                                                      damping: 30,
                                                                                  }
                                                                        }
                                                                        className="absolute inset-0 rounded-xl border border-foreground/20 bg-secondary/60 dark:bg-secondary/40 shadow-sm -z-0"
                                                                    />
                                                                )}

                                                                <div
                                                                    className={cn(
                                                                        "relative z-10 transition-all duration-300 ease-out",
                                                                        isSelected
                                                                            ? "opacity-100 grayscale-0 scale-105"
                                                                            : "opacity-55 grayscale group-hover:grayscale-0 group-hover:opacity-100"
                                                                    )}
                                                                >
                                                                    <Image
                                                                        src={item.icon}
                                                                        alt={item.name}
                                                                        width={20}
                                                                        height={20}
                                                                        className="w-5 h-5 object-contain"
                                                                        unoptimized={item.icon.endsWith(".svg")}
                                                                    />
                                                                </div>

                                                                <span
                                                                    className={cn(
                                                                        "relative z-10 text-sm tracking-wide transition-colors duration-300 whitespace-nowrap",
                                                                        isSelected
                                                                            ? "text-foreground font-medium"
                                                                            : "text-muted-foreground group-hover:text-foreground"
                                                                    )}
                                                                >
                                                                    {item.name}
                                                                </span>
                                                            </button>
                                                        </HoverCardTrigger>

                                                        <HoverCardContent
                                                            side="top"
                                                            align="center"
                                                            className="w-80 p-5 flex flex-col gap-4 bg-background/95 backdrop-blur-xl border border-border/60 shadow-2xl rounded-2xl overflow-hidden"
                                                        >
                                                            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
                                                            <div className="absolute inset-0 bg-linear-to-tr from-foreground/[0.03] to-transparent pointer-events-none" />

                                                            <div className="flex items-center gap-3.5 z-10">
                                                                <div className="relative p-2.5 rounded-xl bg-secondary/50 ring-1 ring-border/50 shrink-0">
                                                                    <Image
                                                                        src={item.icon}
                                                                        alt={item.name}
                                                                        width={28}
                                                                        height={28}
                                                                        className="w-7 h-7 object-contain"
                                                                        unoptimized={item.icon.endsWith(".svg")}
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="text-sm font-bold tracking-[0.12em] uppercase text-foreground truncate">
                                                                        {item.name}
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono truncate">
                                                                        {category.title} · {itemDetails.proficiency}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="pt-3 border-t border-border/40 z-10 space-y-1.5">
                                                                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
                                                                    {dict.stackPracticalUsage}
                                                                </span>
                                                                <p className="text-xs text-foreground/85 leading-relaxed font-light">
                                                                    {itemDetails.usage}
                                                                </p>
                                                            </div>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </BlurReveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
