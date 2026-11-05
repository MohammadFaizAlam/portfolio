"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getPillarVisualVariant } from "@/lib/portfolio-enhancements";

interface PillarVisualProps {
    pillarId: string;
    index: number;
    isActive?: boolean;
    className?: string;
}

export function PillarVisualCanvas({
    pillarId,
    index,
    isActive = true,
    className,
}: PillarVisualProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion() ?? false;
    const isInView = useInView(containerRef, { margin: "120px 0px" });
    const animate = !prefersReducedMotion && isInView && isActive;

    const resolvedType = getPillarVisualVariant(pillarId, index);

    return (
        <div
            ref={containerRef}
            data-testid={`pillar-canvas-${pillarId}`}
            className={cn(
                "group/canvas relative w-full aspect-[16/10] min-h-[300px] sm:min-h-[360px] lg:min-h-[420px] rounded-[24px] sm:rounded-[28px] bg-[#080807] border border-white/[0.08] overflow-hidden select-none shadow-[0_24px_70px_-16px_rgba(0,0,0,0.85)] transform-gpu",
                className
            )}
        >
            {/* Top Specular Warm-Gold & White Hairline */}
            <div
                aria-hidden="true"
                className="
                    absolute top-0 inset-x-10 h-px
                    bg-gradient-to-r from-transparent via-[#e2c675]/45 to-transparent
                    pointer-events-none z-20
                "
            />

            {/* Subtle Architectural Grid Backdrop */}
            <div
                aria-hidden="true"
                className="
                    absolute inset-0 pointer-events-none opacity-80
                    bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)]
                    bg-[size:48px_48px]
                    [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,black_35%,transparent_90%)]
                "
            />

            {resolvedType === "orbital" && (
                <OrbitalQuantumCanvas animate={animate} />
            )}
            {resolvedType === "volume" && (
                <VolumeProfileCanvas animate={animate} />
            )}
            {resolvedType === "compounding" && (
                <CompoundingCurveCanvas animate={animate} />
            )}
        </div>
    );
}

function CanvasPill({
    dotColor = "gold",
    label,
    className,
}: {
    dotColor?: "gold" | "white";
    label: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#0b0b0a]/92 border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.75)]",
                className
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0",
                    dotColor === "gold"
                        ? "bg-[#dfc068] shadow-[0_0_8px_rgba(223,192,104,0.65)]"
                        : "bg-white shadow-[0_0_8px_rgba(255,255,255,0.65)]"
                )}
            />
            <span className="text-[8px] sm:text-[11px] font-mono tracking-[0.14em] sm:tracking-[0.22em] uppercase text-white/95 font-medium whitespace-nowrap">
                {label}
            </span>
        </div>
    );
}

/**
 * 01. Systems Engineering — Orbital Quantum Nodes
 * Matches reference screenshot 1 (image_8358855b.png) with exact concentric alignment & orbital motion.
 */
function OrbitalQuantumCanvas({ animate }: { animate: boolean }) {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Warm Golden Radial Aura */}
            <div
                aria-hidden="true"
                className="
                    absolute inset-0 pointer-events-none
                    bg-[radial-gradient(circle_at_50%_52%,rgba(218,188,100,0.22)_0%,rgba(218,188,100,0.08)_30%,rgba(218,188,100,0.02)_52%,transparent_72%)]
                "
            />

            <svg
                viewBox="0 0 800 500"
                className="w-full h-full overflow-visible relative z-10"
                aria-label="Orbital Quantum Nodes Visualization"
            >
                <defs>
                    <linearGradient
                        id="quantum-axis-1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                        <stop offset="50%" stopColor="rgba(223,192,104,0.34)" />
                        <stop offset="100%" stopColor="rgba(223,192,104,0.08)" />
                    </linearGradient>
                    <linearGradient
                        id="quantum-axis-2"
                        x1="0%"
                        y1="100%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                        <stop offset="55%" stopColor="rgba(223,192,104,0.38)" />
                        <stop offset="100%" stopColor="rgba(223,192,104,0.58)" />
                    </linearGradient>
                    <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(223,192,104,0.35)" />
                        <stop offset="60%" stopColor="rgba(223,192,104,0.08)" />
                        <stop offset="100%" stopColor="rgba(223,192,104,0)" />
                    </radialGradient>
                </defs>

                {/* All concentric orbital geometry anchored strictly at (400, 260) */}
                <g transform="translate(400, 260)">
                    {/* Soft SVG Center Glow */}
                    <circle cx="0" cy="0" r="165" fill="url(#core-glow)" />

                    {/* Outer Dashed Orbital Ring (Rotating around 0,0) */}
                    <motion.g
                        style={{ transformOrigin: "0px 0px" }}
                        animate={animate ? { rotate: 360 } : undefined}
                        transition={{
                            duration: 54,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <circle
                            cx="0"
                            cy="0"
                            r="164"
                            fill="none"
                            stroke="rgba(255,255,255,0.12)"
                            strokeWidth="1.2"
                            strokeDasharray="4 7"
                        />
                    </motion.g>

                    {/* Mid Warm-Gold Orbital Ring */}
                    <circle
                        cx="0"
                        cy="0"
                        r="114"
                        fill="none"
                        stroke="rgba(218,188,100,0.28)"
                        strokeWidth="1.2"
                    />

                    {/* Inner Concentric Rings */}
                    <circle
                        cx="0"
                        cy="0"
                        r="64"
                        fill="none"
                        stroke="rgba(255,255,255,0.17)"
                        strokeWidth="1"
                    />
                    <circle
                        cx="0"
                        cy="0"
                        r="46"
                        fill="none"
                        stroke="rgba(255,255,255,0.09)"
                        strokeWidth="1"
                    />

                    {/* Diagonal Quantum Vector Axes */}
                    <line
                        x1="-168"
                        y1="-98"
                        x2="158"
                        y2="92"
                        stroke="url(#quantum-axis-1)"
                        strokeWidth="1.25"
                    />
                    <line
                        x1="-148"
                        y1="88"
                        x2="172"
                        y2="-86"
                        stroke="url(#quantum-axis-2)"
                        strokeWidth="1.25"
                    />

                    {/* Top-Right Axis Endpoint Gold Node at (172, -86) */}
                    <circle
                        cx="172"
                        cy="-86"
                        r="4.2"
                        fill="#dfc068"
                    />
                    <motion.circle
                        cx="172"
                        cy="-86"
                        r="9"
                        fill="none"
                        stroke="rgba(223,192,104,0.35)"
                        strokeWidth="1"
                        style={{ transformOrigin: "172px -86px" }}
                        animate={
                            animate
                                ? {
                                      opacity: [0.2, 0.75, 0.2],
                                  }
                                : undefined
                        }
                        transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Orbiting Inner Quantum Nodes strictly on r=46 and r=64 rings */}
                    <motion.g
                        style={{ transformOrigin: "0px 0px" }}
                        animate={animate ? { rotate: 360 } : undefined}
                        transition={{
                            duration: 22,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {/* Node on r=46 inner ring (top-left angle) */}
                        <circle
                            cx="-23"
                            cy="-13"
                            r="3.8"
                            fill="rgba(230,224,205,0.75)"
                        />
                        {/* Node on r=64 ring (bottom-right angle) */}
                        <circle
                            cx="55"
                            cy="32"
                            r="3.8"
                            fill="rgba(230,224,205,0.82)"
                        />
                    </motion.g>

                    {/* Counter-rotating subtle golden photon on mid ring r=114 */}
                    <motion.g
                        style={{ transformOrigin: "0px 0px" }}
                        animate={animate ? { rotate: -360 } : undefined}
                        transition={{
                            duration: 32,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <circle
                            cx="-98"
                            cy="-58"
                            r="2.6"
                            fill="rgba(223,192,104,0.75)"
                        />
                    </motion.g>

                    {/* Central Obsidian Core Vessel & Luminous Gold Singularity */}
                    <circle
                        cx="0"
                        cy="0"
                        r="29"
                        fill="#070709"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1"
                    />
                    <motion.circle
                        cx="0"
                        cy="0"
                        r="7.5"
                        fill="#dfc068"
                        animate={
                            animate
                                ? {
                                      opacity: [0.85, 1, 0.85],
                                  }
                                : undefined
                        }
                        transition={{
                            duration: 2.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </g>

                {/* Bottom-Right Target Node Indicator cleanly positioned below the FASTAPI pill */}
                <g transform="translate(598, 434)">
                    <motion.circle
                        cx="0"
                        cy="0"
                        r="19"
                        fill="rgba(12,12,11,0.75)"
                        stroke="rgba(255,255,255,0.45)"
                        strokeWidth="1.2"
                        animate={
                            animate
                                ? {
                                      opacity: [0.55, 0.95, 0.55],
                                  }
                                : undefined
                        }
                        transition={{
                            duration: 3.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <circle cx="0" cy="0" r="4.2" fill="#ffffff" />
                </g>
            </svg>

            {/* Floating Dark-Glass Callout Pills */}
            <motion.div
                animate={animate ? { y: [0, -3, 0] } : undefined}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[10%] sm:top-[16%] left-[5%] sm:left-[12%] z-20"
            >
                <CanvasPill dotColor="gold" label="NEXT.JS · TYPESCRIPT" />
            </motion.div>

            <motion.div
                animate={animate ? { y: [0, 3, 0] } : undefined}
                transition={{
                    duration: 5.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[23%] sm:top-[20%] right-[5%] sm:right-[10%] z-20"
            >
                <CanvasPill dotColor="white" label="BB84 QUANTUM SIM" />
            </motion.div>

            <motion.div
                animate={animate ? { y: [0, -2.5, 0] } : undefined}
                transition={{
                    duration: 4.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[19%] right-[5%] sm:right-[12%] z-20"
            >
                <CanvasPill dotColor="gold" label="FASTAPI · PYTHON" />
            </motion.div>
        </div>
    );
}

/**
 * 02. Market Mechanics — Volume Profile & POC Liquidity Sculpture
 * Matches reference screenshot 2 (image_5e61e98d.png) with razor-aligned left bar axis & living order flow.
 */
function VolumeProfileCanvas({ animate }: { animate: boolean }) {
    const bars = [
        { y: 102, width: 156, isPoc: false },
        { y: 142, width: 242, isPoc: false },
        { y: 182, width: 344, isPoc: false },
        { y: 222, width: 458, isPoc: false },
        { y: 262, width: 590, isPoc: true },
        { y: 302, width: 496, isPoc: false },
        { y: 342, width: 364, isPoc: false },
        { y: 382, width: 264, isPoc: false },
        { y: 422, width: 180, isPoc: false },
    ];

    const sCurvePath =
        "M 72 414 C 155 395, 238 266, 342 268 C 435 270, 468 290, 560 222 C 632 168, 692 140, 748 132";

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Ambient Warm Liquidity Glow around POC */}
            <div
                aria-hidden="true"
                className="
                    absolute inset-0 pointer-events-none
                    bg-[radial-gradient(ellipse_60%_45%_at_52%_55%,rgba(218,188,100,0.18)_0%,rgba(218,188,100,0.05)_48%,transparent_75%)]
                "
            />

            <svg
                viewBox="0 0 800 500"
                className="w-full h-full overflow-visible relative z-10"
                aria-label="Volume Profile and Point of Control Liquidity Visualization"
            >
                <defs>
                    <linearGradient
                        id="vp-bar-muted"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
                        <stop offset="65%" stopColor="rgba(255,255,255,0.09)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.16)" />
                    </linearGradient>
                    <linearGradient
                        id="vp-bar-vah"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="rgba(218,188,100,0.05)" />
                        <stop offset="65%" stopColor="rgba(218,188,100,0.14)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.22)" />
                    </linearGradient>
                    <linearGradient
                        id="vp-bar-poc"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="rgba(164,138,68,0.34)" />
                        <stop offset="55%" stopColor="rgba(208,184,112,0.68)" />
                        <stop offset="88%" stopColor="rgba(232,222,192,0.88)" />
                        <stop offset="100%" stopColor="rgba(245,242,232,0.95)" />
                    </linearGradient>
                    <linearGradient
                        id="vp-curve-grad"
                        x1="0%"
                        y1="100%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                        <stop offset="32%" stopColor="rgba(218,188,100,0.72)" />
                        <stop offset="62%" stopColor="rgba(235,212,135,0.95)" />
                        <stop offset="92%" stopColor="rgba(255,255,255,0.95)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
                    </linearGradient>
                </defs>

                {/* Volume Profile Horizontal Histogram Bars anchored strictly at x=122 */}
                {bars.map((bar, idx) => {
                    const h = 24;
                    const r = 12;
                    const w = bar.width;
                    const d = `M 0 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} A ${r} ${r} 0 0 1 ${w - r} ${h} H 0 Z`;

                    const fillUrl = bar.isPoc
                        ? "url(#vp-bar-poc)"
                        : idx === 3 || idx === 5
                          ? "url(#vp-bar-vah)"
                          : "url(#vp-bar-muted)";

                    return (
                        <g
                            key={bar.y}
                            transform={`translate(122, ${bar.y})`}
                        >
                            <motion.path
                                d={d}
                                fill={fillUrl}
                                animate={
                                    animate
                                        ? {
                                              opacity: bar.isPoc
                                                  ? [0.92, 1, 0.92]
                                                  : [
                                                        0.78,
                                                        idx % 2 === 0 ? 1 : 0.62,
                                                        0.78,
                                                    ],
                                          }
                                        : undefined
                                }
                                transition={{
                                    duration: 3.4 + idx * 0.22,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            {bar.isPoc && (
                                <>
                                    {/* Thin luminous centerline inside POC bar */}
                                    <line
                                        x1="18"
                                        y1={h / 2}
                                        x2={w - 92}
                                        y2={h / 2}
                                        stroke="rgba(255,255,255,0.65)"
                                        strokeWidth="1.2"
                                    />
                                    {/* Dark POC Tag Inside Bar */}
                                    <rect
                                        x={w - 80}
                                        y="2"
                                        width="54"
                                        height="20"
                                        rx="10"
                                        fill="#141412"
                                    />
                                    <text
                                        x={w - 53}
                                        y="15.5"
                                        textAnchor="middle"
                                        className="fill-[#dfc068] text-[10px] font-mono font-semibold tracking-[0.2em]"
                                    >
                                        POC
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}

                {/* Sweeping Price Action & Liquidity Trajectory S-Curve */}
                <path
                    d={sCurvePath}
                    fill="none"
                    stroke="url(#vp-curve-grad)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                />

                {/* Animated Liquidity Flow Wave along the S-Curve */}
                <motion.path
                    d={sCurvePath}
                    fill="none"
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeDasharray="110 760"
                    animate={
                        animate
                            ? {
                                  strokeDashoffset: [870, 0],
                              }
                            : undefined
                    }
                    transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* POC Right-Cap Interactive Target Ring & Node */}
                <g transform="translate(692, 268)">
                    <motion.circle
                        cx="0"
                        cy="0"
                        r="19"
                        fill="rgba(255,255,255,0.03)"
                        stroke="rgba(255,255,255,0.42)"
                        strokeWidth="1.2"
                        animate={
                            animate
                                ? {
                                      opacity: [0.55, 1, 0.55],
                                  }
                                : undefined
                        }
                        transition={{
                            duration: 2.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <circle cx="-2" cy="-2" r="4" fill="#ffffff" />
                </g>
            </svg>

            {/* Top-Right Badge */}
            <motion.div
                animate={animate ? { y: [0, -3, 0] } : undefined}
                transition={{
                    duration: 5.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[10%] right-[5%] sm:right-[6%] z-20"
            >
                <CanvasPill
                    dotColor="gold"
                    label="VOLUME PROFILE · VAH / VAL"
                />
            </motion.div>

            {/* Bottom-Right Badge */}
            <motion.div
                animate={animate ? { y: [0, 3, 0] } : undefined}
                transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[4%] right-[5%] sm:right-[6%] z-20"
            >
                <CanvasPill dotColor="white" label="GYMNASIUM PPO AGENT" />
            </motion.div>
        </div>
    );
}

/**
 * 03. Growth & Advertising — Luminous Compounding Curve
 * Matches reference screenshot 3 (image_abfdbade.png) with compounding curve & milestone nodes.
 */
function CompoundingCurveCanvas({ animate }: { animate: boolean }) {
    const primaryCurve =
        "M 112 372 C 250 366, 378 286, 505 204 C 588 150, 650 116, 708 100";
    const areaPath = `${primaryCurve} L 708 425 L 112 425 Z`;
    const baselineCurve =
        "M 112 392 C 275 384, 475 322, 708 216";

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Subtle Warm Glow under the Curve */}
            <div
                aria-hidden="true"
                className="
                    absolute inset-0 pointer-events-none
                    bg-[radial-gradient(ellipse_65%_55%_at_65%_55%,rgba(218,188,100,0.15)_0%,rgba(218,188,100,0.04)_50%,transparent_78%)]
                "
            />

            <svg
                viewBox="0 0 800 500"
                className="w-full h-full overflow-visible relative z-10"
                aria-label="Luminous Compounding Growth Curve Visualization"
            >
                <defs>
                    <linearGradient
                        id="growth-area-grad"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="rgba(218,188,100,0.22)" />
                        <stop offset="55%" stopColor="rgba(218,188,100,0.07)" />
                        <stop offset="100%" stopColor="rgba(218,188,100,0.0)" />
                    </linearGradient>
                    <linearGradient
                        id="growth-stroke-grad"
                        x1="0%"
                        y1="100%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
                        <stop offset="28%" stopColor="rgba(218,188,100,0.78)" />
                        <stop offset="72%" stopColor="rgba(232,208,128,0.96)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.98)" />
                    </linearGradient>
                </defs>

                {/* 3 Horizontal Dashed Grid Lines */}
                {[142, 248, 354].map((yPos) => (
                    <line
                        key={yPos}
                        x1="104"
                        y1={yPos}
                        x2="712"
                        y2={yPos}
                        stroke="rgba(255,255,255,0.07)"
                        strokeWidth="1"
                        strokeDasharray="4 7"
                    />
                ))}

                {/* Luminous Area Fill Under Primary Compounding Curve */}
                <path d={areaPath} fill="url(#growth-area-grad)" />

                {/* Secondary Dashed Baseline Trajectory */}
                <path
                    d={baselineCurve}
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                />

                {/* Primary Luminous Compounding Curve */}
                <path
                    d={primaryCurve}
                    fill="none"
                    stroke="url(#growth-stroke-grad)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                />

                {/* Animated Luminous Compounding Wave along Primary Curve */}
                <motion.path
                    d={primaryCurve}
                    fill="none"
                    stroke="rgba(255,255,255,0.65)"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeDasharray="120 720"
                    animate={
                        animate
                            ? {
                                  strokeDashoffset: [840, 0],
                              }
                            : undefined
                    }
                    transition={{
                        duration: 5.2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Milestone Node 1 */}
                <g transform="translate(262, 336)">
                    <circle
                        cx="0"
                        cy="0"
                        r="7.5"
                        fill="#080807"
                        stroke="#dfc068"
                        strokeWidth="2.5"
                    />
                </g>

                {/* Milestone Node 2 */}
                <g transform="translate(468, 227)">
                    <circle
                        cx="0"
                        cy="0"
                        r="7.5"
                        fill="#080807"
                        stroke="#dfc068"
                        strokeWidth="2.5"
                    />
                </g>

                {/* Milestone Node 3 (Apex with Golden Halo Ring) */}
                <g transform="translate(660, 114)">
                    <motion.circle
                        cx="0"
                        cy="0"
                        r="18"
                        fill="rgba(223,192,104,0.08)"
                        stroke="rgba(223,192,104,0.38)"
                        strokeWidth="1.2"
                        animate={
                            animate
                                ? {
                                      opacity: [0.55, 1, 0.55],
                                  }
                                : undefined
                        }
                        transition={{
                            duration: 2.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <circle
                        cx="0"
                        cy="0"
                        r="7.5"
                        fill="#080807"
                        stroke="#dfc068"
                        strokeWidth="2.5"
                    />
                </g>
            </svg>

            {/* Top-Left Badge */}
            <motion.div
                animate={animate ? { y: [0, -3, 0] } : undefined}
                transition={{
                    duration: 5.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[9%] left-[6%] sm:left-[7%] z-20"
            >
                <CanvasPill dotColor="gold" label="GOOGLE & META ADS · GA4" />
            </motion.div>

            {/* Bottom-Right Verified Reach Pill */}
            <motion.div
                animate={animate ? { y: [0, 3, 0] } : undefined}
                transition={{
                    duration: 4.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[8%] right-[5%] sm:right-[6%] z-20"
            >
                <div className="inline-flex items-center gap-3.5 sm:gap-5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0b0b0a]/94 border border-white/[0.08] shadow-[0_12px_34px_rgba(0,0,0,0.8)]">
                    <span className="text-[9px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-white/55 whitespace-nowrap">
                        VERIFIED REACH
                    </span>
                    <span className="text-xs sm:text-base font-bold tracking-tight text-white tabular-nums whitespace-nowrap">
                        89K+ Users
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
