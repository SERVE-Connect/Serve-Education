import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ExperienceData {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface ExperienceFormProps {
  isFresher: boolean;
  experience: ExperienceData[];
  onChange: (data: { isFresher?: boolean; experience?: ExperienceData[] }) => void;
  hideTitle?: boolean;
  isInvalid?: boolean;
  readOnly?: boolean;
}

export function ExperienceForm({ isFresher, experience, onChange, hideTitle, isInvalid, readOnly = false }: ExperienceFormProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {!hideTitle && (
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Briefcase size={20} className="text-indigo-600 dark:text-indigo-400" /> {t('experience')}
            </h3>
          )}
          {!readOnly && experience.length === 0 && (
            <button
              onClick={() => onChange({ isFresher: !isFresher, experience: [] })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                isFresher 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" 
                  : isInvalid
                    ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800 animate-pulse"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700"
              )}
            >
              {isFresher ? 'Fresher' : 'Mark as Fresher'}
            </button>
          )}
        </div>
        {!readOnly && !isFresher && (
          <button
            onClick={() => onChange({ isFresher: false, experience: [...experience, { company: '', role: '', duration: '', description: '' }] })}
            className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
          >
            <Plus size={20} />
          </button>
        )}
      </div>
      
      {isFresher ? (
        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl text-center">
          <p className="text-slate-500 dark:text-slate-400">You have marked yourself as a fresher. Experience section will be omitted.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {readOnly && experience.length === 0 && (
            <p className="text-slate-400 dark:text-slate-500 text-sm italic">{t('notSpecified')}</p>
          )}
          {experience.map((exp, index) => (
          <div key={index} className={cn(
            "p-6 rounded-3xl relative group",
            readOnly ? "bg-transparent p-0 border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0" : "bg-slate-50 dark:bg-slate-800"
          )}>
            {!readOnly && (
              <button
                onClick={() => onChange({ experience: experience.filter((_, i) => i !== index) })}
                className="absolute top-4 right-4 p-2 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={18} />
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={exp.role}
                onChange={e => {
                  const newExp = [...experience];
                  newExp[index].role = e.target.value;
                  onChange({ experience: newExp });
                }}
                readOnly={readOnly}
                className={cn(
                  "w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold dark:text-white",
                  readOnly ? "bg-transparent p-0 focus:ring-0" : "bg-white dark:bg-slate-900"
                )}
                placeholder={readOnly ? t('notSpecified') : "Role (e.g. Software Engineer)"}
              />
              <input
                type="text"
                value={exp.company}
                onChange={e => {
                  const newExp = [...experience];
                  newExp[index].company = e.target.value;
                  onChange({ experience: newExp });
                }}
                readOnly={readOnly}
                className={cn(
                  "w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white",
                  readOnly ? "bg-transparent p-0 focus:ring-0" : "bg-white dark:bg-slate-900"
                )}
                placeholder={readOnly ? t('notSpecified') : "Company"}
              />
            </div>
            <input
              type="text"
              value={exp.duration}
              onChange={e => {
                const newExp = [...experience];
                newExp[index].duration = e.target.value;
                onChange({ experience: newExp });
              }}
              readOnly={readOnly}
              className={cn(
                "w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all mb-4 text-sm dark:text-white",
                readOnly ? "bg-transparent p-0 focus:ring-0 mb-2" : "bg-white dark:bg-slate-900"
              )}
              placeholder={readOnly ? t('notSpecified') : "Duration (e.g. Jan 2022 - Present)"}
            />
            <textarea
              value={exp.description}
              onChange={e => {
                const newExp = [...experience];
                newExp[index].description = e.target.value;
                onChange({ experience: newExp });
              }}
              readOnly={readOnly}
              className={cn(
                "w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all h-24 resize-none text-sm dark:text-white",
                readOnly ? "bg-transparent p-0 focus:ring-0 h-auto min-h-[4rem]" : "bg-white dark:bg-slate-900"
              )}
              placeholder={readOnly ? t('notSpecified') : "Describe your responsibilities and achievements..."}
            />
          </div>
          ))}
        </div>
      )}
    </div>
  );
}
