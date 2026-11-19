"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { AmbientGlow } from "@/components/effects/ambient-glow";
import { ProjectModal } from "@/components/modals/project-modal";
import type { ProjectItem } from "@/types/project";
import { RichText } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import {
    type ProjectFilterValue,
    filterProjectsByTrack,
    getProjectBentoClass,
} from "@/lib/portfolio-enhancements";

export default function Projects() {
    const { content, dict } = useLanguage();
    const prefersReducedMotion = useReducedMotion() ?? false;

    const [activeFilter, setActiveFilter] = useState<ProjectFilterValue>("all");
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const allProjects: ProjectItem[] = useMemo(
        () => (content.projects as ProjectItem[]) || [],
        [content.projects]
    );

    const filteredProjects = useMemo(
        () => filterProjectsByTrack(allProjects, activeFilter),
        [allProjects, activeFilter]
    );

    const filterOptions = useMemo(
        () => [
            {
                value: "all" as const,
                label: dict.projectsFilterAll,
                count: allProjects.length,
            },
            {
                value: "engineering" as const,
                label: dict.projectsFilterEngineering,
                count: filterProjectsByTrack(allProjects, "engineering").length,
            },
            {
                value: "growth" as const,
                label: dict.projectsFilterGrowth,
                count: filterProjectsByTrack(allProjects, "growth").length,
            },
        ],
        [
            allProjects,
            dict.projectsFilterAll,
            dict.projectsFilterEngineering,
            dict.projectsFilterGrowth,
        ]
    );

    const handleOpenProject = useCallback((project: ProjectItem) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    }, []);

    return (
        <section
            data-slot="projects"
            className="relative w-full container-void bg-transparent text-foreground overflow-x-clip"
        >
            <AmbientGlow variant="center" />

            <div className="container mx-auto px-container relative z-10">
                {/* Editorial Section Header + Refined Underline Filter Rail */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12 mb-12 sm:mb-16">
                    <div className="flex flex-col gap-3.5 max-w-2xl">
                        <BlurReveal delay={0} yOffset={14}>
                            <span className="title-counter">[002]</span>
                        </BlurReveal>

                        <BlurReveal delay={0.06} yOffset={20}>
                            <h2 className="title">{dict.title.projects}</h2>
                        </BlurReveal>

                        <BlurReveal delay={0.12} yOffset={16}>
                            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed max-w-xl mt-1">
                                <RichText>{dict.projectsIntro}</RichText>
                            </p>
                        </BlurReveal>
                    </div>

                    {/* Architectural Underline Tab Rail — Single-Line on All Viewports, Zero Scrollbar */}
                    <BlurReveal delay={0.14} yOffset={14}>
                        <div
                            role="tablist"
                            aria-label="Filter projects by discipline"
                            data-testid="projects-filter-rail"
                            className="inline-flex items-center gap-6 sm:gap-8 border-b border-foreground/12 max-w-full"
                        >
                            {filterOptions.map((option) => {
                                const isSelected = activeFilter === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="tab"
                                        aria-selected={isSelected}
                                        onClick={() => setActiveFilter(option.value)}
                                        className={cn(
                                            "relative pb-3.5 pt-1 text-xs sm:text-[13px] font-medium tracking-[0.06em] transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 flex items-baseline gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                                            isSelected
                                                ? "text-foreground"
                                                : "text-muted-foreground/75 hover:text-foreground/90"
                                        )}
                                    >
                                        <span>{option.label}</span>
                                        <span
                                            className={cn(
                                                "text-[10px] font-mono tabular-nums transition-opacity duration-200",
                                                isSelected ? "text-foreground/70" : "text-muted-foreground/45"
                                            )}
                                        >
                                            0{option.count}
                                        </span>

                                        {isSelected && (
                                            <motion.span
                                                layoutId="projects-filter-underline"
                                                transition={
                                                    prefersReducedMotion
                                                        ? { duration: 0 }
                                                        : {
                                                              type: "spring",
                                                              stiffness: 420,
                                                              damping: 36,
                                                          }
                                                }
                                                className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-foreground"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </BlurReveal>
                </div>

                {/* Asymmetric Editorial Bento Showcase */}
                <motion.div
                    key={activeFilter}
                    initial={prefersReducedMotion ? false : { opacity: 0.72, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-7"
                >
                    {filteredProjects.map((project, index) => (
                        <BentoProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            total={filteredProjects.length}
                            onClick={() => handleOpenProject(project)}
                        />
                    ))}
                </motion.div>
            </div>

            <ProjectModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                project={selectedProject}
                projects={filteredProjects}
                onSelectProject={setSelectedProject}
            />
        </section>
    );
}

const BentoProjectCard = React.memo(function BentoProjectCard({
    project,
    index,
    total,
    onClick,
}: {
    project: ProjectItem;
    index: number;
    total: number;
    onClick: () => void;
}) {
    const formattedIndex = String(index + 1).padStart(2, "0");
    const slotClass = getProjectBentoClass(index, total);
    const isFeaturedWide = slotClass.includes("lg:col-span-7") || slotClass.includes("lg:col-span-12");

    return (
        <article
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-foreground/12 bg-card/50 transition-colors duration-300 ease-out hover:border-foreground/30 focus-within:border-foreground/45 transform-gpu",
                slotClass
            )}
        >
            {/* Full-bleed Curated Artwork */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes={
                        isFeaturedWide
                            ? "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 58vw"
                            : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 42vw"
                    }
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="object-cover opacity-82 group-hover:opacity-100 group-hover:scale-[1.035] group-focus-within:opacity-100 group-focus-within:scale-[1.035] transition-all duration-700 ease-out grayscale-[22%] group-hover:grayscale-0 group-focus-within:grayscale-0 transform-gpu"
                />

                {/* Top whisper scrim for index & arrow contrast */}
                <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background/80 via-background/30 to-transparent" />
                {/* Bottom measured editorial contrast scrim */}
                <div className="absolute inset-x-0 bottom-0 h-[62%] bg-linear-to-t from-background/95 via-background/65 to-transparent" />
            </div>

            {/* Clean Top Specular Hairline */}
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-foreground/25 to-transparent z-10 pointer-events-none" />

            {/* Minimal, Spacious Overlay Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-7 lg:p-8 pointer-events-none">
                {/* Quiet Top Row: Index + Action Affordance */}
                <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] font-mono tracking-[0.2em] text-foreground/75 tabular-nums">
                        {formattedIndex}
                    </span>

                    <div className="w-9 h-9 rounded-full border border-foreground/15 bg-background/60 backdrop-blur-sm flex items-center justify-center text-foreground/85 transition-all duration-200 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground group-focus-within:bg-foreground group-focus-within:text-background">
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                </div>

                {/* Spacious Bottom Typography */}
                <div className="flex flex-col gap-2 max-w-xl">
                    <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.16em] uppercase text-muted-foreground/90">
                        <span>{project.category}</span>
                        <span aria-hidden="true" className="text-foreground/35">
                            ·
                        </span>
                        <span className="tabular-nums">{project.year}</span>
                    </div>

                    <h3
                        className={cn(
                            "font-display font-bold tracking-tight uppercase text-foreground leading-[1.02] transition-transform duration-300 ease-out group-hover:-translate-y-0.5",
                            isFeaturedWide
                                ? "text-2xl sm:text-3xl lg:text-[2.15rem]"
                                : "text-2xl sm:text-[1.75rem]"
                        )}
                    >
                        {project.title}
                    </h3>

                    {project.impact && (
                        <p className="text-xs sm:text-sm text-foreground/78 font-light leading-relaxed line-clamp-2 max-w-md mt-0.5">
                            {project.impact}
                        </p>
                    )}
                </div>
            </div>

            {/* Full-card Accessible Trigger */}
            <button
                type="button"
                onClick={onClick}
                aria-label={`Open case study for ${project.title}`}
                aria-haspopup="dialog"
                className="absolute inset-0 z-20 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            />
        </article>
    );
});
