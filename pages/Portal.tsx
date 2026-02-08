import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ProjectStatus } from '../types';
import { Sidebar } from '../components/portal/Sidebar';
import { ProjectTable, Project } from '../components/portal/ProjectTable';
import { AssetGrid, Asset } from '../components/portal/AssetGrid';
import { getProjects, getAssets, addProject } from '../services/mockData';
import { NewProjectModal } from '../components/portal/NewProjectModal';

import { ProjectType } from '../types';

const Portal: React.FC<{ role: 'employee' | 'customer' }> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'customers'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = async (data: { name: string; client: string; type: ProjectType }) => {
    await addProject(data);
    const [projData, assetData] = await Promise.all([getProjects(), getAssets()]);
    // @ts-ignore
    setProjects(projData);
    setActiveTab('projects');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projData, assetData] = await Promise.all([getProjects(), getAssets()]);
        // @ts-ignore
        setProjects(projData);
        // @ts-ignore
        setAssets(assetData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Loading Portal...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50" data-component="Portal Dashboard" data-file="src/pages/Portal.tsx">
      <Sidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} />
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateProject}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-slate-500">Welcome back, {role === 'employee' ? 'Admin' : 'Client'}.</p>
          </div>
          {role === 'employee' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          )}
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium mb-2">Active Projects</div>
                <div className="text-3xl font-bold text-slate-900">12</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium mb-2">Assets in Review</div>
                <div className="text-3xl font-bold text-orange-600">5</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium mb-2">Published Assets</div>
                <div className="text-3xl font-bold text-green-600">148</div>
              </div>
            </div>

            {/* Recent Assets */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Assets</h2>
              <AssetGrid assets={assets} role={role} />
            </div>
          </div>
        )}

        {/* Projects Table */}
        {(activeTab === 'projects' || activeTab === 'customers') && (
          <ProjectTable projects={projects} />
        )}
      </main>
    </div>
  );
};

export default Portal;