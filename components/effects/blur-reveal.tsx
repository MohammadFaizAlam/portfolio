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

export function BlurReveal({
    children,
    className,
    delay = 0,
    yOffset = 22,
    xOffset = 0,
    scale = 0.985,
    duration = 0.58,
}: BlurRevealProps) {
    const prefersReducedMotion = useReducedMotion() ?? false;

    return (
        <motion.div
            initial={
                prefersReducedMotion
                    ? { opacity: 1, y: 0, x: 0, scale: 1 }
                    : { opacity: 0, y: yOffset, x: xOffset, scale }
            }
            whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px 140px 0px", amount: 0.02 }}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={cn("transform-gpu will-change-[transform,opacity]", className)}
        >
            {children}
        </motion.div>
    );
}
