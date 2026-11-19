export type StackItem = {
    name: string;
    icon: string;
    featured?: boolean;
    proficiency?: string;
    usage?: string;
    appliedIn?: string;
};

export type StackCategories = {
    frontend: StackItem[];
    backendData: StackItem[];
    tools: StackItem[];
};
