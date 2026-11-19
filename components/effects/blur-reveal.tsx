"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    yOffset?: number;
    xOffset?: number;
    scale?: number;
    duration?: number;
}

/**
 * Zero-latency architectural entrance reveal:
 * Keeps primary content readable immediately (never traps sections at opacity: 0 on fast scroll),
 * while delivering smooth GPU-composited settle motion as elements enter the viewport.
 */
export function BlurReveal({
    children,
    className,
    delay = 0,
    yOffset = 14,
    xOffset = 0,
    scale = 0.992,
    duration = 0.45,
}: BlurRevealProps) {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const boundedY = Math.min(Math.abs(yOffset), 16) * Math.sign(yOffset || 1);
    const boundedX = Math.min(Math.abs(xOffset), 12) * Math.sign(xOffset || 1);

    return (
        <motion.div
            initial={
                prefersReducedMotion
                    ? { opacity: 1, y: 0, x: 0, scale: 1 }
                    : { opacity: 0.94, y: boundedY, x: boundedX, scale }
            }
            whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            viewport={{ once: true, amount: "some" }}
            transition={{
                duration,
                delay: Math.min(delay, 0.14),
                ease: [0.22, 1, 0.36, 1],
            }}
            className={cn("transform-gpu will-change-[transform,opacity]", className)}
        >
            {children}
        </motion.div>
    );
}
