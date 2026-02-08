import { Industry, ProjectStatus } from '../types';

// Mutable store for the session
let PROJECTS = [
    { id: 'PRJ-001', name: 'Summer Menu Update', client: 'Bistro 55', status: ProjectStatus.Published, items: 12, type: 'restaurant_menu' as const },
    { id: 'PRJ-002', name: 'Fall Collection', client: 'Style Co', status: ProjectStatus.Processing, items: 45, type: 'standard' as const },
    { id: 'PRJ-003', name: 'Ancient Egypt Exhibit', client: 'History Museum', status: ProjectStatus.QA, items: 8, type: 'standard' as const },
];

export const getProjects = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...PROJECTS];
};

export const addProject = async (project: { name: string; client: string; type: 'standard' | 'restaurant_menu' }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProject = {
        id: `PRJ-${Math.floor(Math.random() * 1000)}`,
        name: project.name,
        client: project.client,
        status: ProjectStatus.Processing,
        items: 0,
        type: project.type
    };
    // @ts-ignore
    PROJECTS.unshift(newProject);
    return newProject;
};

export const getAssets = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: 'AST-101', name: 'Cheeseburger Deluxe', thumb: 'https://picsum.photos/seed/burger/100/100', status: 'Published' },
        { id: 'AST-102', name: 'Fries Basket', thumb: 'https://picsum.photos/seed/fries/100/100', status: 'Published' },
        { id: 'AST-103', name: 'Milkshake', thumb: 'https://picsum.photos/seed/shake/100/100', status: 'In Review' },
    ];
};
