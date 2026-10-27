import React, { useState } from 'react';
import { GuidanceResult, CareerSlide } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, FileDown, Loader2 } from 'lucide-react';
import { exportToPDF } from '../lib/pdfExport';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import { ModalShell } from './ModalShell';
import { SlideContent, getIcon } from './SlideContent';

interface PresentationProps {
  result: GuidanceResult;
  onReset: () => void;
  onSelectRelatedCareer: (career: string) => void;
  username?: string;
}

export function Presentation({ result, onReset, onSelectRelatedCareer, username }: PresentationProps) {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const next = () => setCurrentSlide(s => Math.min((result.slides?.length || 1) - 1, s + 1));
  const prev = () => setCurrentSlide(s => Math.max(0, s - 1));

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(result, username);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const slides = result.slides || [];
  const slide = slides[currentSlide];

  if (!slide) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold mb-4 dark:text-white">No guidance content available</h2>
        <button onClick={onReset} className="text-indigo-600 font-bold hover:underline">
          {t('startNewAssessment')}
        </button>
      </div>
    );
  }

  const headerActions = (
    <button 
      onClick={handleExport}
      disabled={isExporting}
      className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-all disabled:opacity-50"
      title={t('exportPdf')}
    >
      {isExporting ? <Loader2 className="animate-spin" size={24} /> : <FileDown size={24} />}
    </button>
  );

  const footer = (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1.5 w-8 rounded-full transition-all",
              currentSlide === i ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-200 dark:bg-slate-700'
            )}
          />
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={prev}
          disabled={currentSlide === 0}
          className="p-3 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all text-slate-600 dark:text-slate-400"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          disabled={currentSlide === slides.length - 1}
          className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );

  return (
    <ModalShell
      isOpen={true}
      onClose={onReset}
      title={result.recommendedCareer}
      subtitle={`${t('recommendedStream')}: ${result.recommendedStream}`}
      headerActions={headerActions}
      footer={footer}
      maxWidth="max-w-4xl"
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="presentation-slide"
          >
            <SlideContent 
              slide={slide} 
              result={result} 
              onSelectRelatedCareer={onSelectRelatedCareer} 
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </ModalShell>
  );
}
