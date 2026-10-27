import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Rocket, Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ProjectData {
  name: string;
  description: string;
  link: string;
}

interface ProjectsFormProps {
  hasNoProjects: boolean;
  projects: ProjectData[];
  onChange: (data: { hasNoProjects?: boolean; projects?: ProjectData[] }) => void;
  hideTitle?: boolean;
  isInvalid?: boolean;
  readOnly?: boolean;
}

export function ProjectsForm({ hasNoProjects, projects, onChange, hideTitle, isInvalid, readOnly = false }: ProjectsFormProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {!hideTitle && (
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Rocket size={20} className="text-indigo-600 dark:text-indigo-400" /> {t('projects')}
            </h3>
          )}
          {!readOnly && projects.length === 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onChange({ hasNoProjects: !hasNoProjects, projects: [] });
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                hasNoProjects 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" 
                  : isInvalid
                    ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800 animate-pulse"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700"
              )}
            >
              {hasNoProjects ? 'No Projects' : 'Mark as No Projects'}
            </button>
          )}
        </div>
        {!readOnly && !hasNoProjects && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onChange({ hasNoProjects: false, projects: [...projects, { name: '', description: '', link: '' }] });
            }}
            className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
          >
            <Plus size={20} />
          </button>
        )}
      </div>
      <div className="space-y-6">
        {readOnly && !hasNoProjects && projects.length === 0 && (
          <p className="text-slate-400 dark:text-slate-500 text-sm italic">{t('notSpecified')}</p>
        )}
        {!hasNoProjects && projects.map((project, index) => (
          <div key={index} className={cn(
            "p-4 rounded-2xl relative group",
            readOnly ? "bg-transparent p-0 border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0" : "bg-slate-50 dark:bg-slate-800"
          )}>
            {!readOnly && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onChange({ projects: projects.filter((_, i) => i !== index) });
                }}
                className="absolute top-2 right-2 p-2 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            )}
            <input
              type="text"
              value={project.name}
              onChange={e => {
                const newProj = [...projects];
                newProj[index].name = e.target.value;
                onChange({ projects: newProj });
              }}
              readOnly={readOnly}
              className={cn(
                "w-full p-2 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold mb-2 text-sm dark:text-white",
                readOnly ? "bg-transparent p-0 focus:ring-0 mb-1" : "bg-white dark:bg-slate-900"
              )}
              placeholder={readOnly ? t('notSpecified') : "Project Name"}
            />
            <textarea
              value={project.description}
              onChange={e => {
                const newProj = [...projects];
                newProj[index].description = e.target.value;
                onChange({ projects: newProj });
              }}
              readOnly={readOnly}
              className={cn(
                "w-full p-2 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 transition-all h-16 resize-none text-xs mb-2 dark:text-white",
                readOnly ? "bg-transparent p-0 focus:ring-0 h-auto min-h-[3rem] mb-1" : "bg-white dark:bg-slate-900"
              )}
              placeholder={readOnly ? t('notSpecified') : "Description"}
            />
            <input
              type="text"
              value={project.link}
              onChange={e => {
                const newProj = [...projects];
                newProj[index].link = e.target.value;
                onChange({ projects: newProj });
              }}
              readOnly={readOnly}
              className={cn(
                "w-full p-2 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs dark:text-white",
                readOnly ? "bg-transparent p-0 focus:ring-0" : "bg-white dark:bg-slate-900"
              )}
              placeholder={readOnly ? t('notSpecified') : "Project Link (optional)"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
