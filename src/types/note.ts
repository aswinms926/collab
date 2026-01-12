export interface Version {
    id: string;
    content: any; // TipTap JSON
    timestamp: number;
}

export interface Note {
    id: string;
    title: string;
    content: any; // TipTap JSON
    updatedAt: number;
    versions: Version[];
}
