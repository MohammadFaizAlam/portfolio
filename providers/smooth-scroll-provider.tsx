"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { frame, cancelFrame } from "framer-motion";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      lerp: 0.1,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      autoRaf: false,
    });

    const frameId = requestAnimationFrame(() => {
      setLenis(lenisInstance);
    });

    // Sync Lenis directly with Framer Motion's internal frame loop to eliminate 1-frame scroll jitter
    const update = (data: { timestamp: number }) => {
      lenisInstance.raf(data.timestamp);
    };

    frame.update(update, true);

    const resizeObserver = new ResizeObserver(() => {
      lenisInstance.resize();
    });
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(frameId);
      cancelFrame(update);
      resizeObserver.disconnect();
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
