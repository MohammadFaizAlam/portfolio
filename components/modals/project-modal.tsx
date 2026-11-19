import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { useLenisModal } from "@/hooks/use-lenis-modal";
import { useLanguage } from "@/providers/language-provider";
import { Github, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ProjectItem } from "@/types/project";
import { ShineButton } from "@/components/ui/shine-button";
import { useRef, useEffect } from "react";
import { getAdjacentProjectIndices } from "@/lib/portfolio-enhancements";

interface ProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: ProjectItem | null;
    projects?: ProjectItem[];
    onSelectProject?: (project: ProjectItem) => void;
}

export function ProjectModal({
    open,
    onOpenChange,
    project,
    projects = [],
    onSelectProject,
}: ProjectModalProps) {
    const openerRef = useRef<HTMLElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    useLenisModal(open);
    const { dict } = useLanguage();

    const currentIndex = project
        ? Math.max(
              0,
              projects.findIndex((item) => item.id === project.id)
          )
        : 0;
    const totalProjects = projects.length;
    const canNavigate = totalProjects > 1 && Boolean(onSelectProject);
    const { prevIndex, nextIndex } = getAdjacentProjectIndices(
        currentIndex,
        totalProjects || 1
    );
    const prevProject = canNavigate ? projects[prevIndex] : null;
    const nextProject = canNavigate ? projects[nextIndex] : null;

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [project?.id]);

    useEffect(() => {
        if (!open || !canNavigate || !onSelectProject) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft" && prevProject) {
                event.preventDefault();
                onSelectProject(prevProject);
            } else if (event.key === "ArrowRight" && nextProject) {
                event.preventDefault();
                onSelectProject(nextProject);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, canNavigate, onSelectProject, prevProject, nextProject]);

    if (!project) return null;

    const formattedIndex = String(currentIndex + 1).padStart(2, "0");
    const formattedTotal = String(Math.max(totalProjects, 1)).padStart(2, "0");
    const primaryHighlight = project.highlights?.[0];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    openerRef.current =
                        document.activeElement instanceof HTMLElement
                            ? document.activeElement
                            : null;
                }}
                onCloseAutoFocus={(event) => {
                    if (openerRef.current?.isConnected) {
                        event.preventDefault();
                        openerRef.current.focus({ preventScroll: true });
                    }
                }}
                showCloseButton={true}
                className="flex flex-col sm:max-w-[780px] w-[94vw] max-h-[88vh] p-0 gap-0 border-foreground/15 bg-background/97 backdrop-blur-xl shrink-0 outline-none overflow-hidden rounded-2xl"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>{project.title}</DialogTitle>
                    <DialogDescription>
                        {dict.projectDetails} {project.title}
                    </DialogDescription>
                </DialogHeader>

                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-foreground/30 to-transparent z-10" />

                <div
                    ref={scrollContainerRef}
                    className="overflow-y-auto w-full h-full flex-1"
                    data-lenis-prevent="true"
                >
                    {/* Uncluttered Standalone Visual Plate */}
                    {project.image && (
                        <div className="relative w-full aspect-[16/9] max-h-[34vh] sm:max-h-[38vh] shrink-0 overflow-hidden border-b border-border/45 bg-card">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(max-width: 639px) 94vw, 780px"
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-background/60 to-transparent pointer-events-none" />
                        </div>
                    )}

                    {/* Spacious Editorial Case-Study Content */}
                    <div className="p-6 sm:p-10 space-y-7 sm:space-y-8">
                        {/* Clean Header Block */}
                        <div className="space-y-2.5">
                            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono tracking-[0.18em] text-muted-foreground uppercase tabular-nums">
                                <span className="text-foreground/80">
                                    {formattedIndex} / {formattedTotal}
                                </span>
                                <span aria-hidden="true" className="text-border">
                                    ·
                                </span>
                                <span>{project.category}</span>
                                <span aria-hidden="true" className="text-border">
                                    ·
                                </span>
                                <span>{project.year}</span>
                            </div>

                            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight uppercase text-foreground leading-[1.02]">
                                {project.title}
                            </h2>

                            {project.impact && (
                                <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-2xl pt-0.5">
                                    {project.impact}
                                </p>
                            )}
                        </div>

                        {/* Single Clean Fact Strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 py-5 border-y border-border/50">
                            {project.role && (
                                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                                    <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-muted-foreground/70">
                                        Role
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">
                                        {project.role}
                                    </span>
                                </div>
                            )}

                            {primaryHighlight && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-muted-foreground/70">
                                        {primaryHighlight.label}
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-foreground tabular-nums leading-snug">
                                        {primaryHighlight.value}
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-muted-foreground/70">
                                    Year
                                </span>
                                <span className="text-xs sm:text-sm font-medium text-foreground tabular-nums leading-snug">
                                    {project.year}
                                </span>
                            </div>
                        </div>

                        {/* Concise 2-Column Editorial Summary (Zero Redundant Text Walls) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-9">
                            {project.architecture && (
                                <div className="space-y-2">
                                    <h3 className="text-[11px] font-mono tracking-[0.18em] text-muted-foreground uppercase">
                                        {dict.challengeLabel}
                                    </h3>
                                    <p className="text-sm text-foreground/85 leading-relaxed font-light">
                                        {project.architecture}
                                    </p>
                                </div>
                            )}

                            {project.outcome && (
                                <div className="space-y-2">
                                    <h3 className="text-[11px] font-mono tracking-[0.18em] text-muted-foreground uppercase">
                                        {dict.outcomeLabel}
                                    </h3>
                                    <p className="text-sm text-foreground/85 leading-relaxed font-light">
                                        {project.outcome}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Unboxed Inline Stack Line */}
                        {project.stack && project.stack.length > 0 && (
                            <div className="pt-5 border-t border-border/45 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                                <span className="text-[10px] font-mono tracking-[0.18em] text-muted-foreground/75 uppercase shrink-0">
                                    {dict.technologies}
                                </span>
                                <p className="text-xs font-mono tracking-wide text-foreground/80">
                                    {project.stack.join(" · ")}
                                </p>
                            </div>
                        )}

                        {/* External Actions */}
                        {(project.demo || project.repo) && (
                            <div className="flex flex-wrap gap-3 pt-2">
                                {project.demo && (
                                    <ShineButton
                                        href={project.demo}
                                        className="h-10 bg-foreground px-6 text-background hover:bg-background hover:text-foreground shadow-lg hover:-translate-y-0.5"
                                        shineClassName="w-8 bg-background/20 dark:bg-foreground/10"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase whitespace-nowrap">
                                            {dict.liveDemo}
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </span>
                                    </ShineButton>
                                )}

                                {project.repo && (
                                    <ShineButton
                                        href={project.repo}
                                        className="h-10 bg-secondary/20 backdrop-blur-md px-6 text-foreground hover:bg-foreground hover:text-background shadow-sm hover:-translate-y-0.5"
                                        shineClassName="w-8 bg-foreground/10 dark:bg-background/20"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase whitespace-nowrap">
                                            {dict.sourceCode}
                                            <Github className="w-3.5 h-3.5" />
                                        </span>
                                    </ShineButton>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Minimal Case-Study Pagination Footer */}
                {canNavigate && prevProject && nextProject && onSelectProject && (
                    <div className="shrink-0 flex items-center justify-between gap-4 px-6 sm:px-10 py-3.5 border-t border-border/50 bg-background/95 backdrop-blur-md z-10">
                        <button
                            type="button"
                            data-slot="modal-prev-project"
                            onClick={() => onSelectProject(prevProject)}
                            className="group flex items-center gap-2.5 text-left py-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ring rounded-md"
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-border/60 group-hover:border-foreground/60 group-hover:bg-foreground group-hover:text-background transition-all duration-200">
                                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                            </span>
                            <span className="text-xs sm:text-sm font-medium tracking-tight text-foreground/85 group-hover:text-foreground truncate max-w-[115px] sm:max-w-[190px]">
                                {prevProject.title}
                            </span>
                        </button>

                        <button
                            type="button"
                            data-slot="modal-next-project"
                            onClick={() => onSelectProject(nextProject)}
                            className="group flex items-center gap-2.5 text-right py-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ring rounded-md"
                        >
                            <span className="text-xs sm:text-sm font-medium tracking-tight text-foreground/85 group-hover:text-foreground truncate max-w-[115px] sm:max-w-[190px]">
                                {nextProject.title}
                            </span>
                            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-border/60 group-hover:border-foreground/60 group-hover:bg-foreground group-hover:text-background transition-all duration-200">
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </span>
                        </button>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-foreground/25 to-transparent z-20" />
            </DialogContent>
        </Dialog>
    );
}
