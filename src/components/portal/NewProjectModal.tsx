import React, { useCallback, useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useToast } from '@/contexts/ToastContext';
import { Project } from '@/types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    client: string;
    type: string;
    description: string;
    dueDate: string;
    priority: string;
    address: string;
    phone: string;
  }) => Promise<void>;
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
  useEscapeKey(
    useCallback(() => onClose(), [onClose]),
    isOpen
  );

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-project-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border-b border-brand-200 dark:border-brand-700 p-6">
          <h2
            id="new-project-title"
            className="text-xl font-bold text-zinc-900 dark:text-white mb-1"
          >
            {project ? 'Update Project' : 'New Capture Project'}
          </h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">
            {project ? 'Edit project details and settings' : 'Create a new 3D capture project'}
          </p>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Essential Fields Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
                placeholder="e.g. Summer Collection 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                What are we capturing?
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                Client / Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
                placeholder="e.g. Acme Corp"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Who is commissioning this project?
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wide mb-4">
              Project Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
                  placeholder="e.g. Restaurant, Fashion, General"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
                    placeholder="City, State"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-2">
                    Contact
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-700 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
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
