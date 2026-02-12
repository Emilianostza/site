import React from 'react';
import { Project } from '@/types';
import { ProjectStatus } from '@/types/domain';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectTableProps {
    projects: Project[];
}

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                    <tr>
                        <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">ID</th>
                        <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Project Name</th>
                        <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Client</th>
                        <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                        <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Items</th>
                        <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {projects.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                            <td className="p-4 text-sm text-slate-500 dark:text-slate-400 font-mono">{p.id}</td>
                            <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{p.name}</td>
                            <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{p.client}</td>
                            <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === ProjectStatus.Delivered ? 'bg-green-100 text-green-800' :
                                    p.status === ProjectStatus.InProgress ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {p.status}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{p.items}</td>
                            <td className="p-4">
                                {p.type === 'restaurant_menu' ? (
                                    <Link to={`/project/${p.id}/menu`} className="text-brand-600 hover:text-brand-800 text-sm font-bold flex items-center gap-1">
                                        <ExternalLink className="w-4 h-4" /> View Menu
                                    </Link>
                                ) : (
                                    <button className="text-brand-600 hover:text-brand-800 text-sm font-bold">Manage</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
