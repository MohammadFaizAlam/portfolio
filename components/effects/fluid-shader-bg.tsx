"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    type FluidShaderSectionVariant,
    getFluidShaderConfig,
    computeShaderBufferSize,
} from "@/lib/portfolio-enhancements";

interface FluidShaderBackgroundProps {
    variant: FluidShaderSectionVariant;
    paused?: boolean;
    className?: string;
}

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/**
 * Domain-warped liquid silk / smoky mist fragment shader inspired by consulting.com.
 * Outputs premultiplied alpha so the fluid folds blend seamlessly into bg-background
 * in both Dark Mode (oklch(0.145 0 0)) and Light Mode (oklch(1 0 0)).
 */
const FRAGMENT_SHADER_SOURCE = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_seed;
uniform float u_rotation;
uniform float u_scale;
uniform float u_swirl;
uniform float u_distortion;
uniform float u_maxOpacity;
uniform float u_isLight;
uniform vec2 u_centerOffset;

mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = v_uv - 0.5 - u_centerOffset;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    uv.x *= aspect;

    // Apply section-specific architectural angle and scale
    vec2 p = rotate2d(u_rotation) * uv * (u_scale * 3.6);

    // Deterministic phase offset that preserves organic S-curve symmetry near the center
    p += vec2(sin(u_seed) * 0.65, cos(u_seed * 1.3) * 0.55);

    float t = u_time;

    // 5-octave iterative domain warping (consulting.com "Mist" / "Plasma" liquid silk folds)
    for (int i = 0; i < 5; i++) {
        float fi = float(i) + 1.0;
        vec2 warp = vec2(
            sin(p.y * (1.35 + fi * 0.22) + t * (0.82 + fi * 0.07) + u_seed + fi * 1.15),
            cos(p.x * (1.25 + fi * 0.24) - t * (0.74 + fi * 0.06) + u_seed * 0.8 + fi * 1.85)
        );
        p += (u_swirl / (fi * 0.92)) * warp;
        p += u_distortion * vec2(
            cos(p.x * 2.1 - p.y * 1.7 + t * 0.48),
            sin(p.y * 2.0 + p.x * 1.5 - t * 0.42)
        );
    }

    // Dual cross-folded volumetric silk ribbons + soft interference mist
    float waveA = sin(p.x * 1.25 + p.y * 0.90 + t * 0.32);
    float waveB = cos(p.y * 1.40 - p.x * 1.05 - t * 0.26);

    float foldPrimary = 1.0 - abs(sin(p.x * 0.95 - p.y * 0.82 + waveA * 0.92));
    float foldSecondary = 1.0 - abs(cos(p.y * 0.88 + p.x * 0.64 - waveB * 0.78));

    float crestPrimary = pow(clamp(foldPrimary, 0.0, 1.0), 2.8);
    float crestSecondary = pow(clamp(foldSecondary, 0.0, 1.0), 3.4) * 0.65;
    float silkCrest = clamp(crestPrimary + crestSecondary * (1.0 - crestPrimary * 0.5), 0.0, 1.0);

    float softMist = smoothstep(-0.55, 0.85, waveA * 0.52 + waveB * 0.48);

    // Combine broad atmospheric mist with luminous silk fold highlights
    float fluidField = mix(softMist * 0.38, 1.0, silkCrest * 0.90);

    // Smooth radial + vertical envelope so edges fade to 0% before section boundaries
    float radialDist = length((v_uv - 0.5 - u_centerOffset * 0.4) * vec2(1.02, 1.12));
    float radialMask = 1.0 - smoothstep(0.16, 0.78, radialDist);
    float verticalMask = smoothstep(0.0, 0.18, v_uv.y) * smoothstep(1.0, 0.82, v_uv.y);
    float envelope = radialMask * verticalMask;

    // Sub-pixel dithering to eliminate 8-bit Mach banding in subtle dark gradients
    float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;

    float alpha = clamp(fluidField * envelope * u_maxOpacity + dither, 0.0, 1.0);

    // Theme-harmonized palette:
    // Dark mode: obsidian-graphite shadow folds -> platinum-ivory & subtle warm champagne silk crests
    vec3 darkShadow = vec3(0.22, 0.22, 0.24);
    vec3 darkMid = vec3(0.75, 0.74, 0.72);
    vec3 darkCrest = vec3(0.95, 0.92, 0.86);
    vec3 darkColor = mix(darkShadow, mix(darkMid, darkCrest, silkCrest), clamp(fluidField, 0.0, 1.0));

    // Light mode: architectural stone & warm pewter-graphite silk folds over white
    vec3 lightShadow = vec3(0.58, 0.58, 0.62);
    vec3 lightCrest = vec3(0.22, 0.22, 0.25);
    vec3 lightColor = mix(lightShadow, lightCrest, silkCrest);

    vec3 finalRgb = mix(darkColor, lightColor, u_isLight);

    // Premultiplied alpha output
    gl_FragColor = vec4(finalRgb * alpha, alpha);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

export function FluidShaderBackground({ variant, paused = false, className }: FluidShaderBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { resolvedTheme } = useTheme();
    const prefersReducedMotion = useReducedMotion() ?? false;
    const isLightRef = useRef(resolvedTheme === "light" ? 1 : 0);
    const pausedRef = useRef(paused);
    const syncRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        isLightRef.current = resolvedTheme === "light" ? 1 : 0;
        syncRef.current?.();
    }, [resolvedTheme]);

    useEffect(() => {
        pausedRef.current = paused;
        syncRef.current?.();
    }, [paused]);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const config = getFluidShaderConfig(variant);

        const gl = canvas.getContext("webgl", {
            alpha: true,
            premultipliedAlpha: true,
            antialias: false,
            depth: false,
            stencil: false,
            powerPreference: "low-power",
            preserveDrawingBuffer: false,
        });

        if (!gl) return;

        const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
        const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.deleteProgram(program);
            return;
        }

        gl.useProgram(program);

        // Fullscreen quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,
                 1, -1,
                -1,  1,
                -1,  1,
                 1, -1,
                 1,  1,
            ]),
            gl.STATIC_DRAW
        );

        const posLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(posLocation);
        gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

        const uResolution = gl.getUniformLocation(program, "u_resolution");
        const uTime = gl.getUniformLocation(program, "u_time");
        const uSeed = gl.getUniformLocation(program, "u_seed");
        const uRotation = gl.getUniformLocation(program, "u_rotation");
        const uScale = gl.getUniformLocation(program, "u_scale");
        const uSwirl = gl.getUniformLocation(program, "u_swirl");
        const uDistortion = gl.getUniformLocation(program, "u_distortion");
        const uMaxOpacity = gl.getUniformLocation(program, "u_maxOpacity");
        const uIsLight = gl.getUniformLocation(program, "u_isLight");
        const uCenterOffset = gl.getUniformLocation(program, "u_centerOffset");

        // Static uniforms per section
        const rotationRad = (config.rotationDeg * Math.PI) / 180;
        gl.uniform1f(uSeed, config.seed);
        gl.uniform1f(uRotation, rotationRad);
        gl.uniform1f(uScale, config.scale);
        gl.uniform1f(uSwirl, config.swirl);
        gl.uniform1f(uDistortion, config.distortion);
        gl.uniform2f(uCenterOffset, config.centerOffset[0], config.centerOffset[1]);

        let bufferWidth = 320;
        let bufferHeight = 200;
        let isDisposed = false;

        const updateSize = () => {
            if (isDisposed) return;
            const rect = container.getBoundingClientRect();
            const next = computeShaderBufferSize(rect.width || 1280, rect.height || 720, 0.35, 480);
            if (canvas.width !== next.width || canvas.height !== next.height) {
                canvas.width = next.width;
                canvas.height = next.height;
                bufferWidth = next.width;
                bufferHeight = next.height;
                gl.viewport(0, 0, bufferWidth, bufferHeight);
            }
        };

        updateSize();

        let rafId: number | null = null;
        let isVisible = false;
        let isDocumentVisible = !document.hidden;
        let accumulatedTime = 0;
        let lastFrameTime = performance.now();

        // Paced ~30fps interval so WebGL leaves ample GPU headroom for 60/120fps scrolling
        const FRAME_INTERVAL_MS = 32;

        const canAnimate = () =>
            !isDisposed && isVisible && isDocumentVisible && !prefersReducedMotion && !pausedRef.current;

        const renderFrame = (now: number, force = false) => {
            if (isDisposed) return;
            const elapsed = now - lastFrameTime;
            if (!force && elapsed < FRAME_INTERVAL_MS) {
                if (canAnimate()) {
                    rafId = requestAnimationFrame((t) => renderFrame(t, false));
                } else {
                    rafId = null;
                }
                return;
            }

            const dt = Math.min(elapsed, 100) * 0.001;
            lastFrameTime = now;
            if (!prefersReducedMotion && !pausedRef.current) {
                accumulatedTime += dt * config.speed;
            }

            const isLight = isLightRef.current;
            const maxOpacity = isLight > 0.5 ? config.lightMaxOpacity : config.darkMaxOpacity;

            gl.useProgram(program);
            gl.uniform2f(uResolution, bufferWidth, bufferHeight);
            gl.uniform1f(uTime, accumulatedTime);
            gl.uniform1f(uIsLight, isLight);
            gl.uniform1f(uMaxOpacity, maxOpacity);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            if (canAnimate()) {
                rafId = requestAnimationFrame((t) => renderFrame(t, false));
            } else {
                rafId = null;
            }
        };

        const startLoop = () => {
            if (isDisposed || rafId !== null) return;
            lastFrameTime = performance.now();
            if (prefersReducedMotion || pausedRef.current) {
                renderFrame(lastFrameTime, true);
                return;
            }
            if (canAnimate()) {
                rafId = requestAnimationFrame((t) => renderFrame(t, true));
            }
        };

        const stopLoop = () => {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        syncRef.current = () => {
            if (isDisposed) return;
            if (canAnimate()) {
                startLoop();
            } else {
                stopLoop();
                renderFrame(performance.now(), true);
            }
        };

        // Render initial frame immediately so there is never an empty flash
        renderFrame(performance.now(), true);

        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;
                isVisible = entry.isIntersecting;
                if (canAnimate()) {
                    startLoop();
                } else {
                    stopLoop();
                }
            },
            { rootMargin: "120px 0px" }
        );
        intersectionObserver.observe(container);

        const resizeObserver = new ResizeObserver(() => {
            if (isDisposed) return;
            updateSize();
            renderFrame(performance.now(), true);
        });
        resizeObserver.observe(container);

        const handleVisibilityChange = () => {
            isDocumentVisible = !document.hidden;
            if (canAnimate()) {
                startLoop();
            } else {
                stopLoop();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });

        return () => {
            isDisposed = true;
            syncRef.current = null;
            stopLoop();
            intersectionObserver.disconnect();
            resizeObserver.disconnect();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            gl.deleteBuffer(positionBuffer);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
        };
    }, [variant, prefersReducedMotion]);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            data-fluid-shader={variant}
            className={cn(
                "pointer-events-none select-none absolute inset-0 overflow-hidden z-0 mask-[linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)]",
                className
            )}
        >
            <canvas
                ref={canvasRef}
                data-paper-shaders="true"
                className="w-full h-full block transform-gpu"
            />
        </div>
    );
}
