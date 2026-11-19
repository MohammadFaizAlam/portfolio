"use client";

import { useState, useCallback } from "react";
import { ArrowUpRight, Calendar, Check, Copy } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { AmbientGlow } from "@/components/effects/ambient-glow";
import { sanitizePhone } from "@/lib/utils";
import { ShineButton } from "@/components/ui/shine-button";

export default function Contact() {
    const { content, dict } = useLanguage();
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(content.contact.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        } catch {
            // Fallback for restricted clipboard permissions
            const input = document.createElement("input");
            input.value = content.contact.email;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        }
    }, [content.contact.email]);

    return (
        <section className="relative pt-24 md:pt-32 xl:pt-40 bg-transparent overflow-hidden">
            <AmbientGlow variant="center" />

            <div className="container mx-auto px-container relative z-10">
                {/* Centered Persuasive Header + Subtle Availability Line */}
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 lg:mb-20">
                    <div className="flex flex-col items-center gap-4">
                        <BlurReveal delay={0} yOffset={16}>
                            <span className="title-counter">[006]</span>
                        </BlurReveal>

                        <BlurReveal delay={0.07} yOffset={24}>
                            <h2 className="title">{dict.title.contact}</h2>
                        </BlurReveal>

                        <BlurReveal delay={0.14} yOffset={18}>
                            <p className="text-base sm:text-lg mt-2 max-w-xl font-light leading-relaxed text-muted-foreground">
                                {dict.contactIntroText}
                            </p>
                        </BlurReveal>

                        {/* Quiet Unboxed Availability & Location Cue */}
                        <BlurReveal delay={0.18} yOffset={14}>
                            <p className="pt-2 text-[11px] sm:text-xs font-mono tracking-[0.18em] uppercase text-foreground/75">
                                {content.contact.location}
                                <span aria-hidden="true" className="mx-2.5 text-muted-foreground/50">
                                    ·
                                </span>
                                {content.contact.availability}
                            </p>
                        </BlurReveal>
                    </div>
                </div>

                {/* High-Converting Direct Action Rows */}
                <div className="flex flex-col w-full max-w-5xl mx-auto mb-16 sm:mb-24 border-t border-border/55">
                    {/* 1. Primary Conversion Action: Direct Calendly Discovery Call */}
                    <BlurReveal delay={0.06} yOffset={20} duration={0.56}>
                        <a
                            href={content.contact.calendly}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-9 md:py-12 border-b border-border/55 transition-all duration-300 hover:bg-foreground/[0.02] px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
                        >
                            <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {dict.scheduleCall}
                                </span>
                                <span className="text-xs sm:text-sm text-muted-foreground/80 font-light max-w-md">
                                    {dict.bookCallSub}
                                </span>
                            </div>

                            <div className="flex items-center gap-5 shrink-0">
                                <span className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                                    {dict.bookCall}
                                </span>
                                <span className="w-11 h-11 rounded-full border border-foreground/30 bg-foreground text-background flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                                    <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </div>
                        </a>
                    </BlurReveal>

                    {/* 2. Email Row with One-Click Copy + Mailto */}
                    <BlurReveal delay={0.12} yOffset={20} duration={0.56}>
                        <div className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-9 md:py-12 border-b border-border/55 px-2 sm:px-4 -mx-2 sm:-mx-4">
                            <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase">
                                {dict.sendEmail}
                            </span>

                            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                                <a
                                    href={`mailto:${content.contact.email}`}
                                    className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground hover:opacity-75 transition-opacity break-all sm:break-normal focus-visible:outline-2 focus-visible:outline-ring rounded-sm"
                                >
                                    {content.contact.email}
                                </a>

                                <button
                                    type="button"
                                    onClick={handleCopyEmail}
                                    aria-label={copied ? dict.emailCopied : dict.copyEmail}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/70 bg-background/70 hover:bg-foreground hover:text-background hover:border-foreground text-xs font-mono tracking-[0.14em] uppercase text-foreground transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-ring"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>{dict.emailCopied}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>{dict.copyEmail}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </BlurReveal>

                    {/* 3. Formatted Direct Phone Line */}
                    <BlurReveal delay={0.18} yOffset={20} duration={0.56}>
                        <a
                            href={`tel:${sanitizePhone(content.contact.phone)}`}
                            className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-9 md:py-12 border-b border-border/55 transition-all duration-300 hover:bg-foreground/[0.02] px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
                        >
                            <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase transition-colors duration-200 group-hover:text-foreground">
                                {dict.directLine}
                            </span>

                            <div className="flex items-center gap-5">
                                <span className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                                    {content.contact.phone}
                                </span>
                                <span className="w-10 h-10 rounded-full border border-border/60 items-center justify-center bg-background/70 group-hover:bg-foreground group-hover:border-foreground group-hover:text-background transition-colors duration-200 shrink-0 hidden sm:flex">
                                    <ArrowUpRight className="w-5 h-5" />
                                </span>
                            </div>
                        </a>
                    </BlurReveal>
                </div>

                {/* Always-Visible Footer on Every Viewport Size */}
                <footer className="w-full flex flex-col-reverse md:flex-row items-center justify-between py-10 border-t border-border/50 gap-6">
                    <div className="text-xs font-mono tracking-[0.16em] text-muted-foreground uppercase flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-center md:text-left">
                        <span>© 2026 Mohammed Faiz Alam</span>
                        <span aria-hidden="true" className="text-border">
                            ·
                        </span>
                        <span>{content.contact.location}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {content.social.map((link: { label: string; href: string }) => (
                            <ShineButton
                                key={link.label}
                                href={link.href}
                                className="h-11 px-5 sm:px-6"
                                shineClassName="w-6 bg-background/20 dark:bg-background/20"
                            >
                                <span className="relative z-10 flex items-center gap-2 text-xs font-medium tracking-[0.16em] uppercase whitespace-nowrap">
                                    {link.label}
                                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </ShineButton>
                        ))}
                    </div>
                </footer>
            </div>
        </section>
    );
}
