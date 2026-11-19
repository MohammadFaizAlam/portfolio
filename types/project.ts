export type ProjectTrack = "engineering" | "growth";

export type ProjectHighlight = {
    label: string;
    value: string;
};

export type ProjectItem = {
    id: string;
    title: string;
    category: string;
    track: ProjectTrack;
    year: string;
    impact: string;
    role: string;
    challenge: string;
    architecture: string;
    outcome: string;
    highlights: ProjectHighlight[];
    description: string;
    image: string;
    demo?: string;
    repo?: string;
    stack?: string[];
};
