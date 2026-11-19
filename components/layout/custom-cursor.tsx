"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CustomCursor() {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const isVisibleRef = useRef(false);
    const isHoveringRef = useRef(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 28, stiffness: 380, mass: 0.35 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) {
            return;
        }

        const frameId = requestAnimationFrame(() => {
            setIsEnabled(true);
        });

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisibleRef.current) {
                isVisibleRef.current = true;
                setIsVisible(true);
            }
        };

        const isInteractive = (el: HTMLElement | null): boolean => {
            if (!el || typeof el.tagName !== "string") return false;
            const tag = el.tagName.toLowerCase();
            if (tag === "button" || tag === "a" || tag === "input" || tag === "select" || tag === "textarea") return true;
            if (el.closest("button, a, [role='button'], [data-cursor='pointer'], .cursor-pointer")) return true;
            return false;
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            const nextHover = isInteractive(target);
            if (nextHover !== isHoveringRef.current) {
                isHoveringRef.current = nextHover;
                setIsHovering(nextHover);
            }
        };

        const handleMouseLeave = () => {
            isVisibleRef.current = false;
            setIsVisible(false);
        };
        const handleMouseEnter = () => {
            isVisibleRef.current = true;
            setIsVisible(true);
        };

        window.addEventListener("mousemove", moveCursor, { passive: true });
        window.addEventListener("mouseover", handleMouseOver, { passive: true });
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [cursorX, cursorY, prefersReducedMotion]);

    if (!isEnabled || prefersReducedMotion) return null;

    return (
        <motion.div
            aria-hidden="true"
            className="fixed top-0 left-0 pointer-events-none hidden md:flex items-center justify-center mix-blend-difference transform-gpu will-change-transform"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
                translateX: "-50%",
                translateY: "-50%",
                opacity: isVisible ? 1 : 0,
                zIndex: 999999,
            }}
        >
            {/* GPU compositor-only scale transition (no layout-thrashing width/height animation) */}
            <motion.div
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 transform-gpu",
                    isHovering
                        ? "bg-white/12 border border-white/85"
                        : "bg-transparent border border-white/45"
                )}
                animate={{
                    scale: isHovering ? 1.45 : 1,
                }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    animate={{
                        scale: isHovering ? 0 : 1,
                        opacity: isHovering ? 0 : 1,
                    }}
                    transition={{ duration: 0.16 }}
                />
            </motion.div>
        </motion.div>
    );
}
