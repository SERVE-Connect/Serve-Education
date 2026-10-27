import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  progress?: {
    current: number;
    total: number;
  };
  maxWidth?: string;
  headerActions?: React.ReactNode;
}

export function ModalShell({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  footer, 
  progress,
  maxWidth = "max-w-5xl",
  headerActions
}: ModalShellProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-0 md:p-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className={cn(
          "bg-white dark:bg-slate-900 w-full h-screen lg:h-[90vh] lg:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative",
          maxWidth
        )}
      >
        {/* Header */}
        <div className="flex-none px-6 py-4 md:px-8 md:py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-white dark:bg-slate-900 z-20 relative">
          <div className="flex-1 pr-8">
            {typeof title === 'string' ? (
              <div className="space-y-0.5">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
                {subtitle && <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
              </div>
            ) : (
              title
            )}
          </div>
          
          <div className="flex items-center gap-2 absolute top-4 right-6 md:top-5 md:right-8 z-30">
            {headerActions}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
              title="Close"
            >
              <X size={24} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Progress Bar (Optional) */}
        {progress && (
          <div className="flex-none h-1 w-full bg-slate-100 dark:bg-slate-800 flex">
            {[...Array(progress.total)].map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-full flex-1 transition-all duration-500",
                  i < progress.current ? "bg-indigo-600 dark:bg-indigo-500" : "bg-transparent"
                )} 
              />
            ))}
          </div>
        )}
        
        {/* Content Area */}
        <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/20 overflow-y-auto">
          <div className="h-full w-full p-6 md:p-10">
            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex-none px-6 py-4 md:px-8 md:py-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-20">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
}
