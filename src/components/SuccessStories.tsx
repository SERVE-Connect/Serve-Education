import React from 'react';
import { motion } from 'motion/react';
import { Quote, Award, Star, ExternalLink, Heart, Loader2 } from 'lucide-react';
import { AdBanner } from './AdBanner';
import { useLanguage } from '../contexts/LanguageContext';

const STORY_IMAGES = [
  'https://picsum.photos/seed/ananya/200/200',
  'https://picsum.photos/seed/rohan/200/200',
  'https://picsum.photos/seed/priya/200/200',
  'https://picsum.photos/seed/arjun/200/200'
];

interface SuccessStoriesProps {
  onStart: () => void;
  isLoading?: boolean;
}

export function SuccessStories({ onStart, isLoading }: SuccessStoriesProps) {
  const { t } = useLanguage();
  const stories = t('stories') as unknown as any[];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('successStoriesTitle')}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t('successStoriesSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stories.map((story, index) => (
          <motion.div 
            key={story.name}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
              <div className="relative">
                <img 
                  src={STORY_IMAGES[index]} 
                  alt={story.name} 
                  className="w-20 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg">
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{story.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{story.career}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono uppercase tracking-widest">{story.path}</p>
              </div>
            </div>

            <div className="relative mb-6">
              <Quote className="absolute -top-4 -left-4 text-slate-100 dark:text-slate-700" size={48} />
              <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed relative z-10">
                "{story.story}"
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-700">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('topAchievement')}</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{story.achievement}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 bg-indigo-50 dark:bg-indigo-900/10 p-12 rounded-[3rem] border border-indigo-100 dark:border-indigo-900/30 text-center flex flex-col justify-center">
          <h3 className="text-3xl font-bold text-indigo-900 dark:text-indigo-300 mb-4">{t('startYourOwnStory')}</h3>
          <p className="text-indigo-700 dark:text-indigo-400 mb-8 max-w-xl mx-auto text-lg">
            {t('startYourOwnStoryDesc')}
          </p>
          <div className="flex justify-center">
            <button 
              onClick={onStart}
              disabled={isLoading}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {t('generating')}
                </>
              ) : (
                t('beginAssessment')
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white px-2">{t('supportYourDreams')}</h3>
          <AdBanner 
            platform="ImpactGuru"
            title="Crowdfund Your Education"
            description="Start a fundraiser for your higher studies or medical needs. 0% platform fee."
            link="https://www.impactguru.com"
            type="funding"
          />
          <AdBanner 
            platform="Kickstarter"
            title="Bring Your Project to Life"
            description="The world's largest community for creative projects. Get funded today."
            link="https://www.kickstarter.com"
            type="funding"
          />
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <Heart className="text-rose-500" size={18} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">{t('needFinancialAid')}</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('needFinancialAidDesc')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
