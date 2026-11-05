"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function BlurReveal({
    children,
    className,
    delay = 0,
}: BlurRevealProps) {
    const prefersReducedMotion = useReducedMotion() ?? false;

    return (
        <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 180px 0px", amount: 0.01 }}
            transition={{ duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] }}
            className={cn("transform-gpu will-change-[transform,opacity]", className)}
        >
            {children}
        </motion.div>
    );
}
