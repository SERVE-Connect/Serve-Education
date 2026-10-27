import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

export interface BasicInfoData {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  birthDate?: string;
  summary?: string;
}

interface BasicInfoFormProps {
  data: BasicInfoData;
  onChange: (data: Partial<BasicInfoData>) => void;
  readOnly?: boolean;
  highlightIncomplete?: boolean;
}

export function BasicInfoForm({ data, onChange, readOnly = false, highlightIncomplete = false }: BasicInfoFormProps) {
  const { t } = useLanguage();
  
  const isFieldMissing = (val: string | undefined) => highlightIncomplete && !val?.trim();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('fullName')}</label>
        <input
          type="text"
          value={data.fullName || ''}
          onChange={e => onChange({ fullName: e.target.value })}
          readOnly={readOnly}
          className={cn(
            "w-full p-4 rounded-2xl border transition-all dark:text-white",
            readOnly ? "bg-transparent p-0 focus:ring-0 border-transparent" : "bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500",
            isFieldMissing(data.fullName) ? "border-rose-500 ring-1 ring-rose-500" : "border-transparent"
          )}
          placeholder={readOnly ? t('notSpecified') : "John Doe"}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('emailAddress')}</label>
        <input
          type="email"
          value={data.email || ''}
          onChange={e => onChange({ email: e.target.value })}
          readOnly={readOnly}
          className={cn(
            "w-full p-4 rounded-2xl border transition-all dark:text-white",
            readOnly ? "bg-transparent p-0 focus:ring-0 border-transparent" : "bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500",
            isFieldMissing(data.email) ? "border-rose-500 ring-1 ring-rose-500" : "border-transparent"
          )}
          placeholder={readOnly ? t('notSpecified') : "john@example.com"}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('phoneNumber')}</label>
        <input
          type="text"
          value={data.phone || ''}
          onChange={e => onChange({ phone: e.target.value })}
          readOnly={readOnly}
          className={cn(
            "w-full p-4 rounded-2xl border transition-all dark:text-white",
            readOnly ? "bg-transparent p-0 focus:ring-0 border-transparent" : "bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500",
            isFieldMissing(data.phone) ? "border-rose-500 ring-1 ring-rose-500" : "border-transparent"
          )}
          placeholder={readOnly ? t('notSpecified') : "98765 43210"}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('location')}</label>
        <input
          type="text"
          value={data.location || ''}
          onChange={e => onChange({ location: e.target.value })}
          readOnly={readOnly}
          className={cn(
            "w-full p-4 rounded-2xl border transition-all dark:text-white",
            readOnly ? "bg-transparent p-0 focus:ring-0 border-transparent" : "bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500",
            isFieldMissing(data.location) ? "border-rose-500 ring-1 ring-rose-500" : "border-transparent"
          )}
          placeholder={readOnly ? t('notSpecified') : "Mumbai, India"}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">LinkedIn Username</label>
        <input
          type="text"
          value={data.linkedin || ''}
          onChange={e => onChange({ linkedin: e.target.value })}
          readOnly={readOnly}
          className={cn(
            "w-full p-4 rounded-2xl border transition-all dark:text-white",
            readOnly ? "bg-transparent p-0 focus:ring-0 border-transparent" : "bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500",
            "border-transparent"
          )}
          placeholder={readOnly ? t('notSpecified') : "johndoe"}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Birth Date</label>
        <input
          type="date"
          value={data.birthDate || ''}
          onChange={e => onChange({ birthDate: e.target.value })}
          readOnly={readOnly}
          className={cn(
            "w-full p-4 rounded-2xl border transition-all dark:text-white",
            readOnly ? "bg-transparent p-0 focus:ring-0 border-transparent" : "bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500",
            isFieldMissing(data.birthDate) ? "border-rose-500 ring-1 ring-rose-500" : "border-transparent"
          )}
        />
      </div>
      <div className="md:col-span-2 space-y-2">
        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('professionalSummary')}</label>
        <textarea
          value={data.summary || ''}
          onChange={e => onChange({ summary: e.target.value })}
          readOnly={readOnly}
          className={cn(
            "w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 resize-none dark:text-white",
            readOnly ? "bg-transparent p-0 focus:ring-0 h-auto min-h-[4rem]" : "bg-slate-50 dark:bg-slate-800"
          )}
          placeholder={readOnly ? t('notSpecified') : "Briefly describe your professional background and goals..."}
        />
      </div>
    </div>
  );
}
