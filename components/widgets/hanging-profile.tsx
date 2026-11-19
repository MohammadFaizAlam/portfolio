"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";

export function HangingProfile() {
  const boxRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<SVGLineElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wakePhysicsRef = useRef<(() => void) | null>(null);
  const cleanupDragRef = useRef<(() => void) | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const gravity = 1950; // px/s^2 for crisp, tactile physical weight
  const ropeLength = 164;
  const dampingPerSecond = 0.76;

  const state = useRef({
    angle: 0.14, // gentle initial sway so visitors discover the interactive physics
    velocity: 0,
    isDragging: false,
    dragX: 0,
    dragY: 0,
    currentLength: ropeLength,
  });

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      state.current.angle = 0;
    }

    let animationFrameId = 0;
    let isVisible = false;
    let lastTime = performance.now();

    const applyTransform = () => {
      if (!boxRef.current || !ropeRef.current) return;
      const x = state.current.currentLength * Math.sin(state.current.angle);
      const y = state.current.currentLength * Math.cos(state.current.angle);

      ropeRef.current.setAttribute("x2", (150 + x).toFixed(2));
      ropeRef.current.setAttribute("y2", y.toFixed(2));
      boxRef.current.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${(-state.current.angle).toFixed(4)}rad)`;
    };

    const updatePhysics = (now: number) => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      // Frame-rate-independent delta-time so 60Hz, 120Hz, and 144Hz monitors feel identical
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.001), 0.04);
      lastTime = now;

      if (!state.current.isDragging) {
        const lengthLerp = 1 - Math.exp(-dt * 9);
        state.current.currentLength += (ropeLength - state.current.currentLength) * lengthLerp;

        const acceleration = (-gravity / Math.max(state.current.currentLength, 40)) * Math.sin(state.current.angle);
        state.current.velocity += acceleration * dt;
        state.current.velocity *= Math.pow(dampingPerSecond, dt);
        state.current.angle += state.current.velocity * dt;
      } else {
        const dx = state.current.dragX;
        const dy = Math.max(state.current.dragY, 18);

        const targetAngle = Math.max(-1.2, Math.min(1.2, Math.atan2(dx, dy)));
        let targetLength = Math.sqrt(dx * dx + dy * dy);

        if (targetLength > ropeLength) {
          targetLength = ropeLength + (targetLength - ropeLength) * 0.22;
        } else if (targetLength < ropeLength * 0.4) {
          targetLength = ropeLength * 0.4;
        }

        const dragLerp = 1 - Math.exp(-dt * 24);
        const prevAngle = state.current.angle;
        state.current.angle += (targetAngle - state.current.angle) * dragLerp;
        state.current.currentLength += (targetLength - state.current.currentLength) * dragLerp;
        // Preserve slight release momentum for satisfying swing on pointerup
        state.current.velocity = ((state.current.angle - prevAngle) / dt) * 0.35;
      }

      const isResting =
        !state.current.isDragging &&
        Math.abs(state.current.angle) < 0.0012 &&
        Math.abs(state.current.velocity) < 0.002 &&
        Math.abs(state.current.currentLength - ropeLength) < 0.15;

      if (isResting) {
        state.current.angle = 0;
        state.current.velocity = 0;
        state.current.currentLength = ropeLength;
      }

      applyTransform();
      animationFrameId = isResting ? 0 : requestAnimationFrame(updatePhysics);
    };

    const startLoop = () => {
      if (!isVisible || animationFrameId) return;
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    wakePhysicsRef.current = startLoop;

    const stopLoop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    applyTransform();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      wakePhysicsRef.current = null;
      cleanupDragRef.current?.();
      stopLoop();
      observer.disconnect();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return;
    cleanupDragRef.current?.();
    setHasInteracted(true);
    state.current.isDragging = true;
    if (boxRef.current) {
      boxRef.current.style.cursor = "grabbing";
    }

    const updateMousePos = (ev: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const originX = rect.width / 2;
      const originY = 0;

      state.current.dragX = ev.clientX - rect.left - originX;
      state.current.dragY = ev.clientY - rect.top - originY;
    };

    const handlePointerUp = () => {
      state.current.isDragging = false;
      if (boxRef.current) {
        boxRef.current.style.cursor = "grab";
      }
      window.removeEventListener("pointermove", updateMousePos);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      cleanupDragRef.current = null;
      wakePhysicsRef.current?.();
    };

    updateMousePos(e.nativeEvent as PointerEvent);

    window.addEventListener("pointermove", updateMousePos);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    cleanupDragRef.current = handlePointerUp;
    wakePhysicsRef.current?.();
  };

  return (
    <div ref={containerRef} className="relative w-[300px] h-[340px] flex justify-center -mt-2">
      <svg
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible"
      >
        {/* Subtle twin lanyard cord */}
        <line
          ref={ropeRef}
          x1="150"
          y1="0"
          x2="150"
          y2={ropeLength}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-foreground/30"
          strokeLinecap="round"
        />
        {/* Ceiling pin anchor */}
        <circle cx="150" cy="0" r="5" fill="currentColor" className="text-foreground/35" />
        <circle cx="150" cy="0" r="2" fill="currentColor" className="text-background" />
      </svg>

      <div
        ref={boxRef}
        onPointerDown={handlePointerDown}
        role="img"
        aria-label="Interactive swinging profile pass for Faiz Alam — drag to swing"
        className="absolute top-0 flex flex-col items-center justify-between px-4 py-5 w-[156px] rounded-2xl bg-background/75 backdrop-blur-md border border-foreground/15 cursor-grab shadow-[0_24px_48px_-16px_rgba(0,0,0,0.65)] select-none group hover:border-foreground/30 transition-colors duration-300 overflow-hidden will-change-transform"
        style={{
          left: "50%",
          marginLeft: "-78px",
          transformOrigin: "center top",
          transform: `translate3d(0px, ${ropeLength}px, 0)`,
          touchAction: "none",
        }}
      >
        {/* Specular architectural top highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-foreground/40 to-transparent pointer-events-none" />

        {/* Metallic lanyard grommet slot */}
        <div className="w-6 h-1.5 rounded-full border border-foreground/25 bg-background/90 mb-3 pointer-events-none" />

        {/* Clean monochrome avatar emblem */}
        <div className="w-16 h-16 rounded-full overflow-hidden border border-foreground/20 mb-3.5 bg-foreground/[0.04] flex items-center justify-center pointer-events-none group-hover:border-foreground/40 transition-colors duration-300">
          <User className="w-8 h-8 text-foreground/50 group-hover:text-foreground/80 transition-colors duration-300" />
        </div>

        {/* Refined ID card typography */}
        <div className="flex flex-col items-center gap-1 pointer-events-none text-center">
          <span className="font-display text-xs font-bold tracking-[0.18em] text-foreground uppercase">
            FAIZ ALAM
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
            ENG · GROWTH
          </span>
          <span className="mt-2 pt-2 border-t border-border/50 w-full text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground/70">
            {hasInteracted ? "MUMBAI · IN" : "DRAG TO SWING"}
          </span>
        </div>
      </div>
    </div>
  );
}
