import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, BookOpen, GraduationCap, School, Globe, Stethoscope, Heart } from 'lucide-react';
import { AdBanner } from './AdBanner';
import { useLanguage } from '../contexts/LanguageContext';

export function Resources() {
  const { t } = useLanguage();

  const RESOURCES = [
    {
      category: t('topEngineeringColleges'),
      icon: <School className="text-blue-600 dark:text-blue-400" />,
      links: [
        { name: 'Indian Institutes of Technology (IITs)', url: 'https://www.iit.ac.in' },
        { name: 'National Institutes of Technology (NITs)', url: 'https://www.nits.ac.in' },
        { name: 'BITS Pilani', url: 'https://www.bits-pilani.ac.in' },
        { name: 'IIIT Hyderabad', url: 'https://www.iiit.ac.in' }
      ]
    },
    {
      category: t('topMedicalColleges'),
      icon: <Stethoscope className="text-rose-600 dark:text-rose-400" />,
      links: [
        { name: 'AIIMS New Delhi', url: 'https://www.aiims.edu' },
        { name: 'Christian Medical College (CMC) Vellore', url: 'https://www.cmcvellore.ac.in' },
        { name: 'Armed Forces Medical College (AFMC)', url: 'https://afmc.nic.in' },
        { name: 'Maulana Azad Medical College (MAMC)', url: 'https://www.mamc.ac.in' }
      ]
    },
    {
      category: t('topLawManagement'),
      icon: <GraduationCap className="text-amber-600 dark:text-amber-400" />,
      links: [
        { name: 'National Law Schools (NLUs)', url: 'https://www.consortiumofnlus.ac.in' },
        { name: 'Indian Institutes of Management (IIMs)', url: 'https://www.iim.ac.in' },
        { name: 'FMS Delhi', url: 'http://fms.edu' },
        { name: 'XLRI Jamshedpur', url: 'https://www.xlri.ac.in' }
      ]
    },
    {
      category: t('entranceExamPortals'),
      icon: <Globe className="text-indigo-600 dark:text-indigo-400" />,
      links: [
        { name: 'National Testing Agency (NTA)', url: 'https://nta.ac.in' },
        { name: 'JEE Main Portal', url: 'https://jeemain.nta.nic.in' },
        { name: 'NEET UG Portal', url: 'https://neet.nta.nic.in' },
        { name: 'CUET UG Portal', url: 'https://cuet.samarth.ac.in' }
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('educationalResources')}</h2>
        <p className="text-slate-600 dark:text-slate-400">{t('resourcesSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {RESOURCES.map((res) => (
              <div key={res.category} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    {res.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{res.category}</h3>
                </div>
                <div className="space-y-4">
                  {res.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all group"
                    >
                      <span className="font-medium">{link.name}</span>
                      <ExternalLink size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-8 rounded-3xl flex gap-6 items-start">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
              <BookOpen size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">{t('nirfTipTitle')}</h4>
              <p className="text-amber-800 dark:text-amber-200/70 leading-relaxed">
                {t('nirfTipDesc')}
              </p>
              <a 
                href="https://www.nirfindia.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-amber-900 dark:text-amber-400 font-bold hover:underline"
              >
                {t('visitNirf')} <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white px-2">{t('supportYourDreams')}</h3>
          <AdBanner 
            platform="ImpactGuru"
            title={t('crowdfundEducation')}
            description={t('impactGuruDesc')}
            link="https://www.impactguru.com"
            type="funding"
          />
          <AdBanner 
            platform="Kickstarter"
            title={t('bringProjectToLife')}
            description={t('kickstarterDesc')}
            link="https://www.kickstarter.com"
            type="funding"
          />
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <Heart className="text-rose-500" size={18} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">{t('needFinancialAid')}</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('financialAidDesc')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
