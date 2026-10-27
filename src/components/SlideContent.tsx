import React from 'react';
import { CareerSlide, GuidanceResult } from '../types';
import Markdown from 'react-markdown';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronRight, Briefcase, ExternalLink, Gift, Building2, AlertCircle, BookOpen, Clock, GraduationCap, Info, Map, TrendingUp, Rocket, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AdBanner } from './AdBanner';
import { motion } from 'motion/react';

const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe'];

export const getIcon = (type: CareerSlide['type'], title: string) => {
  if (title === 'Eligibility Analysis') return <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />;
  if (title === 'Skill Gap & Courses') return <AlertCircle className="text-amber-600 dark:text-amber-400" />;
  if (title === 'Scholarships & Sponsorships') return <Gift className="text-rose-600 dark:text-rose-400" />;
  if (title === 'Internship Opportunities') return <Briefcase className="text-emerald-600 dark:text-emerald-400" />;
  switch (type) {
    case 'overview': return <Info className="text-indigo-600 dark:text-indigo-400" />;
    case 'roadmap': return <Map className="text-emerald-600 dark:text-emerald-400" />;
    case 'market': return <TrendingUp className="text-amber-600 dark:text-amber-400" />;
    case 'future': return <Rocket className="text-rose-600 dark:text-rose-400" />;
    case 'skills': return <Lightbulb className="text-indigo-600 dark:text-indigo-400" />;
  }
};

interface SlideContentProps {
  slide: CareerSlide;
  result: GuidanceResult;
  onSelectRelatedCareer?: (career: string) => void;
  isExport?: boolean;
}

export function SlideContent({ slide, result, onSelectRelatedCareer, isExport = false }: SlideContentProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          {getIcon(slide.type, slide.title)}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{slide.title}</h2>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="markdown-body pr-4">
          <Markdown>{slide.content}</Markdown>
          
          {slide.type === 'overview' && result.relatedCareers?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">{t('exploreRelatedCareers')}</h3>
              <div className="flex flex-wrap gap-3">
                {result.relatedCareers.map((career) => (
                  <button
                    key={career}
                    onClick={() => onSelectRelatedCareer?.(career)}
                    disabled={isExport}
                    className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-2 group disabled:opacity-100"
                  >
                    {career}
                    {!isExport && <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {slide.title === 'Internship Opportunities' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">{t('featuredInternships')}</h3>
                {(result.internships || []).map((internship) => (
                  <div key={internship.title} className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <Briefcase size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{internship.title}</h4>
                        <p className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest mb-2">{internship.company}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg font-medium">Duration: {internship.duration}</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg font-medium">Type: {internship.type}</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg font-medium">Stipend: {internship.stipend}</span>
                        </div>
                        <a 
                          href={internship.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1"
                        >
                          {t('applyNow')} <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-indigo-400 mb-2">{t('buildPortfolioTip')}</h4>
                <p className="text-xs text-indigo-400 leading-relaxed font-medium">
                  {t('buildPortfolioDesc')}
                </p>
              </div>
            </div>
          )}

          {slide.title === 'Scholarships & Sponsorships' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">{t('availableScholarships')}</h3>
                {(result.scholarships || []).map((scholarship) => (
                  <div key={scholarship.name} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-rose-200 dark:hover:border-rose-900/50 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
                        <Gift size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{scholarship.name}</h4>
                        <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-2">{scholarship.provider}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg font-medium">Amount: {scholarship.amount}</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg font-medium">Eligibility: {scholarship.eligibility}</span>
                        </div>
                        <a 
                          href={scholarship.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1"
                        >
                          {t('applyNow')} <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">{t('corporateSponsorships')}</h3>
                {(result.sponsorships || []).map((sponsorship) => (
                  <div key={sponsorship.name} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Building2 size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{sponsorship.name}</h4>
                        <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">{sponsorship.company}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{sponsorship.description}</p>
                        <a 
                          href={sponsorship.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                        >
                          {t('learnMore')} <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.title === 'Skill Gap & Courses' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertCircle size={16} /> {t('areasForImprovement')}
                </h3>
                <div className="space-y-4">
                  {(result.improvementAreas || []).map((area) => (
                    <div key={area.skill} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <h4 className="text-sm font-bold text-white mb-1">{area.skill}</h4>
                      <p className="text-xs text-slate-400 mb-2">{area.description}</p>
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg uppercase tracking-tighter">
                        Impact: {area.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">{t('suggestedCourses')}</h3>
                {(result.suggestedCourses || []).map((course) => (
                  <div key={course.title} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm flex items-start gap-4 group hover:border-indigo-500/50 transition-all">
                    <div className="p-2 bg-indigo-900/30 text-indigo-400 rounded-xl">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{course.platform}</span>
                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1"><Clock size={10} /> {course.duration}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2">{course.title}</h4>
                      <a 
                        href={course.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        {t('enrollNow')} <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <AdBanner 
                  platform="Coursera"
                  title="Master Data Science Specialization"
                  description="Join 1M+ students learning top skills from IBM and Google. Get 7-day free trial."
                  link="https://www.coursera.org"
                />
                <div className="mt-4">
                  <AdBanner 
                    platform="LinkedIn Learning"
                    title="Unlock Premium Skills"
                    description="Access 16,000+ expert-led courses. Start your free month today."
                    link="https://www.linkedin.com/learning"
                  />
                </div>
              </div>
            </div>
          )}

          {slide.title === 'Eligibility Analysis' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={isExport ? "#e2e8f0" : "currentColor"}
                    strokeWidth="12"
                    fill="transparent"
                    className={isExport ? "" : "text-slate-200 dark:text-slate-700"}
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={isExport ? "#4f46e5" : "currentColor"}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={552.92}
                    strokeDashoffset={552.92 - (552.92 * result.eligibilityScore) / 100}
                    className={isExport ? "" : "text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-out"}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">{result.eligibilityScore}%</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">{t('eligibility')}</span>
                </div>
              </div>
              
              <div className="w-full space-y-4">
                {(result.eligibilityCriteria || []).map((item) => (
                  <div key={item.label} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-white">{item.label}</span>
                      <span className="text-sm font-bold text-indigo-400">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      {isExport ? (
                        <div 
                          style={{ width: `${item.score}%` }}
                          className="h-full bg-indigo-500"
                        />
                      ) : (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          className="h-full bg-indigo-500"
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{item.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'market' && slide.data && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">{t('salaryInsights')}</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={slide.data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isExport ? '#64748b' : 'currentColor' }} className="dark:text-slate-400" />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: 'var(--tw-bg-slate-800)', color: 'white' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive={!isExport}>
                      {slide.data.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 italic">
                {t('marketTrendsNotice')}
              </p>
            </div>
          )}

          {slide.type === 'overview' && slide.title !== 'Eligibility Analysis' && (
            <div className="flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-[300px]">
                  <div className={isExport ? "absolute inset-0 bg-indigo-100 dark:bg-indigo-900/20 rounded-full opacity-50" : "absolute inset-0 bg-indigo-100 dark:bg-indigo-900/20 rounded-full animate-pulse opacity-50"} />
                  <div className={isExport ? "absolute inset-4 bg-indigo-200 dark:bg-indigo-900/30 rounded-full opacity-50" : "absolute inset-4 bg-indigo-200 dark:bg-indigo-900/30 rounded-full animate-pulse delay-75 opacity-50"} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap size={80} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
