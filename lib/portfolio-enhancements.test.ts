import test from "node:test";
import assert from "node:assert/strict";
import {
    computePillarCardTransform,
    getActivePillarIndex,
    getPillarVisualVariant,
    filterProjectsByTrack,
    getActiveProjectIndex,
    getProjectTargetProgress,
    getAdjacentProjectIndices,
    getStackItemDetails,
    getFluidShaderConfig,
    lerpFluidShaderConfig,
    computeShaderBufferSize,
    getProjectBentoClass,
} from "./portfolio-enhancements";
import type { ProjectItem } from "../types/project";

const SAMPLE_PROJECTS: ProjectItem[] = [
    {
        id: "1",
        title: "BB84 Quantum",
        category: "Quantum Simulation",
        track: "engineering",
        year: "2026",
        impact: "Real-time QBER",
        role: "Architect",
        challenge: "Challenge",
        architecture: "Arch",
        outcome: "Outcome",
        highlights: [],
        description: "Desc",
        image: "/a.jpg",
    },
    {
        id: "2",
        title: "UK Roofing Ads",
        category: "Paid Acquisition",
        track: "growth",
        year: "2025",
        impact: "Lower CPL",
        role: "Strategist",
        challenge: "Challenge",
        architecture: "Arch",
        outcome: "Outcome",
        highlights: [],
        description: "Desc",
        image: "/b.jpg",
    },
];

test("getPillarVisualVariant maps each pillar to its architectural dark-glass canvas", () => {
    assert.equal(getPillarVisualVariant("systems-engineering", 0), "orbital");
    assert.equal(getPillarVisualVariant("market-mechanics", 1), "volume");
    assert.equal(getPillarVisualVariant("growth-advertising", 2), "compounding");
    assert.equal(getPillarVisualVariant("custom-id", 1), "volume");
});

test("getFluidShaderConfig returns smoothly harmonized parameters with zero abrupt spins", () => {
    const ordered = [
        getFluidShaderConfig("hero"),
        getFluidShaderConfig("about"),
        getFluidShaderConfig("projects"),
        getFluidShaderConfig("pillars"),
        getFluidShaderConfig("stack"),
        getFluidShaderConfig("roadmap"),
        getFluidShaderConfig("contact"),
    ];

    for (let i = 1; i < ordered.length; i++) {
        const rotDelta = Math.abs(ordered[i].rotationDeg - ordered[i - 1].rotationDeg);
        const seedDelta = Math.abs(ordered[i].seed - ordered[i - 1].seed);
        assert.ok(rotDelta <= 6, `Adjacent rotation delta too sharp: ${rotDelta}`);
        assert.ok(seedDelta > 0 && seedDelta <= 0.2, `Adjacent seed delta too sharp: ${seedDelta}`);
    }

    assert.ok(ordered[0].darkMaxOpacity > 0 && ordered[0].darkMaxOpacity <= 0.3);
    assert.ok(ordered[6].lightMaxOpacity > 0 && ordered[6].lightMaxOpacity <= 0.2);
});

test("getProjectBentoClass creates asymmetric editorial spans for 6-item and 3-item tracks", () => {
    assert.ok(getProjectBentoClass(0, 6).includes("lg:col-span-7"));
    assert.ok(getProjectBentoClass(1, 6).includes("lg:col-span-5"));
    assert.ok(getProjectBentoClass(2, 6).includes("lg:col-span-5"));
    assert.ok(getProjectBentoClass(3, 6).includes("lg:col-span-7"));

    assert.ok(getProjectBentoClass(0, 3).includes("lg:col-span-12"));
    assert.ok(getProjectBentoClass(1, 3).includes("lg:col-span-7"));
    assert.ok(getProjectBentoClass(2, 3).includes("lg:col-span-5"));
});

test("lerpFluidShaderConfig smoothly blends shader configs for single-context transitions", () => {
    const hero = getFluidShaderConfig("hero");
    const contact = getFluidShaderConfig("contact");

    const atStart = lerpFluidShaderConfig(hero, contact, 0);
    assert.deepEqual(atStart, hero);

    const atEnd = lerpFluidShaderConfig(hero, contact, 1);
    assert.deepEqual(atEnd, contact);

    const mid = lerpFluidShaderConfig(hero, contact, 0.5);
    assert.equal(mid.rotationDeg, (hero.rotationDeg + contact.rotationDeg) / 2);
    assert.equal(mid.centerOffset[0], (hero.centerOffset[0] + contact.centerOffset[0]) / 2);
});

test("computeShaderBufferSize scales and caps WebGL buffer dimensions for low GPU fill-rate", () => {
    const desktop = computeShaderBufferSize(1440, 900, 0.35, 480);
    assert.ok(desktop.width <= 480 && desktop.height <= 480);
    assert.ok(desktop.width > 200 && desktop.height > 150);

    const ultrawide = computeShaderBufferSize(3840, 2160, 0.35, 480);
    assert.equal(ultrawide.width, 480);
    assert.equal(ultrawide.height, 270);
});

test("filterProjectsByTrack filters cleanly across all, engineering, and growth tracks", () => {
    assert.equal(filterProjectsByTrack(SAMPLE_PROJECTS, "all").length, 2);
    const eng = filterProjectsByTrack(SAMPLE_PROJECTS, "engineering");
    assert.equal(eng.length, 1);
    assert.equal(eng[0].title, "BB84 Quantum");

    const growth = filterProjectsByTrack(SAMPLE_PROJECTS, "growth");
    assert.equal(growth.length, 1);
    assert.equal(growth[0].title, "UK Roofing Ads");
});

test("getProjectTargetProgress round-trips accurately with getActiveProjectIndex", () => {
    for (let i = 0; i < 6; i++) {
        const progress = getProjectTargetProgress(i, 6);
        assert.equal(getActiveProjectIndex(progress, 6), i);
    }
});

test("computePillarCardTransform progressively scales down and dims earlier cards as later cards overlap", () => {
    const startTransform = computePillarCardTransform(0, 3, 0, false);
    assert.equal(startTransform.scale, 1);
    assert.equal(startTransform.dimOpacity, 0);

    const midTransform = computePillarCardTransform(0, 3, 0.6, false);
    const endTransform = computePillarCardTransform(0, 3, 1, false);

    assert.ok(midTransform.scale < 1);
    assert.ok(endTransform.scale < midTransform.scale);
    assert.ok(endTransform.dimOpacity > 0);
    assert.equal(endTransform.isStackedUnder, true);

    const reduced = computePillarCardTransform(0, 3, 0.9, true);
    assert.equal(reduced.scale, 1);
    assert.equal(reduced.dimOpacity, 0);
});

test("getActivePillarIndex and getAdjacentProjectIndices resolve navigation accurately", () => {
    assert.equal(getActivePillarIndex(0, 3), 0);
    assert.equal(getActivePillarIndex(0.45, 3), 1);
    assert.equal(getActivePillarIndex(0.95, 3), 2);

    const adjFirst = getAdjacentProjectIndices(0, 6);
    assert.equal(adjFirst.prevIndex, 5);
    assert.equal(adjFirst.nextIndex, 1);
});

test("getStackItemDetails returns English proficiency, usage, and appliedIn proof", () => {
    const react = getStackItemDetails({ name: "React", icon: "/stack/react.svg" });
    assert.equal(react.proficiency, "Core Production");
    assert.ok(react.appliedIn.includes("BB84 Quantum"));

    const github = getStackItemDetails({ name: "GitHub", icon: "/stack/github.svg" });
    assert.equal(github.proficiency, "Daily Workflow");
});
