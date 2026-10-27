import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Info, 
  GraduationCap, 
  Users, 
  Trophy, 
  Lightbulb, 
  Globe, 
  ShieldCheck,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function OpenSchooling() {
  const { t } = useLanguage();
  const boards = t('boards') as unknown as any[];
  const prosCons = t('prosCons') as unknown as { pros: string[], cons: string[] };
  const successStories = t('openSchoolingStories') as unknown as any[];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-20"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold mb-6">
          <Globe size={16} /> {t('empoweringAltEducation')}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          {t('openSchoolingTitle').split('India')[0]}<span className="text-emerald-600 dark:text-emerald-400">India</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          {t('openSchoolingSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Recent Developments */}
          <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <Lightbulb className="text-amber-500" /> {t('recentDevelopments')}
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                {t('nepDescription')}
              </p>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-emerald-800 dark:text-emerald-300 text-sm font-medium">
                  {t('nepQuote')}
                </p>
              </div>
            </div>
          </section>

          {/* Pros & Cons */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-6 flex items-center gap-2">
                <CheckCircle2 size={20} /> {t('advantages')}
              </h3>
              <ul className="space-y-4">
                {prosCons.pros.map((pro, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-rose-700 dark:text-rose-400 mb-6 flex items-center gap-2">
                <XCircle size={20} /> {t('challenges')}
              </h3>
              <ul className="space-y-4">
                {prosCons.cons.map((con, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Boards & Affiliation */}
          <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3">
              <ShieldCheck className="text-indigo-600 dark:text-indigo-400" /> {t('recognizedBoards')}
            </h2>
            <div className="space-y-6">
              {boards.map((board) => (
                <div key={board.name} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{board.name}</h3>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{board.type} Board</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{board.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Eligibility</span>
                      <span className="text-xs text-slate-700 dark:text-slate-300">{board.eligibility}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Key Features</span>
                      <div className="flex flex-wrap gap-1">
                        {board.features.map((f: string) => (
                          <span key={f} className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum & Streams */}
          <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <BookOpen className="text-blue-600 dark:text-blue-400" /> {t('curriculumSubjectChoice')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-white">{t('academicStreams')}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('academicStreamsDesc')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Science', 'Commerce', 'Humanities', 'Vocational'].map(s => (
                    <span key={s} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold">{s}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-white">{t('vocationalIntegration')}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('vocationalIntegrationDesc')}
                </p>
              </div>
            </div>
          </section>

          {/* Success Stories */}
          <section className="bg-indigo-900 p-10 rounded-[3rem] text-white overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Trophy className="text-amber-400" /> {t('successStoriesTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {successStories.map((story) => (
                  <div key={story.name} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <h4 className="text-lg font-bold mb-1">{story.name}</h4>
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3 block">{story.achievement}</span>
                    <p className="text-sm text-indigo-100 leading-relaxed italic">"{story.story}"</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
          </section>
        </div>

        {/* Sidebar Support */}
        <div className="space-y-8">
          <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 dark:shadow-none">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle /> {t('needSupport')}
            </h3>
            <p className="text-emerald-50 mb-6 text-sm leading-relaxed">
              {t('needSupportDesc')}
            </p>
            <div className="space-y-3">
              <a href="https://nios.ac.in" target="_blank" className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group">
                <span className="text-sm font-bold">{t('officialNiosPortal')}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#" className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group">
                <span className="text-sm font-bold">{t('homeschoolersIndia')}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <GraduationCap className="text-indigo-600 dark:text-indigo-400" /> {t('scholarships')}
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{t('niosFeeWaiver')}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('niosFeeWaiverDesc')}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{t('nationalScholarshipPortal')}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('nationalScholarshipPortalDesc')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Users className="text-amber-600 dark:text-amber-400" /> {t('careerOpportunities')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {t('careerOpportunitiesDesc')}
            </p>
            <ul className="space-y-2">
              {['UPSC / Civil Services', 'Armed Forces (NDA)', 'IITs & NITs', 'Medical (NEET)', 'Foreign Universities'].map(item => (
                <li key={item} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30">
            <div className="flex items-center gap-3 mb-3">
              <Info className="text-amber-600 dark:text-amber-400" size={20} />
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">{t('didYouKnow')}</h4>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
              {t('didYouKnowDesc')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
