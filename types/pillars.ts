export interface PillarMetric {
    label: string;
    value: string;
}

export interface PillarFacet {
    id: string;
    label: string;
    summary: string;
    proof: string;
}

export interface PillarItem {
    id: string;
    index: string;
    subsystem: string;
    title: string;
    subtitle: string;
    description: string;
    metrics: PillarMetric[];
    facets: PillarFacet[];
    tags: string[];
}
