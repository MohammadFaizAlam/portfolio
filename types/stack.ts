export type StackItem = {
    name: string;
    icon: string;
    featured?: boolean;
    proficiency?: string;
    usage?: string;
};

export type StackCategories = {
    frontend: StackItem[];
    backend: StackItem[];
    database: StackItem[];
    tools: StackItem[];
};

