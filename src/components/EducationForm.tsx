import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface EducationData {
  school: string;
  degree: string;
  year: string;
}

interface EducationFormProps {
  education: EducationData[];
  onChange: (education: EducationData[]) => void;
  hideTitle?: boolean;
  isInvalid?: boolean;
  readOnly?: boolean;
}

const GRADE_OPTIONS = ['8th', '9th', '10th', '11th', '12th', 'College Freshman', 'College Sophomore', 'College Junior', 'College Senior', 'Graduate', 'Professional'];

export function EducationForm({ education, onChange, hideTitle, isInvalid, readOnly = false }: EducationFormProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        {!hideTitle && (
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <GraduationCap size={20} className="text-indigo-600 dark:text-indigo-400" /> {t('education')}
          </h3>
        )}
        {!readOnly && (
          <button
            onClick={() => onChange([{ school: '', degree: '', year: '' }, ...education])}
            className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all ml-auto"
          >
            <Plus size={20} />
          </button>
        )}
      </div>
      
      {!readOnly && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Please list your most recent or current education first.
        </p>
      )}

      <div className="space-y-4">
        {readOnly && education.length === 0 && (
          <p className="text-slate-400 dark:text-slate-500 text-sm italic">{t('notSpecified')}</p>
        )}
        {education.map((edu, index) => (
          <div key={index} className={cn(
            "p-4 rounded-2xl relative group",
            readOnly ? "bg-transparent p-0 border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0" : "bg-slate-50 dark:bg-slate-800"
          )}>
            {!readOnly && (
              <button
                onClick={() => onChange(education.filter((_, i) => i !== index))}
                className="absolute top-2 right-2 p-2 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            )}
            <input
              type="text"
              value={edu.school}
              onChange={e => {
                const newEdu = [...education];
                newEdu[index].school = e.target.value;
                onChange(newEdu);
              }}
              readOnly={readOnly}
              className={cn(
                "w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold mb-2 text-sm dark:text-white",
                readOnly ? "bg-transparent p-0 focus:ring-0 mb-1" : "bg-white dark:bg-slate-900"
              )}
              placeholder={readOnly ? t('notSpecified') : "Institution Name"}
            />
            {readOnly ? (
              <p className="text-sm dark:text-white mb-1">{edu.degree || t('notSpecified')}</p>
            ) : (
              <div className="mb-2">
                <select
                  value={GRADE_OPTIONS.includes(edu.degree) ? edu.degree : (edu.degree ? 'Other' : '')}
                  onChange={e => {
                    const newEdu = [...education];
                    newEdu[index].degree = e.target.value;
                    onChange(newEdu);
                  }}
                  className={cn(
                    "w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm dark:text-white",
                    "bg-white dark:bg-slate-900"
                  )}
                >
                  <option value="" disabled>Select Grade / Standard</option>
                  {GRADE_OPTIONS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {(!GRADE_OPTIONS.includes(edu.degree) && edu.degree !== '') && (
                  <input
                    type="text"
                    value={edu.degree === 'Other' ? '' : edu.degree}
                    onChange={e => {
                      const newEdu = [...education];
                      newEdu[index].degree = e.target.value || 'Other'; // keep it as 'Other' if they clear it so the input stays open
                      onChange(newEdu);
                    }}
                    className="w-full p-3 mt-2 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm dark:text-white bg-white dark:bg-slate-900"
                    placeholder="Please specify your grade/standard"
                    autoFocus
                  />
                )}
              </div>
            )}
            <input
              type="text"
              value={edu.year}
              onChange={e => {
                const newEdu = [...education];
                newEdu[index].year = e.target.value;
                onChange(newEdu);
              }}
              readOnly={readOnly}
              className={cn(
                "w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm dark:text-white",
                readOnly ? "bg-transparent p-0 focus:ring-0" : "bg-white dark:bg-slate-900"
              )}
              placeholder={readOnly ? t('notSpecified') : "Year (e.g. 2018 - 2022)"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
