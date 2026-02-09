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

export const addProject = async (project: { name: string; client: string; type: ProjectType; address?: string; phone?: string }): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProject: Project = {
        id: `PRJ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        name: project.name,
        client: project.client,
        status: ProjectStatus.Processing,
        items: 0,
        type: project.type,
        address: project.address,
        phone: project.phone
    };
    PROJECTS.unshift(newProject);
    return newProject;
};

// Mutable store for assets
let ASSETS: Asset[] = [
    { id: 'AST-101', name: 'Cheeseburger Deluxe', thumb: 'https://picsum.photos/seed/burger/400/300', status: 'Published', type: 'Food & Beverage', size: '12MB', updated: '2 days ago' },
    { id: 'AST-102', name: 'Fries Basket', thumb: 'https://picsum.photos/seed/fries/400/300', status: 'Published', type: 'Food & Beverage', size: '8MB', updated: '1 week ago' },
    { id: 'AST-103', name: 'Milkshake', thumb: 'https://picsum.photos/seed/shake/400/300', status: 'In Review', type: 'Food & Beverage', size: '15MB', updated: '3 hours ago' },
];

export const getAssets = async (): Promise<Asset[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...ASSETS];
};

export const saveAsset = async (assetData: Partial<Asset>): Promise<Asset> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if updating existing
    const existingIndex = ASSETS.findIndex(a => a.id === assetData.id);

    if (existingIndex >= 0) {
        // Update existing
        const updatedAsset = { ...ASSETS[existingIndex], ...assetData };
        ASSETS[existingIndex] = updatedAsset as Asset;
        return updatedAsset as Asset;
    } else {
        // Create new
        const newAsset: Asset = {
            id: assetData.id || `AST-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
            name: assetData.name || 'Untitled Scene',
            thumb: assetData.thumb || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
            status: 'In Review',
            type: assetData.type || '3D Model',
            size: assetData.size || 'Unknown',
            updated: 'Just now'
        };
        ASSETS.unshift(newAsset);
        return newAsset;
    }
};
