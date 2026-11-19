"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getPillarVisualVariant } from "@/lib/portfolio-enhancements";

interface PillarVisualProps {
    pillarId: string;
    index: number;
    isActive?: boolean;
    className?: string;
}

/**
 * Zero-lag, instant-paint architectural visualizations for the Three Pillars section.
 * All motion uses pure GPU-composited CSS transforms/opacity (zero JS RAF loops,
 * zero stroke-dashoffset CPU repaints, zero useInView late-render delays).
 */
export const PillarVisualCanvas = React.memo(function PillarVisualCanvas({
    pillarId,
    index,
    isActive = true,
    className,
}: PillarVisualProps) {
    const resolvedType = getPillarVisualVariant(pillarId, index);

    return (
        <div
            data-testid={`pillar-canvas-${pillarId}`}
            data-paused={!isActive ? "true" : undefined}
            className={cn(
                "group/canvas relative w-full aspect-[16/10] min-h-[260px] sm:min-h-[340px] lg:min-h-[390px] rounded-2xl bg-[#070706] border border-white/[0.08] overflow-hidden select-none shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transform-gpu contain-paint",
                className
            )}
        >
            {/* Top Specular Hairline */}
            <div
                aria-hidden="true"
                className="absolute top-0 inset-x-12 h-px bg-linear-to-r from-transparent via-[#e2c675]/45 to-transparent pointer-events-none z-20"
            />

            {/* Subtle Architectural Drafting Grid */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-75 bg-[linear-gradient(to_right,rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_78%_76%_at_50%_50%,black_30%,transparent_92%)]"
            />

            {/* Precision Corner Registration Marks */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-3 z-20">
                <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20" />
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/20" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/20" />
            </div>

            {resolvedType === "orbital" && <OrbitalQuantumCanvas />}
            {resolvedType === "volume" && <VolumeProfileCanvas />}
            {resolvedType === "compounding" && <CompoundingCurveCanvas />}
        </div>
    );
});

const DEGREE_TICKS = Array.from({ length: 36 }, (_, i) => {
    const angle = (i * 10 * Math.PI) / 180;
    const isMajor = i % 9 === 0;
    const isMedium = i % 3 === 0;
    const innerR = isMajor ? 150 : isMedium ? 157 : 162;
    const outerR = 168;
    return {
        key: i,
        x1: Number((Math.cos(angle) * innerR).toFixed(2)),
        y1: Number((Math.sin(angle) * innerR).toFixed(2)),
        x2: Number((Math.cos(angle) * outerR).toFixed(2)),
        y2: Number((Math.sin(angle) * outerR).toFixed(2)),
        isMajor,
    };
});

/**
 * 01. Systems Engineering — Precision Bloch-Sphere Quantum Interferometer
 */
function OrbitalQuantumCanvas() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Soft Warm Champagne Radial Field */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(218,188,100,0.18)_0%,rgba(218,188,100,0.06)_32%,transparent_68%)]"
            />

            {/* Integrated Top & Bottom Instrument Readouts (Zero Floating Bubble Pills) */}
            <div className="absolute top-5 inset-x-6 flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.18em] uppercase text-white/50 z-20 pointer-events-none">
                <span>BB84 · QKD SIMULATOR</span>
                <span className="text-[#dfc068]/90 tabular-nums">QBER 0.02%</span>
            </div>

            <div className="absolute bottom-5 inset-x-6 flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.18em] uppercase text-white/45 z-20 pointer-events-none">
                <span>NEXT.JS · TYPESCRIPT</span>
                <span>PYTHON · FASTAPI</span>
            </div>

            <svg
                viewBox="0 0 800 500"
                className="w-full h-full relative z-10"
                aria-label="Quantum Interferometer and Systems Architecture Visualization"
            >
                <defs>
                    <radialGradient id="q-core-field" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(223,192,104,0.34)" />
                        <stop offset="55%" stopColor="rgba(223,192,104,0.07)" />
                        <stop offset="100%" stopColor="rgba(223,192,104,0)" />
                    </radialGradient>
                    <linearGradient id="q-axis-primary" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                        <stop offset="50%" stopColor="rgba(223,192,104,0.42)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.68)" />
                    </linearGradient>
                    <linearGradient id="q-ellipse-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(223,192,104,0.52)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.16)" />
                        <stop offset="100%" stopColor="rgba(223,192,104,0.12)" />
                    </linearGradient>
                </defs>

                <g transform="translate(400, 250)">
                    {/* Ambient Core Illumination */}
                    <circle cx="0" cy="0" r="158" fill="url(#q-core-field)" />

                    {/* Precision Calibration Azimuth Ticks */}
                    <g>
                        {DEGREE_TICKS.map((t) => (
                            <line
                                key={t.key}
                                x1={t.x1}
                                y1={t.y1}
                                x2={t.x2}
                                y2={t.y2}
                                stroke={t.isMajor ? "rgba(223,192,104,0.65)" : "rgba(255,255,255,0.16)"}
                                strokeWidth={t.isMajor ? "1.4" : "1"}
                            />
                        ))}
                    </g>

                    {/* Cardinal Degree Labels */}
                    <text x="0" y="-178" textAnchor="middle" className="fill-white/35 text-[10px] font-mono tracking-[0.18em]">000°</text>
                    <text x="192" y="4" textAnchor="middle" className="fill-white/35 text-[10px] font-mono tracking-[0.18em]">090°</text>
                    <text x="0" y="188" textAnchor="middle" className="fill-white/35 text-[10px] font-mono tracking-[0.18em]">180°</text>
                    <text x="-192" y="4" textAnchor="middle" className="fill-white/35 text-[10px] font-mono tracking-[0.18em]">270°</text>

                    {/* Outer Rotating Vernier Orbit (Pure GPU CSS Transform) */}
                    <g className="pillar-orbit-cw">
                        <circle
                            cx="0"
                            cy="0"
                            r="142"
                            fill="none"
                            stroke="rgba(255,255,255,0.12)"
                            strokeWidth="1"
                            strokeDasharray="3 8"
                        />
                        <path
                            d="M 100.4 -100.4 A 142 142 0 0 1 142 0"
                            fill="none"
                            stroke="rgba(223,192,104,0.55)"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                        />
                        <path
                            d="M -100.4 100.4 A 142 142 0 0 1 -142 0"
                            fill="none"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                        />
                    </g>

                    {/* Dual Tilted 3D Bloch Phase Planes */}
                    <ellipse
                        cx="0"
                        cy="0"
                        rx="126"
                        ry="44"
                        transform="rotate(-26)"
                        fill="none"
                        stroke="url(#q-ellipse-gold)"
                        strokeWidth="1.2"
                    />
                    <ellipse
                        cx="0"
                        cy="0"
                        rx="126"
                        ry="44"
                        transform="rotate(26)"
                        fill="none"
                        stroke="rgba(255,255,255,0.14)"
                        strokeWidth="1"
                        strokeDasharray="4 5"
                    />

                    {/* Inner Concentric Structural Rings */}
                    <circle cx="0" cy="0" r="88" fill="none" stroke="rgba(223,192,104,0.24)" strokeWidth="1" />
                    <circle cx="0" cy="0" r="52" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

                    {/* Principal Quantum Polarization Vector */}
                    <line
                        x1="-146"
                        y1="78"
                        x2="146"
                        y2="-78"
                        stroke="url(#q-axis-primary)"
                        strokeWidth="1.35"
                    />
                    <line
                        x1="-112"
                        y1="-64"
                        x2="112"
                        y2="64"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1"
                    />

                    {/* Counter-Rotating Orbiting Photon States */}
                    <g className="pillar-orbit-cw-fast">
                        <circle cx="88" cy="0" r="3.8" fill="#dfc068" />
                        <circle cx="88" cy="0" r="8" fill="none" stroke="rgba(223,192,104,0.35)" strokeWidth="1" />
                        <circle cx="-52" cy="0" r="2.8" fill="rgba(255,255,255,0.85)" />
                    </g>

                    <g className="pillar-orbit-ccw">
                        <circle cx="0" cy="-124" r="3.2" fill="rgba(255,255,255,0.82)" />
                        <circle cx="0" cy="124" r="2.6" fill="rgba(223,192,104,0.7)" />
                    </g>

                    {/* Vector Endpoint Lock Node */}
                    <g transform="translate(146, -78)">
                        <circle cx="0" cy="0" r="10" fill="rgba(223,192,104,0.1)" stroke="rgba(223,192,104,0.45)" strokeWidth="1" className="pillar-breathe" />
                        <circle cx="0" cy="0" r="3.6" fill="#dfc068" />
                    </g>

                    {/* Central Obsidian Core & Breathing Gold Singularity */}
                    <circle cx="0" cy="0" r="26" fill="#070706" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
                    <circle cx="0" cy="0" r="15" fill="none" stroke="rgba(223,192,104,0.3)" strokeWidth="1" className="pillar-breathe" />
                    <circle cx="0" cy="0" r="6" fill="#dfc068" />
                </g>
            </svg>
        </div>
    );
}

const VP_BARS = [
    { y: 92, w: 84, zone: "outer" },
    { y: 118, w: 126, zone: "outer" },
    { y: 144, w: 196, zone: "va" },
    { y: 170, w: 268, zone: "va" },
    { y: 196, w: 334, zone: "va" },
    { y: 222, w: 432, zone: "poc" },
    { y: 248, w: 368, zone: "va" },
    { y: 274, w: 294, zone: "va" },
    { y: 300, w: 220, zone: "va" },
    { y: 326, w: 148, zone: "outer" },
    { y: 352, w: 98, zone: "outer" },
    { y: 378, w: 66, zone: "outer" },
] as const;

const CANDLES = [
    { x: 430, hi: 332, lo: 382, o: 364, c: 344, up: true },
    { x: 462, hi: 318, lo: 360, o: 344, c: 326, up: true },
    { x: 494, hi: 274, lo: 330, o: 326, c: 288, up: true },
    { x: 526, hi: 248, lo: 302, o: 288, c: 260, up: true },
    { x: 558, hi: 214, lo: 270, o: 260, c: 230, up: true },
    { x: 590, hi: 218, lo: 256, o: 230, c: 246, up: false },
    { x: 622, hi: 184, lo: 244, o: 242, c: 196, up: true },
    { x: 654, hi: 144, lo: 204, o: 196, c: 158, up: true },
    { x: 686, hi: 118, lo: 168, o: 158, c: 128, up: true },
] as const;

/**
 * 02. Market Mechanics — Institutional Orderflow, Volume Profile & Market Structure
 */
function VolumeProfileCanvas() {
    const trajectoryPath =
        "M 398 378 C 446 364, 488 302, 542 252 C 586 212, 620 222, 654 176 C 676 146, 702 126, 728 118";

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Soft Liquidity Glow Centered on POC */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_58%_40%_at_42%_48%,rgba(218,188,100,0.16)_0%,rgba(218,188,100,0.04)_48%,transparent_76%)]"
            />

            {/* Integrated Instrument Readouts */}
            <div className="absolute top-5 inset-x-6 flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.18em] uppercase text-white/50 z-20 pointer-events-none">
                <span>VOLUME PROFILE · ORDERFLOW</span>
                <span className="text-[#dfc068]/90">POC · VAH / VAL</span>
            </div>

            <div className="absolute bottom-5 inset-x-6 flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.18em] uppercase text-white/45 z-20 pointer-events-none">
                <span>LIQUIDITY STRUCTURE</span>
                <span>GYMNASIUM PPO AGENT</span>
            </div>

            <svg
                viewBox="0 0 800 500"
                className="w-full h-full relative z-10"
                aria-label="Volume Profile and Institutional Market Structure Visualization"
            >
                <defs>
                    <linearGradient id="vp-outer" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.16)" />
                    </linearGradient>
                    <linearGradient id="vp-va" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(218,188,100,0.08)" />
                        <stop offset="100%" stopColor="rgba(218,188,100,0.28)" />
                    </linearGradient>
                    <linearGradient id="vp-poc" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(166,138,66,0.36)" />
                        <stop offset="65%" stopColor="rgba(223,192,104,0.82)" />
                        <stop offset="100%" stopColor="rgba(250,245,232,0.96)" />
                    </linearGradient>
                    <linearGradient id="vp-price-line" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                        <stop offset="45%" stopColor="rgba(223,192,104,0.85)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.96)" />
                    </linearGradient>
                    <clipPath id="vp-poc-clip">
                        <rect x="64" y="222" width="432" height="17" rx="3" />
                    </clipPath>
                </defs>

                {/* Left Vertical Price Axis Spine */}
                <line x1="64" y1="84" x2="64" y2="404" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

                {/* Value Area Shaded Band (VAH to VAL) */}
                <rect x="64" y="144" width="676" height="173" fill="rgba(223,192,104,0.032)" />

                {/* VAH Dashed Boundary + Axis Label */}
                <line x1="64" y1="144" x2="740" y2="144" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="4 6" />
                <text x="738" y="136" textAnchor="end" className="fill-white/45 text-[10px] font-mono tracking-[0.16em]">VAH</text>

                {/* VAL Dashed Boundary + Axis Label */}
                <line x1="64" y1="317" x2="740" y2="317" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="4 6" />
                <text x="738" y="332" textAnchor="end" className="fill-white/45 text-[10px] font-mono tracking-[0.16em]">VAL</text>

                {/* High-Resolution Volume Profile Histogram */}
                {VP_BARS.map((bar) => (
                    <rect
                        key={bar.y}
                        x="64"
                        y={bar.y}
                        width={bar.w}
                        height="17"
                        rx="3"
                        fill={
                            bar.zone === "poc"
                                ? "url(#vp-poc)"
                                : bar.zone === "va"
                                  ? "url(#vp-va)"
                                  : "url(#vp-outer)"
                        }
                    />
                ))}

                {/* Pure GPU Shimmer Gliding Across POC Liquidity Bar */}
                <g clipPath="url(#vp-poc-clip)">
                    <rect
                        x="64"
                        y="222"
                        width="110"
                        height="17"
                        fill="rgba(255,255,255,0.45)"
                        className="pillar-sweep"
                    />
                </g>

                {/* Extended POC Equilibrium Line + Integrated Callout */}
                <line
                    x1="496"
                    y1="230.5"
                    x2="740"
                    y2="230.5"
                    stroke="rgba(223,192,104,0.55)"
                    strokeWidth="1.2"
                    strokeDasharray="3 5"
                />
                <text x="738" y="222" textAnchor="end" className="fill-[#dfc068] text-[10px] font-mono font-semibold tracking-[0.18em]">
                    POC
                </text>

                {/* Subtle Background OHLCV Candlesticks */}
                <g opacity="0.55">
                    {CANDLES.map((c) => {
                        const top = Math.min(c.o, c.c);
                        const bodyH = Math.max(6, Math.abs(c.c - c.o));
                        return (
                            <g key={c.x}>
                                <line
                                    x1={c.x}
                                    y1={c.hi}
                                    x2={c.x}
                                    y2={c.lo}
                                    stroke={c.up ? "rgba(223,192,104,0.45)" : "rgba(255,255,255,0.25)"}
                                    strokeWidth="1.1"
                                />
                                <rect
                                    x={c.x - 4.5}
                                    y={top}
                                    width="9"
                                    height={bodyH}
                                    rx="1.5"
                                    fill={c.up ? "rgba(223,192,104,0.34)" : "rgba(255,255,255,0.14)"}
                                    stroke={c.up ? "rgba(223,192,104,0.6)" : "rgba(255,255,255,0.28)"}
                                    strokeWidth="0.9"
                                />
                            </g>
                        );
                    })}
                </g>

                {/* Structural Price Action Breakout Trajectory */}
                <path
                    d={trajectoryPath}
                    fill="none"
                    stroke="url(#vp-price-line)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                />

                {/* POC Equilibrium Reclaim Anchor */}
                <circle cx="566" cy="230.5" r="4.2" fill="#070706" stroke="#dfc068" strokeWidth="2" />

                {/* Breakout Apex Structural Node */}
                <g transform="translate(728, 118)">
                    <circle cx="0" cy="0" r="14" fill="rgba(223,192,104,0.1)" stroke="rgba(223,192,104,0.45)" strokeWidth="1" className="pillar-breathe" />
                    <circle cx="0" cy="0" r="4.2" fill="#ffffff" />
                </g>
            </svg>
        </div>
    );
}

const COHORT_BARS = [
    { x: 118, h: 36 },
    { x: 170, h: 48 },
    { x: 222, h: 64 },
    { x: 274, h: 78 },
    { x: 326, h: 102 },
    { x: 378, h: 122 },
    { x: 430, h: 148 },
    { x: 482, h: 176 },
    { x: 534, h: 204 },
    { x: 586, h: 236 },
    { x: 638, h: 268 },
    { x: 690, h: 296 },
] as const;

/**
 * 03. Growth & Advertising — Compounding Acquisition & Retention Telemetry
 */
function CompoundingCurveCanvas() {
    const primaryCurve =
        "M 112 378 C 235 370, 355 304, 474 222 C 562 162, 636 126, 704 106";
    const areaPath = `${primaryCurve} L 704 402 L 112 402 Z`;
    const baselineCurve = "M 112 388 C 285 372, 488 318, 704 238";

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Warm Golden Radial Bloom */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_62%_50%_at_68%_46%,rgba(218,188,100,0.16)_0%,rgba(218,188,100,0.04)_50%,transparent_76%)]"
            />

            {/* Integrated Instrument Readouts */}
            <div className="absolute top-5 inset-x-6 flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.18em] uppercase text-white/50 z-20 pointer-events-none">
                <span>AGENCYGROW · GA4 TELEMETRY</span>
                <span className="text-[#dfc068]/90 tabular-nums">6m 44s AVG SESSION</span>
            </div>

            <div className="absolute bottom-5 inset-x-6 flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.18em] uppercase text-white/45 z-20 pointer-events-none">
                <span>GOOGLE & META ADS</span>
                <span>28D VERIFIED ATTRIBUTION</span>
            </div>

            <svg
                viewBox="0 0 800 500"
                className="w-full h-full relative z-10"
                aria-label="Compounding Growth Curve and Retention Telemetry Visualization"
            >
                <defs>
                    <linearGradient id="g-area" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(223,192,104,0.22)" />
                        <stop offset="65%" stopColor="rgba(223,192,104,0.05)" />
                        <stop offset="100%" stopColor="rgba(223,192,104,0)" />
                    </linearGradient>
                    <linearGradient id="g-bar" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.11)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.015)" />
                    </linearGradient>
                    <linearGradient id="g-stroke" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                        <stop offset="35%" stopColor="rgba(223,192,104,0.84)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.98)" />
                    </linearGradient>
                    <clipPath id="g-area-clip">
                        <path d={areaPath} />
                    </clipPath>
                </defs>

                {/* Horizontal Scale Gridlines & Y-Axis Ticks */}
                {[
                    { y: 120, label: "89K+" },
                    { y: 214, label: "55K" },
                    { y: 308, label: "25K" },
                ].map((row) => (
                    <g key={row.y}>
                        <line
                            x1="104"
                            y1={row.y}
                            x2="716"
                            y2={row.y}
                            stroke="rgba(255,255,255,0.07)"
                            strokeWidth="1"
                            strokeDasharray="3 7"
                        />
                        <text
                            x="92"
                            y={row.y + 3.5}
                            textAnchor="end"
                            className="fill-white/38 text-[10px] font-mono tabular-nums"
                        >
                            {row.label}
                        </text>
                    </g>
                ))}

                {/* Base X-Axis Hairline */}
                <line x1="104" y1="402" x2="716" y2="402" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />

                {/* Subtle Rising Cohort Volume Bars */}
                {COHORT_BARS.map((bar) => (
                    <rect
                        key={bar.x}
                        x={bar.x}
                        y={402 - bar.h}
                        width="18"
                        height={bar.h}
                        rx="2"
                        fill="url(#g-bar)"
                    />
                ))}

                {/* Compounding Gradient Area Fill + Pure GPU Light Sweep */}
                <path d={areaPath} fill="url(#g-area)" />
                <g clipPath="url(#g-area-clip)">
                    <rect
                        x="104"
                        y="96"
                        width="130"
                        height="310"
                        fill="rgba(223,192,104,0.12)"
                        className="pillar-sweep"
                    />
                </g>

                {/* Linear Baseline Comparison */}
                <path
                    d={baselineCurve}
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1.5"
                    strokeDasharray="5 6"
                    strokeLinecap="round"
                />

                {/* Primary Luminous Compounding Curve */}
                <path
                    d={primaryCurve}
                    fill="none"
                    stroke="url(#g-stroke)"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                />

                {/* Milestone 1 Drop-Line + Node */}
                <line x1="286" y1="336" x2="286" y2="402" stroke="rgba(223,192,104,0.24)" strokeWidth="1" strokeDasharray="2 4" />
                <circle cx="286" cy="336" r="5" fill="#070706" stroke="#dfc068" strokeWidth="2" />
                <text x="286" y="316" textAnchor="middle" className="fill-white/55 text-[10px] font-mono tracking-[0.14em]">
                    W2 · AUDIT
                </text>

                {/* Milestone 2 Drop-Line + Node */}
                <line x1="486" y1="214" x2="486" y2="402" stroke="rgba(223,192,104,0.28)" strokeWidth="1" strokeDasharray="2 4" />
                <circle cx="486" cy="214" r="5.5" fill="#070706" stroke="#dfc068" strokeWidth="2" />
                <text x="486" y="192" textAnchor="middle" className="fill-white/75 text-[10px] font-mono tracking-[0.14em] tabular-nums">
                    1.3M EVENTS
                </text>

                {/* Apex Milestone Node + Breathing Halo */}
                <line x1="704" y1="106" x2="704" y2="402" stroke="rgba(223,192,104,0.35)" strokeWidth="1" strokeDasharray="2 4" />
                <g transform="translate(704, 106)">
                    <circle cx="0" cy="0" r="16" fill="rgba(223,192,104,0.1)" stroke="rgba(223,192,104,0.45)" strokeWidth="1" className="pillar-breathe" />
                    <circle cx="0" cy="0" r="5.5" fill="#070706" stroke="#dfc068" strokeWidth="2.2" />
                </g>
                <text x="692" y="84" textAnchor="end" className="fill-white text-[11px] font-mono font-semibold tracking-[0.14em] tabular-nums">
                    89K+ USERS
                </text>
            </svg>
        </div>
    );
}
