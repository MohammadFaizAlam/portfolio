"use client";

import { cn } from "@/lib/utils";

interface AmbientGlowProps {
    variant?: "hero" | "section-left" | "section-right" | "center" | "dual";
    className?: string;
}

/**
 * Monochrome ambient glow layers using GPU-promoted static radial gradients
 * to preserve identical visual atmosphere with zero scroll-time re-rasterization cost.
 */
export function AmbientGlow({ variant = "dual", className }: AmbientGlowProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "pointer-events-none select-none absolute inset-0 overflow-hidden z-0",
                className
            )}
        >
            {variant === "hero" && (
                <>
                    <div className="absolute top-[10%] -left-24 w-[340px] sm:w-[460px] max-w-[42vw] h-[340px] sm:h-[460px] rounded-full bg-radial from-primary/[0.08] via-primary/[0.025] to-transparent dark:from-primary/[0.11] dark:via-primary/[0.035] dark:to-transparent blur-3xl transform-gpu" />
                    <div className="absolute bottom-[8%] -left-16 w-[300px] sm:w-[420px] max-w-[38vw] h-[300px] sm:h-[420px] rounded-full bg-radial from-foreground/[0.06] via-foreground/[0.02] to-transparent dark:from-foreground/[0.085] dark:via-foreground/[0.025] dark:to-transparent blur-3xl transform-gpu" />
                </>
            )}

            {variant === "section-left" && (
                <>
                    <div className="absolute top-[15%] -left-36 w-[520px] h-[520px] rounded-full bg-radial from-primary/[0.07] via-primary/[0.02] to-transparent dark:from-primary/[0.09] dark:via-primary/[0.025] dark:to-transparent blur-3xl transform-gpu" />
                    <div className="absolute bottom-[10%] right-[12%] w-[440px] h-[440px] rounded-full bg-radial from-foreground/[0.05] via-transparent to-transparent dark:from-foreground/[0.065] blur-3xl transform-gpu" />
                </>
            )}

            {variant === "section-right" && (
                <>
                    <div className="absolute top-[10%] -right-32 w-[540px] h-[540px] rounded-full bg-radial from-primary/[0.07] via-primary/[0.02] to-transparent dark:from-primary/[0.09] dark:via-primary/[0.025] dark:to-transparent blur-3xl transform-gpu" />
                    <div className="absolute bottom-[12%] left-[6%] w-[450px] h-[450px] rounded-full bg-radial from-foreground/[0.05] via-transparent to-transparent dark:from-foreground/[0.065] blur-3xl transform-gpu" />
                </>
            )}

            {variant === "center" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[460px] rounded-full bg-radial from-primary/[0.065] via-primary/[0.02] to-transparent dark:from-primary/[0.085] dark:via-primary/[0.025] dark:to-transparent blur-3xl transform-gpu" />
            )}

            {variant === "dual" && (
                <>
                    <div className="absolute top-[14%] -left-28 w-[500px] h-[500px] rounded-full bg-radial from-primary/[0.07] via-primary/[0.02] to-transparent dark:from-primary/[0.09] dark:via-primary/[0.025] dark:to-transparent blur-3xl transform-gpu" />
                    <div className="absolute bottom-[14%] -right-28 w-[520px] h-[520px] rounded-full bg-radial from-foreground/[0.055] via-foreground/[0.018] to-transparent dark:from-foreground/[0.075] dark:via-foreground/[0.022] dark:to-transparent blur-3xl transform-gpu" />
                </>
            )}
        </div>
    );
}
