"use client";

import { motion, useTransform, useScroll, useMotionValueEvent } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { useMediaQuery, BREAKPOINTS } from "@/hooks/use-media-query";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { AmbientGlow } from "@/components/effects/ambient-glow";
import { FluidShaderBackground } from "@/components/effects/fluid-shader-bg";
import { ProjectModal } from "@/components/modals/project-modal";
import type { ProjectItem } from "@/types/project";
import { RichText } from "@/lib/markdown";
import { getActiveProjectIndex } from "@/lib/portfolio-enhancements";

export default function Projects() {
    const { content, dict } = useLanguage();

    const isDesktop = useMediaQuery(BREAKPOINTS.xl);

    const targetRef = useRef<HTMLDivElement>(null);
    const horizontalContainerRef = useRef<HTMLDivElement>(null);

    const [measurements, setMeasurements] = useState({ scrollRange: 0, dynamicHeight: "auto" });
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const totalProjects = content.projects.length;

    useEffect(() => {
        if (!isDesktop) {
            const frame = requestAnimationFrame(() => {
                setMeasurements({ scrollRange: 0, dynamicHeight: "auto" });
            });
            return () => cancelAnimationFrame(frame);
        }

        const updateMeasurements = () => {
            if (horizontalContainerRef.current) {
                const totalWidth = horizontalContainerRef.current.scrollWidth;
                const viewportW = window.innerWidth;
                const range = totalWidth - viewportW;
                const safeRange = range > 0 ? range : 0;

                setMeasurements({
                    scrollRange: safeRange,
                    dynamicHeight: `${safeRange + window.innerHeight}px`,
                });
            }
        };

        updateMeasurements();

        const timeout = setTimeout(updateMeasurements, 100);
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateMeasurements);
        });

        if (horizontalContainerRef.current) {
            resizeObserver.observe(horizontalContainerRef.current);
        }

        return () => {
            clearTimeout(timeout);
            resizeObserver.disconnect();
        };
    }, [isDesktop, content.projects]);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (!isDesktop) return;
        const nextIdx = getActiveProjectIndex(latest, totalProjects);
        setActiveIndex((prev) => (prev === nextIdx ? prev : nextIdx));
    });

    const x = useTransform(scrollYProgress, [0, 1], [0, -measurements.scrollRange]);

    const handleOpenProject = (project: ProjectItem) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const activeProject = content.projects[activeIndex] ?? content.projects[0];
    const formattedActiveIndex = String(activeIndex + 1).padStart(2, "0");
    const formattedTotal = String(Math.max(totalProjects, 1)).padStart(2, "0");

    return (
        <section
            ref={targetRef}
            data-slot="projects"
            className="relative py-16 md:py-24 lg:py-32 xl:py-0"
            style={{ height: measurements.dynamicHeight }}
        >
            <div
                className={`
                    w-full 
                    ${isDesktop
                        ? "sticky top-0 h-screen flex items-center overflow-hidden"
                        : "relative flex flex-col"
                    }
                `}
            >
                <AmbientGlow variant="center" />
                <FluidShaderBackground variant="projects" />

                {!isDesktop ? (
                    <>
                        <div className="flex flex-col gap-4 px-container mb-10 sm:mb-12 relative z-10">
                            <BlurReveal>
                                <span className="title-counter">
                                    [004]
                                </span>
                            </BlurReveal>

                            <BlurReveal>
                                <h2 className="title">
                                    {dict.title.projects}
                                </h2>
                            </BlurReveal>

                            <BlurReveal>
                                <p className="mt-3 text-muted-foreground text-base sm:text-lg max-w-2xl">
                                    <RichText>{dict.projectsIntro}</RichText>
                                </p>
                            </BlurReveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-full px-container gap-6 sm:gap-8 relative z-10">
                            {content.projects.map((project: ProjectItem, index: number) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    disableReveal={false}
                                    onClick={() => handleOpenProject(project)}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <motion.div
                            ref={horizontalContainerRef}
                            style={{ x }}
                            className="flex px-container w-max items-center transform-gpu will-change-transform"
                        >
                            <div className="w-[60vw] xl:w-[38vw] shrink-0 flex flex-col justify-center pr-8">
                                <div className="flex flex-col gap-4">
                                    <BlurReveal>
                                        <span className="title-counter">
                                            [004]
                                        </span>
                                    </BlurReveal>

                                    <BlurReveal>
                                        <h2 className="title">
                                            {dict.title.projects}
                                        </h2>
                                    </BlurReveal>

                                    <BlurReveal>
                                        <p className="mt-4 text-4xl 2xl:text-5xl font-light leading-tight text-foreground/90">
                                            <RichText>{dict.projectsIntro}</RichText>
                                        </p>
                                    </BlurReveal>

                                    <BlurReveal>
                                        <div className="mt-10 flex items-center gap-4">
                                            <div className="h-px w-20 bg-border" />
                                            <span className="text-xs font-mono tracking-[0.2em] text-foreground/50 uppercase">
                                                {dict.projectsScrollText}
                                            </span>
                                        </div>
                                    </BlurReveal>
                                </div>
                            </div>

                            {content.projects.map((project: ProjectItem, index: number) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    disableReveal={true}
                                    onClick={() => handleOpenProject(project)}
                                />
                            ))}

                            <div className="w-[36vw] h-[68vh] shrink-0 flex flex-col justify-center items-center">
                                <h3 className="text-[9vw] font-black tracking-tighter text-border/70 uppercase select-none">
                                    {dict.projectsEndText}
                                </h3>
                            </div>
                        </motion.div>

                        {activeProject && (
                            <div
                                aria-hidden="true"
                                className="absolute bottom-8 left-0 right-0 px-container z-20 pointer-events-none flex items-center justify-end gap-6"
                            >
                                <div className="flex items-center gap-3 text-xs font-mono tracking-[0.2em] uppercase">
                                    <span className="text-foreground font-semibold">
                                        {formattedActiveIndex}
                                    </span>
                                    <span className="text-muted-foreground/50">/</span>
                                    <span className="text-muted-foreground">
                                        {formattedTotal}
                                    </span>
                                    <span className="h-px w-6 bg-border/80" />
                                    <span className="text-foreground/80 truncate max-w-[240px]">
                                        {activeProject.title}
                                    </span>
                                </div>

                                <div className="w-44 xl:w-60 h-0.5 bg-border/60 relative overflow-hidden">
                                    <motion.div
                                        style={{ scaleX: scrollYProgress }}
                                        className="h-full w-full bg-foreground/85 origin-left transform-gpu"
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <ProjectModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                project={selectedProject}
                projects={content.projects}
                onSelectProject={setSelectedProject}
            />
        </section>
    );
}

const ProjectCard = React.memo(function ProjectCard({
    project,
    index,
    disableReveal = false,
    onClick,
}: {
    project: ProjectItem;
    index: number;
    disableReveal?: boolean;
    onClick?: () => void;
}) {
    const formattedIndex = String(index + 1).padStart(2, "0");
    const stackPreview = project.stack?.slice(0, 3).join(" · ") ?? "";

    const cardContent = (
        <div className="group relative w-full xl:w-[44vw] aspect-4/3 shrink-0 xl:mx-5 cursor-pointer transform-gpu">
            <div className="relative w-full h-full overflow-hidden bg-muted/40 border border-border/50 transition-colors duration-500 ease-out group-hover:border-foreground/35 group-focus-within:border-foreground/35">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 44vw"
                        loading="eager"
                        decoding="async"
                        className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 group-focus-within:opacity-100 group-focus-within:scale-105 transition-all duration-700 ease-out grayscale-[30%] group-hover:grayscale-0 group-focus-within:grayscale-0 transform-gpu"
                    />
                    <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-background/80 via-background/25 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/55 to-transparent" />
                </div>

                <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 sm:p-7 xl:p-10 pointer-events-none">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs font-mono tracking-[0.18em] uppercase">
                            <span className="text-foreground/60">
                                [{formattedIndex}]
                            </span>
                            <span className="text-foreground/85">
                                {project.category}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-foreground/35" />
                            <span className="text-muted-foreground">
                                {project.year}
                            </span>
                        </div>

                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border/60 bg-background/60 backdrop-blur-sm flex items-center justify-center text-foreground/80 transition-colors duration-500 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground group-focus-within:bg-foreground group-focus-within:text-background">
                            <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 sm:gap-2">
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter uppercase text-foreground leading-[0.95] transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                            {project.title}
                        </h3>

                        {stackPreview && (
                            <p className="text-[11px] sm:text-xs font-mono tracking-[0.16em] text-muted-foreground uppercase truncate">
                                {stackPreview}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={onClick}
                aria-label={project.title}
                aria-haspopup="dialog"
                className="absolute inset-0 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            />
        </div>
    );

    if (disableReveal) {
        return cardContent;
    }

    return <BlurReveal>{cardContent}</BlurReveal>;
});
