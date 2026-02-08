import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjects, getAssets } from '../../services/mockData';
import { ArrowLeft, Box, ChefHat } from 'lucide-react';
import { Project } from '../../types';

const RestaurantMenu: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projects = await getProjects();
                // @ts-ignore
                const found = projects.find(p => p.id === id);
                if (found) setProject(found);
            } catch (e) {
                console.error("Failed to load project");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="bg-stone-950 min-h-screen text-amber-50 flex items-center justify-center">Loading Menu...</div>;
    if (!project) return <div className="bg-stone-950 min-h-screen text-amber-50 flex items-center justify-center">Menu Not Found</div>;

    // Mock Menu Items (in a real app, these would be filtered by project)
    const menuItems = [
        {
            name: "Signature Burger",
            desc: "Wagyu beef, aged cheddar, truffle aioli on brioche.",
            price: "$24",
            image: "https://picsum.photos/seed/burger/400/300",
            calories: "850 kcal"
        },
        {
            name: "Truffle Fries",
            desc: "Hand-cut fries, parmesan dust, black truffle oil.",
            price: "$12",
            image: "https://picsum.photos/seed/fries/400/300",
            calories: "450 kcal"
        },
        {
            name: "Artisan Shake",
            desc: "Vanilla bean, salted caramel, gold leaf topping.",
            price: "$16",
            image: "https://picsum.photos/seed/shake/400/300",
            calories: "600 kcal"
        }
    ];

    return (
        <div className="min-h-screen bg-stone-950 text-amber-50 font-sans selection:bg-amber-900 selection:text-white pb-20" data-component="Restaurant Menu Template" data-file="src/pages/templates/RestaurantMenu.tsx">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/app/dashboard" className="text-stone-400 hover:text-white flex items-center gap-2 text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <div className="font-serif text-xl font-bold tracking-wider text-amber-500">
                        {project.client.toUpperCase()}
                    </div>
                    <div className="w-20"></div> {/* Spacer for center alignment */}
                </div>
            </nav>

            {/* Hero */}
            <header className="pt-32 pb-16 px-4 text-center">
                <div className="w-16 h-16 bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 border border-amber-900/50">
                    <ChefHat className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{project.project_name || project.name}</h1>
                <p className="text-stone-400 max-w-lg mx-auto text-lg">
                    Experience our culinary masterpieces in interactive 3D before you order.
                </p>
            </header>

            {/* Menu Grid */}
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {menuItems.map((item, idx) => (
                        <div key={idx} className="group relative bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-700 transition-all hover:shadow-2xl hover:shadow-amber-900/10">
                            {/* 3D Viewer Placeholder */}
                            <div className="relative aspect-[4/3] bg-stone-800 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity scale-105 group-hover:scale-100 duration-700"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button className="bg-amber-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
                                        <Box className="w-4 h-4" /> View in 3D
                                    </button>
                                </div>
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-stone-300">
                                    AR READY
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold font-serif">{item.name}</h3>
                                    <span className="text-amber-500 font-bold font-mono">{item.price}</span>
                                </div>
                                <p className="text-stone-400 text-sm mb-4 leading-relaxed">
                                    {item.desc}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-stone-500 font-mono uppercase tracking-widest">
                                    <span>{item.calories}</span>
                                    <span>•</span>
                                    <span>Chef's Choice</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="mt-20 text-center text-stone-600 text-sm">
                <p>Powered by Managed Capture 3D</p>
            </footer>
        </div>
    );
};

export default RestaurantMenu;
