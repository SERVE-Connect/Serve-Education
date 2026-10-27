import React from 'react';
import { motion } from 'motion/react';
import { Code, Stethoscope, Scale, Palette, Briefcase, Microscope, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ExploreCareersProps {
  onSelectCareer: (career: string) => void;
}

export function ExploreCareers({ onSelectCareer }: ExploreCareersProps) {
  const { t } = useLanguage();

  const CATEGORIES = [
    {
      name: t('techEngineering'),
      icon: <Code className="text-blue-600 dark:text-blue-400" />,
      careers: ['Software Engineer', 'Data Scientist', 'Aerospace Engineer', 'Cybersecurity Expert'],
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      name: t('healthcareMedicine'),
      icon: <Stethoscope className="text-rose-600 dark:text-rose-400" />,
      careers: ['Surgeon', 'Psychologist', 'Biotechnologist', 'Dentist'],
      color: 'bg-rose-50 dark:bg-rose-900/20'
    },
    {
      name: t('lawGovernance'),
      icon: <Scale className="text-amber-600 dark:text-amber-400" />,
      careers: ['Corporate Lawyer', 'Civil Servant (IAS/IPS)', 'Diplomat', 'Legal Consultant'],
      color: 'bg-amber-50 dark:bg-amber-900/20'
    },
    {
      name: t('designCreativeArts'),
      icon: <Palette className="text-purple-600 dark:text-purple-400" />,
      careers: ['UX/UI Designer', 'Architect', 'Fashion Designer', 'Animator'],
      color: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      name: t('businessFinance'),
      icon: <Briefcase className="text-emerald-600 dark:text-emerald-400" />,
      careers: ['Investment Banker', 'Chartered Accountant', 'Entrepreneur', 'Marketing Manager'],
      color: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      name: t('pureSciences'),
      icon: <Microscope className="text-indigo-600 dark:text-indigo-400" />,
      careers: ['Astrophysicist', 'Marine Biologist', 'Research Scientist', 'Environmentalist'],
      color: 'bg-indigo-50 dark:bg-indigo-900/20'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('exploreCareerPaths')}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t('exploreCareersSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-6`}>
              {cat.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{cat.name}</h3>
            <div className="space-y-3">
              {cat.careers.map((career) => (
                <button
                  key={career}
                  onClick={() => onSelectCareer(career)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
                >
                  <span className="font-medium">{career}</span>
                  <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
