import React from 'react';
import { ProjectStatus, Project } from '../../types';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectTableProps {
    projects: Project[];
}

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">ID</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Project Name</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Client</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Items</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {projects.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-4 text-sm text-slate-500 font-mono">{p.id}</td>
                            <td className="p-4 text-sm font-bold text-slate-900">{p.name}</td>
                            <td className="p-4 text-sm text-slate-600">{p.client}</td>
                            <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === ProjectStatus.Published ? 'bg-green-100 text-green-800' :
                                    p.status === ProjectStatus.Processing ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {p.status}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-slate-600">{p.items}</td>
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
