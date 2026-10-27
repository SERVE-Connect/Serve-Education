import React, { useState, useRef } from 'react';
import { StudentProfile } from '../types';
import { cn, isProfileComplete, calculateCompletion } from '../lib/utils';
import { GraduationCap, Brain, Heart, Target, BookOpen, ChevronRight, ChevronLeft, X, Briefcase, Loader2, Save, Download, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { BasicInfoForm } from './BasicInfoForm';
import { SelectionList } from './SelectionList';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { getFirstIncompleteStep } from '../lib/utils';
import { ProfileProgressBar } from './ProfileProgressBar';

interface UserDetailsFormProps {
  onSubmit: (profile: StudentProfile) => void;
  onCancel: () => void;
  isLoading: boolean;
  initialData?: Partial<StudentProfile>;
  mode?: 'assessment' | 'profile';
  initialStep?: number;
  pendingIntent?: 'guide' | 'resume' | 'share' | null;
}

const INTERESTS = ['Technology & AI', 'Quantum & Deep Tech', 'Robotics & Automation', 'Bio-Engineering & Genetics', 'Space & Clean Energy', 'Science & Research', 'Arts & Design', 'Business & Finance', 'Law & Governance', 'Medicine & Health', 'Sports', 'Creative Writing'];
const STRENGTHS = ['Problem Solving', 'Analytical Thinking', 'Algorithmic Logic', 'Creativity', 'Communication', 'Leadership', 'Research & Experimentation', 'Systems Architecture', 'Empathy', 'Discipline', 'Public Speaking'];
const SUBJECTS = ['Mathematics', 'Physics', 'Computer Science & AI', 'Chemistry', 'Biology & Biotechnology', 'Economics', 'Psychology & Cognitive Science', 'English', 'History', 'Fine Arts'];

import { ModalShell } from './ModalShell';

export function UserDetailsForm({ onSubmit, onCancel, isLoading, initialData, mode = 'assessment', initialStep, pendingIntent }: UserDetailsFormProps) {
  const { t } = useLanguage();
  
  const [profile, setProfile] = useState<StudentProfile>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    linkedin: initialData?.linkedin || '',
    birthDate: initialData?.birthDate || '',
    summary: initialData?.summary || '',
    grade: initialData?.grade || '',
    interests: initialData?.interests || [],
    strengths: initialData?.strengths || [],
    aspirations: initialData?.aspirations || initialData?.careerAspirations || '',
    preferredSubjects: initialData?.preferredSubjects || initialData?.academicPreferences || [],
    isFresher: initialData?.isFresher ?? false,
    hasNoProjects: initialData?.hasNoProjects ?? false,
    experience: initialData?.experience || [],
    education: initialData?.education || [],
    skills: initialData?.skills || [],
    projects: initialData?.projects || [],
  });

  const [step, setStep] = useState(() => {
    if (initialStep) return initialStep;
    return getFirstIncompleteStep(profile) || 1;
  });

  const [error, setError] = useState<string | null>(null);
  const [highlightIncomplete, setHighlightIncomplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "profile_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setProfile({ ...profile, ...json });
      } catch (err) {
        console.error("Failed to parse JSON", err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isComplete = isProfileComplete(profile);

  const headerActions = (
    <div className="flex items-center gap-1 mr-2">
      <input 
        type="file" 
        accept=".json" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImport} 
      />
      {isComplete ? (
        <button 
          onClick={handleExport}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
          title="Download Profile JSON"
        >
          <Download size={20} />
        </button>
      ) : (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
          title="Upload Profile JSON"
        >
          <Upload size={20} />
        </button>
      )}
    </div>
  );

  const toggleItem = (list: string[], item: string, key: keyof StudentProfile) => {
    setError(null);
    const newList = list.includes(item) 
      ? list.filter(i => i !== item) 
      : [...list, item];
    setProfile({ ...profile, [key]: newList });
  };

  const nextStep = () => {
    setHighlightIncomplete(true);
    if (step === 1) {
      if (!profile.fullName?.trim() || !profile.phone?.trim() || !profile.location?.trim() || !profile.birthDate) {
        setError(t('fillAllRequiredFields'));
        return;
      }
    }
    if (step === 2) {
      if (!profile.grade || profile.education.length === 0 || profile.skills.length === 0) {
        setError(t('fillAllRequiredFields'));
        return;
      }
    }
    if (step === 3) {
      if (!profile.isFresher && (profile.experience?.length === 0)) {
        setError('Please add your experience or mark as Fresher');
        return;
      }
      if (!profile.hasNoProjects && (profile.projects?.length === 0)) {
        setError('Please add your projects or mark as No Projects');
        return;
      }
    }
    if (step === 4) {
      if (profile.interests.length < 2 || profile.strengths.length < 2) {
        setError(t('selectMinInterests'));
        return;
      }
    }
    if (step === 5) {
      if (profile.preferredSubjects.length < 2) {
        setError(t('selectMinSubjects'));
        return;
      }
    }
    setError(null);
    setHighlightIncomplete(false);
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setError(null);
    setHighlightIncomplete(false);
    setStep(s => s - 1);
  };

  const handleFinalSubmit = () => {
    setHighlightIncomplete(true);
    if (!profile.aspirations.trim()) {
      setError(t('shareAspirations'));
      return;
    }
    onSubmit(profile);
  };

  const footer = (
    <div className="flex items-center justify-between">
      <div className="flex-1 flex items-center gap-4">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ChevronLeft size={20} /> {t('back')}
          </button>
        )}
        {error ? (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-rose-600 dark:text-rose-400 text-sm font-medium flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 bg-rose-600 dark:bg-rose-400 rounded-full animate-pulse" />
            {error}
          </motion.div>
        ) : initialStep ? (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-amber-600 dark:text-amber-400 text-sm font-medium flex items-center gap-2"
          >
            <Target size={16} />
            {t('completeYourProfileToProceed')}
          </motion.div>
        ) : null}
      </div>
      
      <div className="flex items-center gap-4">
        {step < 5 && (mode === 'profile' || pendingIntent) && (
          <button 
            onClick={() => onSubmit(profile)}
            disabled={isLoading || !isProfileComplete(profile)}
            className="flex items-center gap-2 px-6 py-3 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isProfileComplete(profile) ? t('fillAllRequiredFields') : t('save')}
          >
            <Save size={20} />
            <span>{t('save')}</span>
          </button>
        )}

        {step < 5 ? (
          <button 
            onClick={nextStep}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            {t('next')} <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            onClick={handleFinalSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {t('saving')}
              </>
            ) : t('saveProfile')}
          </button>
        )}
      </div>
    </div>
  );

  const getStepTitle = () => {
    if (step === 1) return t('basicInfo');
    if (step === 2) return 'Education & Skills';
    if (step === 3) return 'Experience & Projects';
    if (step === 4) return t('interestsStrengths');
    if (step === 5) return 'Preferences & Aspirations';
    return '';
  };

  const completionPercentage = calculateCompletion(profile);

  return (
    <ModalShell
      isOpen={true}
      onClose={onCancel}
      title={
        <ProfileProgressBar 
          completionPercentage={completionPercentage}
          variant="inline"
          className="w-full"
        />
      }
      progress={{ current: step, total: 5 }}
      footer={footer}
      maxWidth="max-w-4xl"
      headerActions={headerActions}
    >
      <div className="max-w-2xl mx-auto">
        <div className="min-h-[400px] pt-4">
          {step === 1 && (
            <div className="space-y-6">
              <BasicInfoForm 
                data={profile} 
                onChange={(data) => setProfile({ ...profile, ...data })} 
                highlightIncomplete={highlightIncomplete}
              />
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex gap-4 items-start">
                <GraduationCap className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  {t('earlyStartTip')}
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12">
              <EducationForm
                education={profile.education ?? []}
                onChange={(education) => setProfile({ ...profile, education, grade: education[0]?.degree || '' })}
                isInvalid={highlightIncomplete && profile.education.length === 0}
              />
              <SkillsForm
                skills={profile.skills ?? []}
                onChange={(skills) => setProfile({ ...profile, skills })}
                isInvalid={highlightIncomplete && profile.skills.length === 0}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12">
              <ExperienceForm 
                isFresher={profile.isFresher ?? false} 
                experience={profile.experience ?? []} 
                onChange={(data) => setProfile({ ...profile, ...data })} 
                isInvalid={highlightIncomplete && !profile.isFresher && profile.experience.length === 0}
              />
              <ProjectsForm
                hasNoProjects={profile.hasNoProjects ?? false}
                projects={profile.projects ?? []}
                onChange={(data) => setProfile({ ...profile, ...data })}
                isInvalid={highlightIncomplete && !profile.hasNoProjects && profile.projects.length === 0}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className={cn(highlightIncomplete && profile.interests.length < 2 && "p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20")}>
                <span className="text-slate-700 dark:text-slate-300 font-medium mb-3 block flex items-center gap-2">
                  <Heart size={18} className="text-rose-500" /> {t('whatAreYouInterestedIn')}
                </span>
                <SelectionList
                  items={INTERESTS}
                  selectedItems={profile.interests}
                  onChange={(items) => setProfile({ ...profile, interests: items })}
                  color="indigo"
                  placeholder="Add other interest..."
                />
              </div>
              <div className={cn(highlightIncomplete && profile.strengths.length < 2 && "p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20")}>
                <span className="text-slate-700 dark:text-slate-300 font-medium mb-3 block flex items-center gap-2">
                  <Brain size={18} className="text-amber-500" /> {t('whatAreYourStrengths')}
                </span>
                <SelectionList
                  items={STRENGTHS}
                  selectedItems={profile.strengths}
                  onChange={(items) => setProfile({ ...profile, strengths: items })}
                  color="indigo"
                  placeholder="Add other strength..."
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-12">
              <div className={cn(highlightIncomplete && profile.preferredSubjects.length < 2 && "p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20")}>
                <span className="text-slate-700 dark:text-slate-300 font-medium mb-3 block flex items-center gap-2">
                  <BookOpen size={18} className="text-emerald-500" /> {t('preferredSubjects')}
                </span>
                <SelectionList
                  items={SUBJECTS}
                  selectedItems={profile.preferredSubjects}
                  onChange={(items) => setProfile({ ...profile, preferredSubjects: items })}
                  variant="grid"
                  color="indigo"
                  placeholder="Add other subject..."
                />
              </div>
              <label className="block">
                <span className="text-slate-700 dark:text-slate-300 font-medium mb-2 block flex items-center gap-2">
                  <Target size={18} className="text-indigo-600 dark:text-indigo-400" /> {t('specificCareerAspirations')}
                </span>
                <textarea
                  className={cn(
                    "w-full p-4 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px] resize-none transition-all",
                    highlightIncomplete && !profile.aspirations.trim() ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
                  )}
                  placeholder={t('aspirationsPlaceholder')}
                  value={profile.aspirations}
                  onChange={e => setProfile({ ...profile, aspirations: e.target.value })}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
