import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

interface ProfileProgressBarProps {
  completionPercentage: number;
  showAction?: boolean;
  onAction?: () => void;
  actionText?: string;
  className?: string;
  variant?: 'card' | 'inline';
}

export function ProfileProgressBar({
  completionPercentage,
  showAction = false,
  onAction,
  actionText,
  className,
  variant = 'card'
}: ProfileProgressBarProps) {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative",
        variant === 'card' && "mb-8 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Rocket size={18} className="text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-bold text-slate-900 dark:text-white">{t('completeYourProfile')}</h4>
            <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full">
              {completionPercentage}%
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('profileCompletionDesc')}
          </p>
        </div>
        {showAction && onAction && (
          <button 
            onClick={onAction}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
          >
            <Plus size={16} />
            {actionText || t('addMissingDetails')}
          </button>
        )}
      </div>
      
      <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
        />
      </div>

      {/* Decorative background element */}
      {variant === 'card' && (
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      )}
    </motion.div>
  );
}
