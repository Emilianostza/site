import React from 'react';
import { Check, Clock, Circle, User } from 'lucide-react';
import { ProjectStatus } from '@/types/domain';

interface ProjectProgressProps {
  currentStatus: ProjectStatus;
  projectName: string;
}

const STEPS = [
  {
    id: 'Intake',
    label: 'Intake',
    description: 'Initial request received',
    assignee: 'Operations',
    estimatedDays: 0,
  },
  {
    id: 'Capture',
    label: 'Capture',
    description: 'On-site photography',
    assignee: 'Capture Team',
    estimatedDays: 1,
  },
  {
    id: 'Processing',
    label: 'Processing',
    description: 'Post-processing & optimization',
    assignee: 'Tech Team',
    estimatedDays: 1,
  },
  {
    id: 'QA',
    label: 'QA',
    description: 'Quality assurance review',
    assignee: 'QA Team',
    estimatedDays: 1,
  },
  {
    id: 'Ready for Review',
    label: 'Review',
    description: 'Client review phase',
    assignee: 'Client',
    estimatedDays: 2,
  },
  {
    id: 'Published',
    label: 'Done',
    description: 'Project complete',
    assignee: 'Complete',
    estimatedDays: 0,
  },
];

export const ProjectProgress: React.FC<ProjectProgressProps> = ({ currentStatus, projectName }) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStatus);
  const currentStep = STEPS[currentIndex];

  return (
    <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-0 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Workflow Progress</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            <span className="md:hidden">{projectName.slice(0, 20)}</span>
            <span className="hidden md:inline">{projectName}</span> • Step {currentIndex + 1} of{' '}
            {STEPS.length}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl md:text-3xl font-bold text-brand-600 dark:text-brand-400">
            {Math.round(((currentIndex + 1) / STEPS.length) * 100)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Complete</div>
        </div>
      </div>

      {/* Current Step Context */}
      {currentStep && (
        <div className="mb-6 p-3 md:p-4 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white text-sm md:text-base">
                {currentStep.label}: {currentStep.description}
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-400">
                <User className="w-4 h-4 flex-shrink-0" />
                <span>Assigned to:</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate">
                  {currentStep.assignee}
                </span>
              </div>
            </div>
            <div className="text-sm md:text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">Est. Duration</div>
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  {currentStep.estimatedDays} {currentStep.estimatedDays === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative flex items-center justify-between w-full mb-8">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-brand-600 to-brand-500 rounded-full -z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm text-xs md:text-base
                  ${
                    isCompleted
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                  }
                  ${isCurrent ? 'ring-4 ring-brand-100 dark:ring-brand-900/30 md:scale-125' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Circle className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </div>

              {/* Step Tooltip on Hover - Hidden on mobile, shown on hover/focus */}
              <div
                className={`absolute -bottom-20 md:-bottom-24 left-1/2 -translate-x-1/2 w-32 md:w-40 p-2 md:p-3 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 hidden md:block
                ${isCurrent ? 'opacity-100 pointer-events-auto md:block' : ''}
                bg-slate-900 dark:bg-slate-950 text-white shadow-lg`}
              >
                <div className="font-semibold mb-1 text-xs">{step.label}</div>
                <div className="text-slate-300 text-xs mb-2">{step.description}</div>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <User className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{step.assignee}</span>
                </div>
              </div>

              {/* Labels - Hidden on mobile, shown on desktop */}
              <span
                className={`absolute top-10 md:top-12 text-xs font-semibold whitespace-nowrap transition-colors hidden md:block
                ${isCurrent ? 'text-brand-600 dark:text-brand-400 font-bold scale-110' : 'text-slate-600 dark:text-slate-400'}
              `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400">Completed</div>
          <div className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">
            {currentIndex + 1}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400">In Progress</div>
          <div className="text-lg md:text-xl font-bold text-brand-600 dark:text-brand-400">1</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400">Remaining</div>
          <div className="text-lg md:text-xl font-bold text-slate-600 dark:text-slate-400">
            {STEPS.length - currentIndex - 1}
          </div>
        </div>
      </div>
    </div>
  );
};
