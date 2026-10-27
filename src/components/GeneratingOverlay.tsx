import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Cpu, Rocket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface GeneratingOverlayProps {
  isVisible: boolean;
}

export function GeneratingOverlay({ isVisible }: GeneratingOverlayProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl"
        >
          <div className="text-center max-w-md px-6">
            <div className="relative mb-12">
              {/* Animated Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-8 border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-16 border-2 border-dashed border-emerald-200 dark:border-emerald-900/30 rounded-full"
              />
              
              {/* Central Icon */}
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 dark:shadow-none overflow-hidden">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Brain size={64} className="text-white" />
                </motion.div>
                
                {/* Floating Particles */}
                <motion.div
                  animate={{ 
                    x: [0, 40, 0],
                    y: [0, -40, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  className="absolute top-4 right-4"
                >
                  <Sparkles size={16} className="text-indigo-200" />
                </motion.div>
                <motion.div
                  animate={{ 
                    x: [0, -30, 0],
                    y: [0, 30, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-6 left-6"
                >
                  <Cpu size={16} className="text-emerald-200" />
                </motion.div>
              </div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              {t('generating')}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed"
            >
              Our AI is analyzing your profile to create a personalized career roadmap...
            </motion.p>

            <div className="mt-12 flex justify-center gap-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                  className="w-3 h-3 bg-indigo-600 rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
