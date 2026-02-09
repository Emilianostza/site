import { Asset, Project, ProjectStatus, ProjectType } from '../types';

// Mutable store for the session
let PROJECTS: Project[] = [
    { id: 'PRJ-001', name: 'Summer Menu Update', client: 'Bistro 55', status: ProjectStatus.Published, items: 12, type: 'restaurant_menu' },
    { id: 'PRJ-002', name: 'Fall Collection', client: 'Style Co', status: ProjectStatus.Processing, items: 45, type: 'standard' },
    { id: 'PRJ-003', name: 'Ancient Egypt Exhibit', client: 'History Museum', status: ProjectStatus.QA, items: 8, type: 'standard' },
];

export const getProjects = async (): Promise<Project[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...PROJECTS];
};

export const addProject = async (project: { name: string; client: string; type: ProjectType }): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProject: Project = {
        id: `PRJ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        name: project.name,
        client: project.client,
        status: ProjectStatus.Processing,
        items: 0,
        type: project.type
    };
    PROJECTS.unshift(newProject);
    return newProject;
};

export const getAssets = async (): Promise<Asset[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: 'AST-101', name: 'Cheeseburger Deluxe', thumb: 'https://picsum.photos/seed/burger/100/100', status: 'Published' },
        { id: 'AST-102', name: 'Fries Basket', thumb: 'https://picsum.photos/seed/fries/100/100', status: 'Published' },
        { id: 'AST-103', name: 'Milkshake', thumb: 'https://picsum.photos/seed/shake/100/100', status: 'In Review' },
    ];
};
