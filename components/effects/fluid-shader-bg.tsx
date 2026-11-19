"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    type FluidShaderSectionVariant,
    type FluidShaderConfig,
    getFluidShaderConfig,
    lerpFluidShaderConfig,
    computeShaderBufferSize,
} from "@/lib/portfolio-enhancements";

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/**
 * Single-context domain-warped liquid silk fragment shader.
 * Smoothly interpolates seed, rotation, scale, swirl, distortion, opacity, and focal offset
 * across portfolio sections so there is zero visual seam and only 1 WebGL context site-wide.
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
uniform float u_scrollDrift;

mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = v_uv - 0.5 - u_centerOffset;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    uv.x *= aspect;

    // Subtle parallax drift coupled to document scroll for calm tactile continuity
    uv.y += u_scrollDrift * 0.055;

    vec2 p = rotate2d(u_rotation) * uv * (u_scale * 3.45);
    p += vec2(sin(u_seed) * 0.42, cos(u_seed * 1.15) * 0.36);

    float t = u_time;

    // 4-octave iterative domain warping for organic liquid-silk folds with 20% lower ALU cost
    for (int i = 0; i < 4; i++) {
        float fi = float(i) + 1.0;
        vec2 warp = vec2(
            sin(p.y * (1.28 + fi * 0.20) + t * (0.72 + fi * 0.06) + u_seed * 0.65 + fi * 1.12),
            cos(p.x * (1.20 + fi * 0.22) - t * (0.64 + fi * 0.05) + u_seed * 0.55 + fi * 1.78)
        );
        p += (u_swirl / (fi * 0.96)) * warp;
        p += u_distortion * vec2(
            cos(p.x * 1.95 - p.y * 1.60 + t * 0.38),
            sin(p.y * 1.85 + p.x * 1.45 - t * 0.34)
        );
    }

    float waveA = sin(p.x * 1.25 + p.y * 0.90 + t * 0.32);
    float waveB = cos(p.y * 1.40 - p.x * 1.05 - t * 0.26);

    float foldPrimary = 1.0 - abs(sin(p.x * 0.95 - p.y * 0.82 + waveA * 0.92));
    float foldSecondary = 1.0 - abs(cos(p.y * 0.88 + p.x * 0.64 - waveB * 0.78));

    float crestPrimary = pow(clamp(foldPrimary, 0.0, 1.0), 2.8);
    float crestSecondary = pow(clamp(foldSecondary, 0.0, 1.0), 3.4) * 0.65;
    float silkCrest = clamp(crestPrimary + crestSecondary * (1.0 - crestPrimary * 0.5), 0.0, 1.0);

    float softMist = smoothstep(-0.55, 0.85, waveA * 0.52 + waveB * 0.48);
    float fluidField = mix(softMist * 0.38, 1.0, silkCrest * 0.90);

    // Smooth radial envelope so the silk breathes naturally around focal content
    float radialDist = length((v_uv - 0.5 - u_centerOffset * 0.42) * vec2(0.96, 1.08));
    float radialMask = 1.0 - smoothstep(0.18, 0.84, radialDist);

    // Sub-pixel dithering to eliminate 8-bit Mach banding in deep dark gradients
    float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;

    float alpha = clamp(fluidField * radialMask * u_maxOpacity + dither, 0.0, 1.0);

    // Dark mode: obsidian-graphite shadow folds -> platinum-ivory & subtle warm champagne silk crests
    vec3 darkShadow = vec3(0.22, 0.22, 0.24);
    vec3 darkMid = vec3(0.75, 0.74, 0.72);
    vec3 darkCrest = vec3(0.96, 0.93, 0.87);
    vec3 darkColor = mix(darkShadow, mix(darkMid, darkCrest, silkCrest), clamp(fluidField, 0.0, 1.0));

    // Light mode: architectural stone & pewter-graphite silk folds
    vec3 lightShadow = vec3(0.58, 0.58, 0.62);
    vec3 lightCrest = vec3(0.22, 0.22, 0.25);
    vec3 lightColor = mix(lightShadow, lightCrest, silkCrest);

    vec3 finalRgb = mix(darkColor, lightColor, u_isLight);

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

const VALID_VARIANTS = new Set<FluidShaderSectionVariant>([
    "hero",
    "about",
    "projects",
    "pillars",
    "stack",
    "roadmap",
    "contact",
]);

function isSoftwareWebGL(gl: WebGLRenderingContext): boolean {
    try {
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        if (!ext) return false;
        const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "");
        return /SwiftShader|llvmpipe|Software|Mesa/i.test(renderer);
    } catch {
        return false;
    }
}

export function UnifiedFluidShader({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { resolvedTheme } = useTheme();
    const prefersReducedMotion = useReducedMotion() ?? false;
    const isLightRef = useRef(resolvedTheme === "light" ? 1 : 0);

    useEffect(() => {
        isLightRef.current = resolvedTheme === "light" ? 1 : 0;
    }, [resolvedTheme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

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

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
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
        const uScrollDrift = gl.getUniformLocation(program, "u_scrollDrift");

        const softwareGl = isSoftwareWebGL(gl);
        const renderScale = softwareGl ? 0.2 : 0.3;
        const maxDim = softwareGl ? 280 : 420;
        // ~30fps on GPU with hardware bilinear filtering for whisper-light GPU cost and ultra-soft silk
        const frameIntervalMs = softwareGl ? 180 : 33;

        let bufferWidth = 320;
        let bufferHeight = 200;
        let isDisposed = false;
        let rafId: number | null = null;
        let isDocumentVisible = !document.hidden;
        let accumulatedTime = 0;
        let lastFrameTime = performance.now();

        let currentConfig: FluidShaderConfig = getFluidShaderConfig("hero");
        let targetConfig: FluidShaderConfig = getFluidShaderConfig("hero");
        let smoothScrollDrift = 0;
        let targetScrollDrift = 0;

        const updateSize = () => {
            if (isDisposed) return;
            const next = computeShaderBufferSize(window.innerWidth || 1280, window.innerHeight || 720, renderScale, maxDim);
            if (canvas.width !== next.width || canvas.height !== next.height) {
                canvas.width = next.width;
                canvas.height = next.height;
                bufferWidth = next.width;
                bufferHeight = next.height;
                gl.viewport(0, 0, bufferWidth, bufferHeight);
            }
        };

        const resolveActiveSection = () => {
            const sections = document.querySelectorAll<HTMLElement>("[data-shader-section]");
            const viewportMid = window.innerHeight * 0.48;
            let matched: FluidShaderSectionVariant = "hero";

            for (const el of sections) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= viewportMid && rect.bottom >= viewportMid * 0.35) {
                    const attr = el.dataset.shaderSection as FluidShaderSectionVariant | undefined;
                    if (attr && VALID_VARIANTS.has(attr)) {
                        matched = attr;
                    }
                }
            }

            targetConfig = getFluidShaderConfig(matched);
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            targetScrollDrift = (window.scrollY / maxScroll) * 2 - 1;
        };

        updateSize();
        resolveActiveSection();

        const drawFrame = (now: number, force = false) => {
            if (isDisposed) return;
            const elapsed = now - lastFrameTime;

            if (!force && elapsed < frameIntervalMs) {
                if (!prefersReducedMotion && isDocumentVisible) {
                    rafId = requestAnimationFrame((t) => drawFrame(t, false));
                } else {
                    rafId = null;
                }
                return;
            }

            const dt = Math.min(elapsed, 100) * 0.001;
            lastFrameTime = now;

            if (!prefersReducedMotion) {
                // Slow, viscous exponential damping so silk currents glide naturally across sections
                const blendAlpha = 1 - Math.exp(-dt * 0.68);
                currentConfig = lerpFluidShaderConfig(currentConfig, targetConfig, blendAlpha);
                smoothScrollDrift += (targetScrollDrift - smoothScrollDrift) * (1 - Math.exp(-dt * 1.65));
                accumulatedTime += dt * currentConfig.speed;
            } else {
                currentConfig = targetConfig;
                smoothScrollDrift = targetScrollDrift;
            }

            const isLight = isLightRef.current;
            const maxOpacity = isLight > 0.5 ? currentConfig.lightMaxOpacity : currentConfig.darkMaxOpacity;
            const rotationRad = (currentConfig.rotationDeg * Math.PI) / 180;

            gl.useProgram(program);
            gl.uniform2f(uResolution, bufferWidth, bufferHeight);
            gl.uniform1f(uTime, accumulatedTime);
            gl.uniform1f(uSeed, currentConfig.seed);
            gl.uniform1f(uRotation, rotationRad);
            gl.uniform1f(uScale, currentConfig.scale);
            gl.uniform1f(uSwirl, currentConfig.swirl);
            gl.uniform1f(uDistortion, currentConfig.distortion);
            gl.uniform1f(uMaxOpacity, maxOpacity);
            gl.uniform1f(uIsLight, isLight);
            gl.uniform2f(uCenterOffset, currentConfig.centerOffset[0], currentConfig.centerOffset[1]);
            gl.uniform1f(uScrollDrift, smoothScrollDrift);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            if (!prefersReducedMotion && isDocumentVisible && !isDisposed) {
                rafId = requestAnimationFrame((t) => drawFrame(t, false));
            } else {
                rafId = null;
            }
        };

        const startLoop = () => {
            if (isDisposed || rafId !== null) return;
            lastFrameTime = performance.now();
            if (prefersReducedMotion) {
                drawFrame(lastFrameTime, true);
                return;
            }
            if (isDocumentVisible) {
                rafId = requestAnimationFrame((t) => drawFrame(t, true));
            }
        };

        const stopLoop = () => {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        // Render initial frame immediately so first paint is lush with zero flash
        drawFrame(performance.now(), true);
        if (!prefersReducedMotion) {
            startLoop();
        }

        const handleScroll = () => {
            resolveActiveSection();
            if (prefersReducedMotion) {
                drawFrame(performance.now(), true);
            }
        };

        const handleResize = () => {
            updateSize();
            resolveActiveSection();
            drawFrame(performance.now(), true);
        };

        const handleVisibilityChange = () => {
            isDocumentVisible = !document.hidden;
            if (isDocumentVisible && !prefersReducedMotion) {
                startLoop();
            } else {
                stopLoop();
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });
        document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });

        return () => {
            isDisposed = true;
            stopLoop();
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            gl.deleteBuffer(positionBuffer);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
        };
    }, [prefersReducedMotion]);

    return (
        <div
            aria-hidden="true"
            data-testid="unified-fluid-shader"
            className={cn(
                "pointer-events-none select-none fixed inset-0 z-0 overflow-hidden",
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
