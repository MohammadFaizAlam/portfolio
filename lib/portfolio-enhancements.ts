import type { StackItem } from "../types/stack";
import type { ProjectItem, ProjectTrack } from "../types/project";

export interface PillarCardTransform {
    stickyTopOffsetPx: number;
    scale: number;
    dimOpacity: number;
    isStackedUnder: boolean;
}

/**
 * Computes deterministic overlap & stacking transforms for a card in the Three Pillars
 * scrollytelling sequence.
 */
export function computePillarCardTransform(
    cardIndex: number,
    totalCards: number,
    scrollProgress: number,
    reducedMotion = false
): PillarCardTransform {
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    const stepSize = totalCards > 1 ? 1 / totalCards : 1;
    const stickyTopOffsetPx = cardIndex * 44;

    if (reducedMotion || cardIndex >= totalCards - 1) {
        return {
            stickyTopOffsetPx,
            scale: 1,
            dimOpacity: 0,
            isStackedUnder: false,
        };
    }

    const overlapStart = (cardIndex + 0.5) * stepSize;
    const overlapEnd = 1;
    const remainingDepth = totalCards - 1 - cardIndex;

    if (clampedProgress <= overlapStart) {
        return {
            stickyTopOffsetPx,
            scale: 1,
            dimOpacity: 0,
            isStackedUnder: false,
        };
    }

    const rawOverlap = (clampedProgress - overlapStart) / Math.max(0.0001, overlapEnd - overlapStart);
    const overlapFactor = Math.max(0, Math.min(1, rawOverlap));

    const maxScaleReduction = remainingDepth * 0.03;
    const scale = Number((1 - overlapFactor * maxScaleReduction).toFixed(4));
    const dimOpacity = Number((overlapFactor * 0.28).toFixed(4));

    return {
        stickyTopOffsetPx,
        scale,
        dimOpacity,
        isStackedUnder: overlapFactor > 0.05,
    };
}

/**
 * Determines which pillar index (0..totalCards-1) is currently active for the side indicator.
 */
export function getActivePillarIndex(scrollProgress: number, totalCards: number): number {
    if (totalCards <= 1) return 0;
    const clamped = Math.max(0, Math.min(0.9999, scrollProgress));
    return Math.min(totalCards - 1, Math.floor(clamped * totalCards));
}

export type PillarVisualVariant = "orbital" | "volume" | "compounding";

/**
 * Resolves the bespoke dark-glass visualization variant for a given pillar ID or index.
 */
export function getPillarVisualVariant(pillarId: string, index: number = 0): PillarVisualVariant {
    if (pillarId === "systems-engineering") return "orbital";
    if (pillarId === "market-mechanics") return "volume";
    if (pillarId === "growth-advertising") return "compounding";
    if (index === 0) return "orbital";
    if (index === 1) return "volume";
    return "compounding";
}

export type ProjectFilterValue = "all" | ProjectTrack;

/**
 * Filters projects by track ("all" | "engineering" | "growth") without mutating input array.
 */
export function filterProjectsByTrack(
    projects: readonly ProjectItem[],
    filter: ProjectFilterValue
): ProjectItem[] {
    if (filter === "all") return [...projects];
    return projects.filter((project) => project.track === filter);
}

/**
 * Maps horizontal section scroll progress (0..1) to the currently centered project index (0..totalProjects-1).
 */
export function getActiveProjectIndex(scrollProgress: number, totalProjects: number): number {
    if (totalProjects <= 1) return 0;
    const normalized = (scrollProgress - 0.1) / 0.78;
    const clamped = Math.max(0, Math.min(0.9999, normalized));
    return Math.min(totalProjects - 1, Math.floor(clamped * totalProjects));
}

/**
 * Computes the normalized scroll progress (0..1) that centers a specific project index in the horizontal scrollytell reel.
 */
export function getProjectTargetProgress(projectIndex: number, totalProjects: number): number {
    if (totalProjects <= 1) return 0.5;
    const clampedIdx = Math.max(0, Math.min(totalProjects - 1, projectIndex));
    const t = 0.1 + ((clampedIdx + 0.5) / totalProjects) * 0.78;
    return Number(Math.max(0, Math.min(1, t)).toFixed(4));
}

/**
 * Returns the wrapped previous and next project indices for modal case-study navigation.
 */
export function getAdjacentProjectIndices(
    currentIndex: number,
    totalProjects: number
): { prevIndex: number; nextIndex: number } {
    if (totalProjects <= 1) return { prevIndex: 0, nextIndex: 0 };
    const safeCurrent = ((currentIndex % totalProjects) + totalProjects) % totalProjects;
    return {
        prevIndex: (safeCurrent - 1 + totalProjects) % totalProjects,
        nextIndex: (safeCurrent + 1) % totalProjects,
    };
}

/**
 * Returns deterministic asymmetric editorial grid span & proportion classes
 * for the Projects bento showcase based on item position and active count.
 */
export function getProjectBentoClass(index: number, total: number): string {
    if (total <= 1) {
        return "md:col-span-2 lg:col-span-12 min-h-[340px] sm:min-h-[420px] lg:min-h-[480px]";
    }
    if (total === 2) {
        return index === 0
            ? "md:col-span-1 lg:col-span-7 min-h-[340px] sm:min-h-[400px] lg:min-h-[440px]"
            : "md:col-span-1 lg:col-span-5 min-h-[340px] sm:min-h-[400px] lg:min-h-[440px]";
    }
    if (total === 3) {
        if (index === 0) {
            return "md:col-span-2 lg:col-span-12 min-h-[340px] sm:min-h-[420px] lg:min-h-[460px]";
        }
        return index === 1
            ? "md:col-span-1 lg:col-span-7 min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]"
            : "md:col-span-1 lg:col-span-5 min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]";
    }

    // 4+ items: alternating asymmetric editorial pairs (7/5, 5/7, 7/5...)
    const row = Math.floor(index / 2);
    const isLeftInRow = index % 2 === 0;
    const isWide = row % 2 === 0 ? isLeftInRow : !isLeftInRow;

    return isWide
        ? "md:col-span-1 lg:col-span-7 min-h-[330px] sm:min-h-[390px] lg:min-h-[440px]"
        : "md:col-span-1 lg:col-span-5 min-h-[330px] sm:min-h-[390px] lg:min-h-[440px]";
}

export type FluidShaderSectionVariant =
    | "hero"
    | "about"
    | "projects"
    | "pillars"
    | "stack"
    | "roadmap"
    | "contact";

export interface FluidShaderConfig {
    seed: number;
    rotationDeg: number;
    scale: number;
    swirl: number;
    distortion: number;
    speed: number;
    darkMaxOpacity: number;
    lightMaxOpacity: number;
    centerOffset: [number, number];
}

/**
 * Returns gently harmonized WebGL silk shader parameters per section so scrolling
 * produces subtle atmospheric current shifts with zero abrupt spinning or warping.
 */
export function getFluidShaderConfig(variant: FluidShaderSectionVariant): FluidShaderConfig {
    switch (variant) {
        case "hero":
            return {
                seed: 0.80,
                rotationDeg: -26,
                scale: 0.64,
                swirl: 0.86,
                distortion: 0.12,
                speed: 0.15,
                darkMaxOpacity: 0.24,
                lightMaxOpacity: 0.11,
                centerOffset: [-0.07, 0.02],
            };
        case "about":
            return {
                seed: 0.92,
                rotationDeg: -22,
                scale: 0.66,
                swirl: 0.84,
                distortion: 0.12,
                speed: 0.14,
                darkMaxOpacity: 0.20,
                lightMaxOpacity: 0.10,
                centerOffset: [0.03, 0.01],
            };
        case "projects":
            return {
                seed: 1.04,
                rotationDeg: -19,
                scale: 0.67,
                swirl: 0.83,
                distortion: 0.12,
                speed: 0.13,
                darkMaxOpacity: 0.19,
                lightMaxOpacity: 0.10,
                centerOffset: [-0.03, 0.0],
            };
        case "pillars":
            return {
                seed: 1.16,
                rotationDeg: -16,
                scale: 0.66,
                swirl: 0.85,
                distortion: 0.13,
                speed: 0.14,
                darkMaxOpacity: 0.21,
                lightMaxOpacity: 0.10,
                centerOffset: [0.02, -0.02],
            };
        case "stack":
            return {
                seed: 1.28,
                rotationDeg: -14,
                scale: 0.68,
                swirl: 0.84,
                distortion: 0.12,
                speed: 0.13,
                darkMaxOpacity: 0.20,
                lightMaxOpacity: 0.10,
                centerOffset: [0.04, -0.01],
            };
        case "roadmap":
            return {
                seed: 1.40,
                rotationDeg: -18,
                scale: 0.66,
                swirl: 0.85,
                distortion: 0.12,
                speed: 0.14,
                darkMaxOpacity: 0.20,
                lightMaxOpacity: 0.10,
                centerOffset: [-0.02, 0.0],
            };
        case "contact":
            return {
                seed: 1.52,
                rotationDeg: -22,
                scale: 0.69,
                swirl: 0.87,
                distortion: 0.13,
                speed: 0.15,
                darkMaxOpacity: 0.23,
                lightMaxOpacity: 0.11,
                centerOffset: [0.0, 0.03],
            };
    }
}

/**
 * Smoothly interpolates two FluidShaderConfig states for seamless single-context transitions
 * as the visitor scrolls across sections.
 */
export function lerpFluidShaderConfig(
    current: FluidShaderConfig,
    target: FluidShaderConfig,
    alpha: number
): FluidShaderConfig {
    const t = Math.max(0, Math.min(1, alpha));
    const mix = (a: number, b: number) => a + (b - a) * t;

    return {
        seed: mix(current.seed, target.seed),
        rotationDeg: mix(current.rotationDeg, target.rotationDeg),
        scale: mix(current.scale, target.scale),
        swirl: mix(current.swirl, target.swirl),
        distortion: mix(current.distortion, target.distortion),
        speed: mix(current.speed, target.speed),
        darkMaxOpacity: mix(current.darkMaxOpacity, target.darkMaxOpacity),
        lightMaxOpacity: mix(current.lightMaxOpacity, target.lightMaxOpacity),
        centerOffset: [
            mix(current.centerOffset[0], target.centerOffset[0]),
            mix(current.centerOffset[1], target.centerOffset[1]),
        ],
    };
}

/**
 * Computes a bounded low-resolution internal WebGL drawing buffer size so hardware bilinear
 * filtering produces silky gradients at <10% of full-screen Retina GPU fill-rate cost.
 */
export function computeShaderBufferSize(
    cssWidth: number,
    cssHeight: number,
    renderScale = 0.35,
    maxDimension = 480
): { width: number; height: number } {
    const safeW = Math.max(1, Math.floor(cssWidth * renderScale));
    const safeH = Math.max(1, Math.floor(cssHeight * renderScale));
    const peak = Math.max(safeW, safeH);

    if (peak <= maxDimension) {
        return { width: safeW, height: safeH };
    }

    const clampRatio = maxDimension / peak;
    return {
        width: Math.max(1, Math.floor(safeW * clampRatio)),
        height: Math.max(1, Math.floor(safeH * clampRatio)),
    };
}

export interface StackTechMetadata {
    proficiency: string;
    usage: string;
    appliedIn: string;
}

const STACK_DETAILS: Record<string, StackTechMetadata> = {
    "React": {
        proficiency: "Core Production",
        usage: "Component architecture, custom hooks, and stateful simulation interfaces built for responsiveness.",
        appliedIn: "BB84 Quantum · RL Trading Env · Nuvora",
    },
    "Next.js": {
        proficiency: "Primary Framework",
        usage: "App Router architecture, server-rendered routes, metadata optimization, and zero-CLS storefronts.",
        appliedIn: "Nuvora · Portfolio Architecture",
    },
    "Tailwind CSS": {
        proficiency: "Core Production",
        usage: "Design token systems, fluid responsive layouts, and high-contrast dark editorial interfaces.",
        appliedIn: "BB84 Quantum · Nuvora · Portfolio",
    },
    "Bootstrap": {
        proficiency: "Foundational",
        usage: "Rapid responsive prototyping and maintaining legacy client web properties cleanly.",
        appliedIn: "Client Landing Pages & Prototypes",
    },
    "Framer Motion": {
        proficiency: "Advanced Choreography",
        usage: "Scroll-linked transforms, spring physics, shared layoutId transitions, and accessible modal choreography.",
        appliedIn: "Nuvora · Interactive Scrollytelling",
    },
    "TypeScript": {
        proficiency: "Core Production",
        usage: "Strict end-to-end type safety across React UI trees, domain models, and FastAPI payloads.",
        appliedIn: "BB84 Quantum · RL Trading Env · Nuvora",
    },
    "JavaScript": {
        proficiency: "Core Production",
        usage: "Custom 2D canvas visualizations, WebGL shader drivers, pendulum physics, and browser telemetry.",
        appliedIn: "Interactive Engines & Physics Widgets",
    },
    "HTML5": {
        proficiency: "Core Production",
        usage: "Semantic document architecture, ARIA-compliant dialog patterns, and accessible interactive canvases.",
        appliedIn: "All Production Web Systems",
    },
    "CSS3": {
        proficiency: "Core Production",
        usage: "OKLCH token palettes, radial masks, custom scrollbar theming, and GPU-composited transitions.",
        appliedIn: "Editorial UI & Motion Systems",
    },
    "Node.js": {
        proficiency: "Active Workflow",
        usage: "Server-side tooling, build pipelines, data scripts, and asynchronous API integrations.",
        appliedIn: "Full-Stack Tooling & Automation",
    },
    "C": {
        proficiency: "Systems Foundation",
        usage: "Manual memory management, pointer arithmetic, and low-level computer engineering foundations.",
        appliedIn: "SLRTCE Computer Engineering Systems",
    },
    "Python": {
        proficiency: "Quantitative & Backend",
        usage: "FastAPI compute services, BB84 QBER quantum math, and Gymnasium PPO reinforcement learning agents.",
        appliedIn: "BB84 Quantum · RL Trading Env",
    },
    "MySQL": {
        proficiency: "Relational Data",
        usage: "Normalized schema architecture, indexing strategy, and transactional SQL queries.",
        appliedIn: "Relational Web Backends",
    },
    "Git": {
        proficiency: "Daily Workflow",
        usage: "Clean branching workflows, atomic commit history, and disciplined release management.",
        appliedIn: "All Engineering Repositories",
    },
    "Vercel": {
        proficiency: "Deployment & Edge",
        usage: "Automated preview deployments, edge caching, and production hosting for Next.js systems.",
        appliedIn: "Nuvora · Production Frontends",
    },
    "GitHub": {
        proficiency: "Daily Workflow",
        usage: "Open-source repositories, versioned project documentation, and collaborative code reviews.",
        appliedIn: "Open-Source Simulators & Web Apps",
    },
    "Github": {
        proficiency: "Daily Workflow",
        usage: "Open-source repositories, versioned project documentation, and collaborative code reviews.",
        appliedIn: "Open-Source Simulators & Web Apps",
    },
    "Figma": {
        proficiency: "Interface Design",
        usage: "Editorial wireframes, typographic systems, and high-converting acquisition landing pages.",
        appliedIn: "Nuvora · AgencyGrow Storefronts",
    },
};

export function getStackItemDetails(item: StackItem): StackTechMetadata {
    const match = STACK_DETAILS[item.name];
    if (match) {
        return {
            proficiency: item.proficiency || match.proficiency,
            usage: item.usage || match.usage,
            appliedIn: item.appliedIn || match.appliedIn,
        };
    }

    return {
        proficiency: item.proficiency || "Active Workflow",
        usage: item.usage || `Production implementation and architecture with ${item.name}.`,
        appliedIn: item.appliedIn || "Production Engineering",
    };
}
