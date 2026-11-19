"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, useId } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { useLenis } from "@/providers/smooth-scroll-provider";
import { ContactModal } from "@/components/modals/contact-modal";
import { cn } from "@/lib/utils";

const SECTION_IDS = ["about", "projects", "pillars", "stack", "roadmap", "contact"] as const;

const DRAWER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EXIT_EASE: [number, number, number, number] = [0.4, 0, 1, 1];

export default function Navbar() {
  const { dict, content } = useLanguage();
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const [dimensions, setDimensions] = useState({
    screenWidth: 1440,
    scrollHeight: 800,
  });

  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuId = useId();

  const { scrollY, scrollYProgress } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, Math.max(140, dimensions.scrollHeight * 0.25)], [0, 1]);

  const navLinks = useMemo(
    () => [
      { id: "about", name: dict.nav.about, href: "#about" },
      { id: "projects", name: dict.nav.projects, href: "#projects" },
      { id: "pillars", name: dict.nav.pillars, href: "#pillars" },
      { id: "stack", name: dict.nav.stack, href: "#stack" },
      { id: "roadmap", name: dict.nav.roadmap, href: "#roadmap" },
    ],
    [dict.nav]
  );

  const socialLinks = useMemo(
    () => (content.social as Array<{ label: string; href: string }>) || [],
    [content.social]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDimensions = () => {
      setDimensions({
        screenWidth: window.innerWidth,
        scrollHeight: window.innerHeight,
      });
    };

    const updateActiveSection = () => {
      const scrollMarker = window.innerHeight * 0.52;
      if (window.scrollY < window.innerHeight * 0.42) {
        setActiveSection("");
        return;
      }

      let found = "";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= scrollMarker && rect.bottom >= 140) {
          found = id;
        }
      }
      if (found) {
        setActiveSection((prev) => (prev === found ? prev : found));
      }
    };

    updateDimensions();
    updateActiveSection();

    window.addEventListener("resize", updateDimensions, { passive: true });
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    const overflowVal = isMobileMenuOpen ? "hidden" : "";
    document.body.style.overflow = overflowVal;
    document.documentElement.style.overflow = overflowVal;

    if (isMobileMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [isMobileMenuOpen, lenis]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const menuButton = menuButtonRef.current;
    const header = headerRef.current;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsMobileMenuOpen(false);
    };
    const focusMenu = () =>
      mobileMenuRef.current?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
    const frame = requestAnimationFrame(focusMenu);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMobileMenuOpen(false);
      } else if (event.key === "Tab") {
        const controls = Array.from(
          headerRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    const containFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      if (headerRef.current?.contains(event.target)) return;
      focusMenu();
    };

    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", containFocus);

    return () => {
      cancelAnimationFrame(frame);
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", containFocus);
      if (menuButton?.isConnected && menuButton.getClientRects().length) {
        menuButton.focus({ preventScroll: true });
      } else {
        header?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
      }
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);

      if (elem || targetId === "home") {
        const wasMenuOpen = isMobileMenuOpen;
        setIsMobileMenuOpen(false);

        setTimeout(
          () => {
            const navbarHeight = headerRef.current ? headerRef.current.offsetHeight : 64;
            const noOffset = targetId === "home";

            if (lenis && !prefersReducedMotion) {
              lenis.scrollTo(targetId === "home" ? 0 : elem!, {
                offset: noOffset ? 0 : -navbarHeight,
                duration: 1.05,
              });
            } else if (targetId === "home") {
              window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
            } else if (elem) {
              const rect = elem.getBoundingClientRect();
              const offsetPosition = rect.top + window.scrollY - (noOffset ? 0 : navbarHeight);
              window.scrollTo({
                top: offsetPosition,
                behavior: prefersReducedMotion ? "auto" : "smooth",
              });
            }
          },
          wasMenuOpen ? 160 : 20
        );
      }
    },
    [lenis, isMobileMenuOpen, prefersReducedMotion]
  );

  return (
    <>
      <header
        ref={headerRef}
        role={isMobileMenuOpen ? "dialog" : undefined}
        aria-modal={isMobileMenuOpen ? true : undefined}
        aria-label={isMobileMenuOpen ? dict.nav.menuLabel : undefined}
        className="fixed top-0 left-0 right-0 z-100 py-3 sm:py-3.5 lg:py-4 transform-gpu"
      >
        {/* Scroll-linked Frosted Header Surface */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className={cn(
            "absolute inset-0 bg-background/82 backdrop-blur-xl border-b border-border/45 -z-10 pointer-events-none transform-gpu transition-opacity duration-300",
            isMobileMenuOpen && "max-lg:opacity-0!"
          )}
        />

        {/* Mobile & Tablet Subtle Bottom Scroll Progress Hairline */}
        {!isMobileMenuOpen && (
          <motion.div
            aria-hidden="true"
            style={{ scaleX: prefersReducedMotion ? 0 : scrollYProgress, originX: 0 }}
            className="lg:hidden absolute bottom-0 left-0 right-0 h-px bg-foreground/35 pointer-events-none transform-gpu"
          />
        )}

        {/* Strict 3-Zone Top Bar Contract (Desktop untouched; Mobile & Tablet elevated) */}
        <nav
          aria-label="Primary"
          className="mx-auto px-container flex items-center justify-between gap-4 sm:gap-8 w-full max-w-[100vw]"
        >
          {/* Zone 1: Personal Brand Wordmark */}
          <Link
            href="#home"
            onClick={(e) => scrollToSection(e, "#home")}
            className="relative z-110 font-display text-lg sm:text-xl font-extrabold tracking-tight uppercase text-foreground transition-opacity duration-200 hover:opacity-75 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring rounded-sm"
          >
            FAIZ.
          </Link>

          {/* Zone 2: Desktop 5 Single-Line Navigation Links (Unchanged) */}
          <ul className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative text-xs font-medium tracking-[0.16em] uppercase transition-colors duration-200 py-2 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring rounded-sm",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.name}
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 h-px bg-foreground transition-all duration-300",
                        isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Zone 3: Desktop CTA (Unchanged) + Elevated Tablet Quick CTA & Morphing Architectural Menu Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Desktop Primary CTA */}
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/20 bg-foreground text-background text-xs font-semibold tracking-[0.14em] uppercase hover:bg-background hover:text-foreground hover:border-foreground/40 transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span>{dict.nav.contact}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Tablet-only Compact Primary CTA (sm..lg) */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsContactOpen(true);
              }}
              className={cn(
                "hidden sm:inline-flex lg:hidden relative z-110 items-center gap-1.5 h-10 px-4 rounded-full border border-foreground/20 bg-foreground text-background text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-200 hover:bg-background hover:text-foreground hover:border-foreground/40 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isMobileMenuOpen && "opacity-0 pointer-events-none"
              )}
            >
              <span>{dict.nav.contact}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile & Tablet Tactile Morphing 2-Bar Menu Toggle (44x44 touch target) */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              data-testid="mobile-menu-toggle"
              className={cn(
                "lg:hidden relative z-110 w-11 h-11 rounded-full border flex items-center justify-center transition-colors duration-250 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isMobileMenuOpen
                  ? "border-foreground/30 bg-foreground/10 text-foreground"
                  : "border-foreground/15 bg-background/65 backdrop-blur-md text-foreground hover:border-foreground/35 hover:bg-foreground/[0.06]"
              )}
              aria-label={isMobileMenuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls={isMobileMenuOpen ? mobileMenuId : undefined}
            >
              <span className="relative w-[18px] h-3 flex flex-col items-center justify-center">
                <motion.span
                  aria-hidden="true"
                  animate={
                    isMobileMenuOpen
                      ? { y: 0, rotate: 45, width: 18 }
                      : { y: -3.5, rotate: 0, width: 18 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.01 }
                      : { type: "spring", stiffness: 420, damping: 32 }
                  }
                  className="absolute block h-[1.5px] bg-current rounded-full transform-gpu"
                />
                <motion.span
                  aria-hidden="true"
                  animate={
                    isMobileMenuOpen
                      ? { y: 0, rotate: -45, width: 18 }
                      : { y: 3.5, rotate: 0, width: 13 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.01 }
                      : { type: "spring", stiffness: 420, damping: 32 }
                  }
                  className="absolute block h-[1.5px] bg-current rounded-full self-end transform-gpu"
                />
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile & Tablet Architectural Drawer Sheet (< lg ONLY) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-90 lg:hidden flex justify-end h-dvh w-screen">
              {/* Frosted Backdrop Scrim (Tap to Dismiss on Tablet/Mobile) */}
              <motion.div
                aria-hidden="true"
                data-testid="mobile-menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.05 : 0.28, ease: "easeOut" }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute inset-0 bg-background/65 backdrop-blur-md"
              />

              {/* Right-Anchored Architectural Glass Sheet (Full-Width Mobile / 420px Docked Sheet on Tablet) */}
              <motion.div
                ref={mobileMenuRef}
                id={mobileMenuId}
                data-testid="mobile-menu-sheet"
                initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
                animate={prefersReducedMotion ? { opacity: 1 } : { x: "0%" }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0, transition: { duration: 0.08 } }
                    : { x: "100%", transition: { duration: 0.28, ease: EXIT_EASE } }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0.1 }
                    : { duration: 0.4, ease: DRAWER_EASE }
                }
                className="relative z-10 w-full sm:w-[420px] max-w-[100vw] h-dvh bg-background/97 backdrop-blur-2xl sm:border-l sm:border-foreground/12 shadow-[-24px_0_64px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden transform-gpu will-change-transform"
              >
                {/* Top Hairline Separator below fixed Navbar */}
                <div className="pt-20 sm:pt-22 px-container sm:px-9 shrink-0">
                  <div className="h-px w-full bg-linear-to-r from-foreground/18 via-foreground/10 to-transparent" />
                </div>

                {/* Scrollable Editorial Navigation List & Direct-Action Footer */}
                <div className="flex flex-col flex-1 justify-between px-container sm:px-9 pt-6 pb-8 overflow-y-auto">
                  <ul className="flex flex-col divide-y divide-foreground/[0.08]">
                    {navLinks.map((link, i) => {
                      const isActive = activeSection === link.id;
                      return (
                        <motion.li
                          key={link.id}
                          initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={
                            prefersReducedMotion
                              ? undefined
                              : { opacity: 0, x: 10, transition: { duration: 0.14 } }
                          }
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : {
                                  delay: 0.08 + i * 0.045,
                                  duration: 0.36,
                                  ease: DRAWER_EASE,
                                }
                          }
                        >
                          <Link
                            href={link.href}
                            onClick={(e) => scrollToSection(e, link.href)}
                            aria-current={isActive ? "location" : undefined}
                            className="group flex items-center justify-between py-4 sm:py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring rounded-sm"
                          >
                            <span className="flex items-baseline gap-4 min-w-0">
                              <span
                                className={cn(
                                  "text-[11px] font-mono tracking-[0.18em] tabular-nums transition-colors duration-200",
                                  isActive
                                    ? "text-foreground font-semibold"
                                    : "text-muted-foreground/50 group-hover:text-foreground/75"
                                )}
                              >
                                0{i + 1}
                              </span>
                              <span
                                className={cn(
                                  "font-display text-2xl sm:text-[1.85rem] font-bold tracking-tight uppercase transition-all duration-250 group-hover:translate-x-1.5",
                                  isActive
                                    ? "text-foreground"
                                    : "text-foreground/65 group-hover:text-foreground"
                                )}
                              >
                                {link.name}
                              </span>
                            </span>

                            <span className="flex items-center gap-2.5 shrink-0">
                              {isActive && (
                                <span
                                  aria-hidden="true"
                                  className="w-5 h-px bg-foreground/80"
                                />
                              )}
                              <ArrowUpRight
                                className={cn(
                                  "w-4 h-4 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                                  isActive
                                    ? "text-foreground opacity-100"
                                    : "text-muted-foreground/45 opacity-70 group-hover:text-foreground group-hover:opacity-100"
                                )}
                              />
                            </span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>

                  {/* Spacious Direct-Action & Metadata Footer */}
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { delay: 0.24, duration: 0.36, ease: DRAWER_EASE }
                    }
                    className="pt-7 mt-6 border-t border-foreground/10 flex flex-col gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setTimeout(() => setIsContactOpen(true), 120);
                      }}
                      className="w-full h-12 px-6 rounded-full bg-foreground text-background font-semibold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-opacity duration-200 hover:opacity-90 active:scale-[0.99] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <span>{dict.nav.contact}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    {content.contact?.calendly && (
                      <a
                        href={content.contact.calendly}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full h-11 px-5 rounded-full border border-foreground/15 bg-foreground/[0.02] text-foreground/90 font-medium text-[11px] tracking-[0.14em] uppercase flex items-center justify-center gap-2 transition-colors duration-200 hover:border-foreground/35 hover:bg-foreground/[0.06]"
                      >
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{dict.bookCall}</span>
                      </a>
                    )}

                    {/* Quiet Location & Socials Row */}
                    <div className="pt-4 mt-1 flex flex-col gap-2.5 text-[10px] font-mono tracking-[0.16em] uppercase text-muted-foreground/65">
                      {content.contact?.location && (
                        <span>{content.contact.location}</span>
                      )}
                      {socialLinks.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-foreground/75">
                          {socialLinks.map((social, idx) => (
                            <span key={social.label} className="inline-flex items-center gap-3">
                              {idx > 0 && (
                                <span aria-hidden="true" className="text-foreground/25">
                                  ·
                                </span>
                              )}
                              <a
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors"
                              >
                                {social.label}
                              </a>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </header>

      <ContactModal open={isContactOpen} onOpenChange={setIsContactOpen} />
    </>
  );
}
