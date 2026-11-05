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
import { RichText } from "@/lib/markdown";
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
                }}
                onCloseAutoFocus={(event) => {
                    if (openerRef.current?.isConnected) {
                        event.preventDefault();
                        openerRef.current.focus({ preventScroll: true });
                    }
                }}
                showCloseButton={true}
                className="flex flex-col sm:max-w-[820px] w-[95vw] max-h-[90vh] p-0 gap-0 border-border/50 bg-background/95 backdrop-blur-xl shrink-0 outline-none"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>{project.title}</DialogTitle>
                    <DialogDescription>{dict.projectDetails} {project.title}</DialogDescription>
                </DialogHeader>

                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

                <div
                    ref={scrollContainerRef}
                    className="overflow-y-auto w-full h-full flex-1"
                    data-lenis-prevent="true"
                >
                    <div className="relative w-full h-[28vh] sm:h-[35vh] shrink-0 overflow-hidden">
                        {project.image && (
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 842px) 95vw, 820px"
                                className="object-cover"
                                priority
                            />
                        )}
                        <div className="absolute inset-0 bg-linear-to-b from-background/60 via-transparent to-transparent h-24" />
                        <div className="absolute inset-0 bg-linear-to-t from-background via-background/45 to-transparent" />

                        {totalProjects > 0 && (
                            <div className="absolute top-5 left-6 sm:top-6 sm:left-10 z-10">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/50 bg-background/65 backdrop-blur-md text-[11px] font-mono tracking-[0.2em] text-foreground/80 uppercase">
                                    [{formattedIndex} / {formattedTotal}]
                                </span>
                            </div>
                        )}

                        <div className="absolute bottom-4 left-6 right-6 sm:bottom-6 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] text-muted-foreground uppercase mb-1.5">
                                    <span>{project.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-foreground/40" />
                                    <span>{project.year}</span>
                                </div>
                                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase text-foreground leading-[0.95]">
                                    {project.title}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:px-10 sm:py-7 flex flex-col gap-6 sm:gap-7">
                        <div>
                            <h3 className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase mb-2.5">
                                {dict.aboutProject}
                            </h3>
                            <p className="text-sm sm:text-base text-foreground/85 leading-relaxed font-light">
                                <RichText>{project.description}</RichText>
                            </p>
                        </div>

                        {project.stack && project.stack.length > 0 && (
                            <div>
                                <h3 className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase mb-2.5">
                                    {dict.technologies}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3.5 py-1 rounded-full border border-border/60 bg-secondary/40 text-xs font-mono tracking-wider text-foreground/85"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(project.demo || project.repo) && (
                            <div className="flex flex-wrap gap-4 pt-3 border-t border-border/50">
                                {project.demo && (
                                    <ShineButton
                                        href={project.demo}
                                        className="h-10 sm:h-11 bg-foreground px-6 sm:px-7 text-background hover:bg-background hover:text-foreground shadow-lg hover:-translate-y-0.5"
                                        shineClassName="w-8 bg-background/20 dark:bg-foreground/10"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
                                            {dict.liveDemo}
                                            <ExternalLink className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </span>
                                    </ShineButton>
                                )}

                                {project.repo && (
                                    <ShineButton
                                        href={project.repo}
                                        className="h-10 sm:h-11 bg-secondary/10 backdrop-blur-md px-6 sm:px-7 text-foreground hover:bg-foreground hover:text-background shadow-sm hover:-translate-y-0.5"
                                        shineClassName="w-8 bg-foreground/10 dark:bg-background/20"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
                                            {dict.sourceCode}
                                            <Github className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                                        </span>
                                    </ShineButton>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {canNavigate && prevProject && nextProject && onSelectProject && (
                    <div className="shrink-0 flex items-center justify-between gap-4 px-6 sm:px-10 py-3.5 border-t border-border/50 bg-background/95 backdrop-blur-md z-10">
                        <button
                            type="button"
                            data-slot="modal-prev-project"
                            onClick={() => onSelectProject(prevProject)}
                            className="group flex items-center gap-3 text-left py-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none"
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-border/60 group-hover:border-foreground/60 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                            </span>
                            <span className="flex flex-col">
                                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                                    {dict.prevProject}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground/90 group-hover:text-foreground truncate max-w-[120px] sm:max-w-[200px]">
                                    {prevProject.title}
                                </span>
                            </span>
                        </button>

                        <span className="hidden sm:inline-block text-[11px] font-mono tracking-[0.2em] text-muted-foreground/70">
                            {formattedIndex} / {formattedTotal}
                        </span>

                        <button
                            type="button"
                            data-slot="modal-next-project"
                            onClick={() => onSelectProject(nextProject)}
                            className="group flex items-center gap-3 text-right py-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none"
                        >
                            <span className="flex flex-col items-end">
                                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                                    {dict.nextProject}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground/90 group-hover:text-foreground truncate max-w-[120px] sm:max-w-[200px]">
                                    {nextProject.title}
                                </span>
                            </span>
                            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-border/60 group-hover:border-foreground/60 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                        </button>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-20" />
            </DialogContent>
        </Dialog>
    );
}
