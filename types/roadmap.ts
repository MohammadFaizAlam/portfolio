export type RoadmapItem = {
    id: string;
    year: string;
    title: string;
    subtitle: string;
    current?: boolean;
    description: string;
    stack: string[];
};
