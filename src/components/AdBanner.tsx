import React from 'react';
import { ExternalLink, Megaphone } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdBannerProps {
  platform: string;
  title: string;
  description: string;
  link: string;
  type?: 'education' | 'funding';
}

export function AdBanner({ platform, title, description, link, type = 'education' }: AdBannerProps) {
  const { t } = useLanguage();
  const isFunding = type === 'funding';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl border ${isFunding ? 'bg-slate-900 border-rose-900/30' : 'bg-slate-900 border-indigo-900/30'} flex items-start gap-4 group cursor-pointer hover:shadow-xl transition-all hover:border-indigo-500/50`}
      onClick={() => window.open(link, '_blank')}
    >
      <div className={`p-2 rounded-xl ${isFunding ? 'bg-rose-900/30 text-rose-400' : 'bg-indigo-900/30 text-indigo-400'}`}>
        <Megaphone size={20} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isFunding ? 'text-rose-400' : 'text-indigo-400'}`}>
            {isFunding ? t('featuredFunding') : t('featuredCourse')} • {platform}
          </span>
          <ExternalLink size={14} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
