import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Project } from '@/types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  project?: Project | null;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  project,
}) => {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [type, setType] = useState('standard');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClient(project.client);
      setType(project.type || 'standard');
      setAddress(project.address || '');
      setPhone(project.phone || '');
      setDescription(''); // Project type doesn't have description field in interface?
      setDueDate(''); // Project type doesn't have dueDate field in interface?
      // Wait, looking at types.ts Project interface, it doesn't have description or dueDate.
      // But the previous create form used them. I'll keep them as state but they might not be in project object.
      setPriority('Medium'); // Project doesn't have priority? It has tier.
    } else {
      setName('');
      setClient('');
      setType('standard');
      setAddress('');
      setPhone('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !client.trim()) return;

    setLoading(true);
    try {
      await onSave({ name, client, type, description, dueDate, priority, address, phone });
      if (!project) {
        // Only show success toast here if creating? Or let parent handle it?
        // Parent handles refresh.
        // Reset form if creating
        setName('');
        setClient('');
        setType('standard');
        setAddress('');
        setPhone('');
        setDescription('');
        setDueDate('');
        setPriority('Medium');
      }
      success(`Project "${name}" ${project ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (err) {
      error(`Failed to ${project ? 'update' : 'create'} project`);
      console.error(`Failed to ${project ? 'update' : 'create'} project`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border-b border-brand-200 dark:border-brand-700 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {project ? 'Update Project' : 'New Capture Project'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {project ? 'Edit project details and settings' : 'Create a new 3D capture project'}
          </p>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Essential Fields Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="e.g. Summer Collection 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                What are we capturing?
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Client / Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="e.g. Acme Corp"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Who is commissioning this project?
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-4">
              Project Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="e.g. Retail, Fashion, Restaurant, Museum"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    placeholder="City, State"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Contact
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || !client.trim()}
              className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
