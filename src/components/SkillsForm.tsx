import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Code } from 'lucide-react';
import { SelectionList } from './SelectionList';
import { cn } from '../lib/utils';

const PREDEFINED_SKILLS = [
  'Python', 'JavaScript', 'React', 'Data Analysis', 'Machine Learning', 
  'Project Management', 'Public Speaking', 'UI/UX Design', 'Digital Marketing', 
  'Content Writing', 'Graphic Design', 'Financial Analysis'
];

interface SkillsFormProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  hideTitle?: boolean;
  readOnly?: boolean;
  isInvalid?: boolean;
}

export function SkillsForm({ skills, onChange, hideTitle, readOnly = false, isInvalid }: SkillsFormProps) {
  const { t } = useLanguage();

  return (
    <div className={cn("space-y-6 transition-all", isInvalid && "p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20")}>
      {!hideTitle && (
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Code size={20} className="text-indigo-600 dark:text-indigo-400" /> {t('skills')}
        </h3>
      )}
      <SelectionList
        items={PREDEFINED_SKILLS}
        selectedItems={skills}
        onChange={onChange}
        color="indigo"
        placeholder={t('addSkill')}
        readOnly={readOnly}
      />
    </div>
  );
}
