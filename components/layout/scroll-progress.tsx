"use client";

import { motion, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollProgressProps {
    className?: string;
}

export default function ScrollProgress({ className }: ScrollProgressProps) {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className={cn(
                "fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-99999 transform-gpu will-change-transform",
                className
            )}
            style={{ scaleX: scrollYProgress }}
        />
    );
}