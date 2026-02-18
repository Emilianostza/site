import React, { useState } from 'react';
import { Project, Asset } from '@/types';
import { ProjectStatus } from '@/types/domain';
import {
  ExternalLink,
  Edit,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
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
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              ID
            </th>
            <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Project Name
            </th>
            <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Client
            </th>
            <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Status
            </th>
            <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Assets
            </th>
            <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {projects.map((p) => (
            <React.Fragment key={p.id}>
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-100 dark:border-zinc-800">
                <td className="p-4 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  {p.id.slice(0, 8)}
                </td>
                <td className="p-4 text-sm font-semibold text-zinc-900 dark:text-white">
                  <button
                    onClick={() => toggleExpand(p.id)}
                    className="flex items-center gap-2 hover:text-brand-600 transition-colors text-left w-full"
                  >
                    {expandedProjectId === p.id ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    )}
                    {p.name}
                  </button>
                </td>
                <td className="p-4 text-sm text-zinc-600 dark:text-zinc-300">{p.client}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {p.status === ProjectStatus.Delivered ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : p.status === ProjectStatus.InProgress ? (
                      <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    )}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.status === ProjectStatus.Delivered
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : p.status === ProjectStatus.InProgress
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm text-zinc-600 dark:text-zinc-300">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 text-xs font-semibold">
                    {p.items} item{p.items !== 1 ? 's' : ''}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onEditProject?.(p.id)}
                    className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-sm font-semibold transition-colors"
                    title="Edit project details"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </td>
              </tr>
              {expandedProjectId === p.id && (
                <tr className="bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-900">
                  <td colSpan={6} className="p-6">
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                          <span className="text-brand-700 dark:text-brand-300 font-bold text-sm">
                            {assets.filter((a) => a.project_id === p.id).length}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white">
                            Captured Assets
                          </h3>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            3D models and deliverables
                          </p>
                        </div>
                      </div>
                      {assets.filter((a) => a.project_id === p.id).length > 0 ? (
                        <AssetGrid
                          assets={assets.filter((a) => a.project_id === p.id)}
                          role="employee"
                        />
                      ) : (
                        <div className="text-center py-10 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                          <p className="text-sm text-zinc-400 dark:text-zinc-500">
                            No assets captured yet. Assets will appear here once the capture is
                            complete.
                          </p>
                        </div>
                      )}
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
