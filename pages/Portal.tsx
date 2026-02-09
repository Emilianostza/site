import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Box } from 'lucide-react';
import { Asset, Project, ProjectType } from '../types';
import { NewProjectModal } from '../components/portal/NewProjectModal';
import { ProjectTable } from '../components/portal/ProjectTable';
import { AssetGrid } from '../components/portal/AssetGrid';
import { ProjectProgress } from '../components/portal/ProjectProgress';
import { ActivityFeed } from '../components/portal/ActivityFeed';
import { getProjects, getAssets, addProject } from '../services/mockData';

const Portal: React.FC<{ role: 'employee' | 'customer' }> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'customers'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = async (data: { name: string; client: string }) => {
    await addProject({ ...data, type: 'standard' });
    const projData = await getProjects();
    setProjects(projData);
    setActiveTab('projects');
  };

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [projData, assetData] = await Promise.all([getProjects(), getAssets()]);
        if (!cancelled) {
          setProjects(projData);
          setAssets(assetData);
        }
      } catch (error) {
        if (!cancelled) console.error("Failed to fetch data", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
        Loading Portal...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900" data-component="Portal Dashboard" data-file="src/pages/Portal.tsx">
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateProject}
      />


      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-3 bg-brand-600 rounded-xl text-white hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
              title="Back to Dashboard"
            >
              <Box className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">Welcome back, {role === 'employee' ? 'Admin' : 'Client'}.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {role === 'employee' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Project
              </button>
            )}
            <button className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium">
              Settings
            </button>
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-medium no-underline">
              Sign Out
            </Link>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {role === 'customer' ? (
              // Client Dashboard View
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <ProjectProgress
                      currentStatus={projects[0]?.status || 'Intake'}
                      projectName={projects[0]?.name || 'New Project'}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <ActivityFeed />
                  </div>
                </div>

                {/* Quick Actions for Client */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-6 rounded-xl shadow-lg text-white">
                    <h3 className="font-bold text-lg mb-2">Request New Capture</h3>
                    <p className="text-brand-100 text-sm mb-4">Ready to scan more items? Start a new project request.</p>
                    <button className="bg-white text-brand-700 px-4 py-2 rounded-lg font-bold text-sm w-full hover:bg-brand-50 transition-colors">
                      Start Request
                    </button>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Download Assets</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Get all approved assets in a single zip file.</p>
                    <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-bold text-sm w-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      Download All
                    </button>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Support</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Need help with your models or the portal?</p>
                    <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-bold text-sm w-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      Contact Us
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Employee Dashboard View (Stats)
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Active Projects</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">12</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Assets in Review</div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">5</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Published Assets</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">148</div>
                </div>
              </div>
            )}

            {/* Recent Assets (Shared) */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Assets</h2>
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