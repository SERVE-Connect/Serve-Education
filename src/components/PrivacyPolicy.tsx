import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="bg-indigo-600 dark:bg-indigo-700 px-8 py-12 text-white text-center">
          <Shield size={48} className="mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold mb-2">{t('privacyPolicyTitle')}</h1>
          <p className="text-indigo-100">{t('lastUpdated')}: April 4, 2026</p>
        </div>

        <div className="p-8 md:p-12 space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye size={20} className="text-indigo-600 dark:text-indigo-400" />
              {t('privacySection1Title')}
            </h2>
            <p>
              {t('privacySection1Text')}
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li><strong>{t('personalInfo')}:</strong> {t('personalInfoDesc')}</li>
              <li><strong>{t('assessmentData')}:</strong> {t('assessmentDataDesc')}</li>
              <li><strong>{t('usageData')}:</strong> {t('usageDataDesc')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock size={20} className="text-indigo-600 dark:text-indigo-400" />
              {t('privacySection2Title')}
            </h2>
            <p>{t('privacySection2Text')}</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>{t('useCase1')}</li>
              <li>{t('useCase2')}</li>
              <li>{t('useCase3')}</li>
              <li>{t('useCase4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
              {t('privacySection3Title')}
            </h2>
            <p>
              {t('privacySection3Text')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText size={20} className="text-indigo-600 dark:text-indigo-400" />
              {t('privacySection4Title')}
            </h2>
            <p>
              {t('privacySection4Text')}
            </p>
          </section>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              {t('privacyAgreement')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
