import React, { useState } from 'react';
import { Project, Asset } from '@/types';
import { ProjectStatus } from '@/types/domain';
import { ExternalLink, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AssetGrid } from '@/components/portal/AssetGrid';

interface ProjectTableProps {
  projects: Project[];
  assets?: Asset[];
  onEditProject?: (projectId: string) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  assets = [],
  onEditProject,
}) => {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const toggleExpand = (projectId: string) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
    } else {
      setExpandedProjectId(projectId);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
          <tr>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              ID
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Brand
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Client
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Status
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Items
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {projects.map((p) => (
            <React.Fragment key={p.id}>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-700">
                <td className="p-4 text-sm text-slate-500 dark:text-slate-400 font-mono">{p.id}</td>
                <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">
                  <button
                    onClick={() => toggleExpand(p.id)}
                    className="hover:text-brand-600 transition-colors text-left"
                  >
                    {p.name}
                  </button>
                </td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{p.client}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.status === ProjectStatus.Delivered
                        ? 'bg-green-100 text-green-800'
                        : p.status === ProjectStatus.InProgress
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{p.items}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    {onEditProject && (
                      <button
                        onClick={() => onEditProject(p.id)}
                        className="text-brand-600 hover:text-brand-800 text-sm font-bold flex items-center gap-1 text-left"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {expandedProjectId === p.id && (
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td colSpan={6} className="p-4">
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded text-xs">
                            Project Assets
                          </span>
                        </h3>
                      </div>
                      <AssetGrid
                        assets={assets.filter((a) => a.project_id === p.id)}
                        role="employee"
                      />
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
