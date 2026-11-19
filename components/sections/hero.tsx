"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useScroll, useTransform, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/providers/language-provider";
import { ArrowRight, ArrowDown } from "lucide-react";
import { ContactModal } from "@/components/modals/contact-modal";
import { RichText } from "@/lib/markdown";

const TRACK_1 = [
    "/hero-slider/img-1.jpg",
    "/hero-slider/succession-1.jpg",
    "/hero-slider/faiz-1.jpeg",
    "/hero-slider/img-2.jpg",
    "/hero-slider/succession-2.jpg",
    "/hero-slider/faiz-2.jpg",
] as const;

const TRACK_2 = [
    "/hero-slider/faiz-2.jpg",
    "/hero-slider/succession-2.jpg",
    "/hero-slider/img-2.jpg",
    "/hero-slider/faiz-1.jpeg",
    "/hero-slider/succession-1.jpg",
    "/hero-slider/img-1.jpg",
] as const;

const COL_1_IMAGES = [...TRACK_1, ...TRACK_1];
const COL_2_IMAGES = [...TRACK_2, ...TRACK_2];

export default function Hero() {
    const { content, dict } = useLanguage();
    const prefersReducedMotion = useReducedMotion() ?? false;
    const containerRef = useRef<HTMLElement>(null);
    const [contactOpen, setContactOpen] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0.12]);
    const contentY = useTransform(scrollYProgress, [0, 0.85], [0, -64]);
    const tracksOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

    const scrollToProjects = useCallback(() => {
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        }
    }, [prefersReducedMotion]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen w-full flex flex-col justify-end bg-transparent px-container md:px-16 pt-28 pb-12 sm:pt-32 sm:pb-16 2xl:pb-24 overflow-hidden"
            id="home"
        >
            {/* Atmospheric dual vertical portrait strips */}
            <motion.div
                style={prefersReducedMotion ? undefined : { opacity: tracksOpacity }}
                className="absolute top-0 right-4 sm:right-10 md:right-14 lg:right-20 xl:right-28 2xl:right-40 bottom-0 h-full w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[420px] 2xl:w-[460px] flex gap-3 sm:gap-4 px-2 overflow-hidden z-10 pointer-events-none select-none opacity-[0.26] dark:opacity-[0.34] mix-blend-luminosity mask-[radial-gradient(96%_86%_at_55%_50%,black_30%,transparent_100%)] transform-gpu"
            >
                <div className="max-md:hidden flex-1 h-full overflow-hidden relative">
                    <motion.div
                        animate={prefersReducedMotion ? undefined : { y: ["0%", "-50%"] }}
                        transition={{
                            ease: "linear",
                            duration: 34,
                            repeat: Infinity,
                        }}
                        className="flex flex-col gap-3 sm:gap-4 pt-4 transform-gpu will-change-transform"
                    >
                        {COL_1_IMAGES.map((src, idx) => (
                            <div
                                key={idx}
                                className="w-full aspect-3/4 relative overflow-hidden rounded-3xl border border-foreground/10"
                            >
                                <Image
                                    src={src}
                                    alt="Mohammed Faiz Alam editorial portrait"
                                    fill
                                    sizes="(max-width: 767px) 0px, (max-width: 1023px) 154px, (max-width: 1279px) 184px, 224px"
                                    loading={idx < 4 ? "eager" : "lazy"}
                                    decoding="async"
                                    referrerPolicy="no-referrer"
                                    className="object-cover object-center grayscale contrast-[1.08] brightness-[0.82]"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="max-md:opacity-45 flex-1 h-full overflow-hidden relative">
                    <motion.div
                        animate={prefersReducedMotion ? undefined : { y: ["-50%", "0%"] }}
                        transition={{
                            ease: "linear",
                            duration: 34,
                            repeat: Infinity,
                        }}
                        className="flex flex-col gap-3 sm:gap-4 pt-4 transform-gpu will-change-transform"
                    >
                        {COL_2_IMAGES.map((src, idx) => (
                            <div
                                key={idx}
                                className="w-full aspect-3/4 relative overflow-hidden rounded-3xl border border-foreground/10"
                            >
                                <Image
                                    src={src}
                                    alt="Mohammed Faiz Alam editorial portrait"
                                    fill
                                    sizes="(max-width: 639px) 192px, (max-width: 1023px) 154px, 224px"
                                    loading={idx < 4 ? "eager" : "lazy"}
                                    decoding="async"
                                    referrerPolicy="no-referrer"
                                    className="object-cover object-center grayscale contrast-[1.08] brightness-[0.82]"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* Foreground editorial typographic stage */}
            <motion.div
                style={prefersReducedMotion ? undefined : { opacity: contentOpacity, y: contentY }}
                className="relative z-20 flex-1 flex flex-col gap-6 sm:gap-7 justify-end w-full max-w-4xl transform-gpu"
            >
                {/* Sculpted Syne Display Name */}
                <div className="mt-auto overflow-hidden">
                    <motion.h1
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
                        className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] 2xl:text-[98px] font-extrabold tracking-tight leading-[0.9] text-foreground uppercase transform-gpu"
                    >
                        Mohmd.
                        <br />
                        <span className="text-foreground/78">Faiz</span>
                    </motion.h1>
                </div>

                {/* Focused Positioning Copy + Proportionate CTA Pair */}
                <div className="space-y-6 sm:space-y-7">
                    <motion.p
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.58, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-lg transform-gpu"
                    >
                        <RichText>{content.hero.headline}</RichText>
                    </motion.p>

                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.52, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-wrap items-center gap-3 sm:gap-4 transform-gpu"
                    >
                        <button
                            type="button"
                            onClick={() => setContactOpen(true)}
                            className="w-fit group relative flex h-11 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-foreground/25 bg-foreground px-6 text-background transition-all duration-300 ease-out hover:bg-background hover:border-foreground/45 hover:text-foreground shadow-xl hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                            <div className="absolute inset-0 flex h-full w-full justify-center -translate-x-full -skew-x-12 group-hover:duration-700 group-hover:translate-x-full">
                                <div className="relative h-full w-8 bg-background/20 dark:bg-foreground/10" />
                            </div>
                            <span className="relative z-10 flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase">
                                {dict.contactMe}
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={scrollToProjects}
                            className="w-fit group relative flex h-11 cursor-pointer items-center justify-center px-5 text-muted-foreground transition-colors duration-200 hover:text-foreground rounded-full border border-border/60 hover:border-foreground/30 bg-background/30 backdrop-blur-sm whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                            <span className="relative z-10 text-[11px] sm:text-xs font-medium tracking-[0.14em] uppercase flex items-center gap-2">
                                {dict.exploreProjects}
                                <ArrowDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all" />
                            </span>
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
        </section>
    );
}
