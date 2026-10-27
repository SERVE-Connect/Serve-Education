import React from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Cpu, Presentation as PresentationIcon, Rocket, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HowItWorksProps {
  onStart?: () => void;
}

export function HowItWorks({ onStart }: HowItWorksProps) {
  const { t } = useLanguage();

  const steps = [
    {
      title: t('personalAssessment'),
      desc: t('personalAssessmentDesc'),
      icon: <ClipboardList className="text-indigo-600 dark:text-indigo-400" />,
      color: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    {
      title: t('aiAnalysis'),
      desc: t('aiAnalysisDesc'),
      icon: <Cpu className="text-emerald-600 dark:text-emerald-400" />,
      color: 'bg-emerald-100 dark:bg-emerald-900/30'
    },
    {
      title: t('interactiveRoadmap'),
      desc: t('interactiveRoadmapDesc'),
      icon: <PresentationIcon className="text-amber-600 dark:text-amber-400" />,
      color: 'bg-amber-100 dark:bg-amber-900/30'
    },
    {
      title: t('futurePlanning'),
      desc: t('futurePlanningDesc'),
      icon: <Rocket className="text-rose-600 dark:text-rose-400" />,
      color: 'bg-rose-100 dark:bg-rose-900/30'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('howItWorksTitle')}</h2>
        <p className="text-slate-600 dark:text-slate-400">{t('howItWorksSubtitle')}</p>
      </div>

      <div className="space-y-12">
        {steps.map((step, i) => (
          <div key={step.title} className="flex flex-col md:flex-row gap-8 items-center">
            <div className={`w-20 h-20 shrink-0 ${step.color} rounded-3xl flex items-center justify-center shadow-inner`}>
              {React.cloneElement(step.icon as React.ReactElement<{ size?: number }>, { size: 32 })}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-2 py-1 rounded-md uppercase tracking-wider">{t('step')} {i + 1}</span>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{step.title}</h3>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden md:block">
                <ArrowRight className="text-slate-200 dark:text-slate-700" size={32} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-indigo-600 dark:bg-indigo-700 rounded-[3rem] text-center text-white shadow-2xl shadow-indigo-200 dark:shadow-none">
        <h3 className="text-3xl font-bold mb-4">{t('readyToFindPath')}</h3>
        <p className="text-indigo-100 mb-8 text-lg">{t('joinThousands')}</p>
        <button 
          onClick={onStart}
          className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all"
        >
          {t('getStartedNow')}
        </button>
      </div>
    </motion.div>
  );
}
