import React from 'react';
import { GuidanceResult } from '../types';
import { SlideContent } from './SlideContent';
import { useLanguage } from '../contexts/LanguageContext';

export function PrintLayout({ result, username }: { result: GuidanceResult, username?: string }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white text-slate-900 font-sans [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans" style={{ width: '896px' }}>
      {/* Title Page */}
      <div id="pdf-title-page" className="p-[60px] h-[1267px] w-[896px] flex flex-col justify-center bg-[#0B1120] relative overflow-hidden">
        {/* Decorative elements matching the new design */}
        <div className="absolute -top-[150px] -left-[150px] w-[400px] h-[400px] bg-[#1E293B] opacity-50 rounded-full"></div>
        <div className="absolute -bottom-[200px] -right-[200px] w-[600px] h-[600px] bg-[#1E293B] opacity-50 rounded-full"></div>
        
        {/* Logo (Top Right) */}
        <div className="absolute top-[60px] right-[60px] w-[160px] h-[160px] flex items-center justify-center opacity-40">
          <img src="/logo.svg" alt="SERVE Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
        
        <div className="border-l-[4px] border-indigo-500 pl-8 mb-24 relative z-10">
          <h1 className="text-[64px] font-bold text-white m-0 leading-none tracking-tight">Margdarshak</h1>
          <p className="text-[20px] font-semibold text-indigo-500 mt-4 uppercase tracking-wider">Powered by SERVE</p>
        </div>
        
        <div className="bg-[#1E293B]/80 backdrop-blur-sm p-[48px] rounded-[24px] shadow-2xl border border-slate-700/50 relative z-10">
          <div className="mb-10">
            <div className="text-[14px] text-slate-400 font-medium uppercase tracking-wider mb-4">
              Personalized AI-Generated Report For {username ? username.toUpperCase() : ''}
            </div>
            <div className="text-[48px] font-bold text-white leading-tight">{result.recommendedCareer}</div>
          </div>
          
          <div className="flex gap-16">
            <div>
              <div className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-2">Recommended Stream</div>
              <div className="text-[18px] font-bold text-white">{result.recommendedStream}</div>
            </div>
            <div>
              <div className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-2">Eligibility Score</div>
              <div className="text-[18px] font-bold text-emerald-400">{result.eligibilityScore}% Match</div>
            </div>
          </div>
        </div>
        
        <div className="mt-24 flex items-center gap-4 relative z-10">
          <div className="w-[40px] h-[1px] bg-slate-600"></div>
          <div className="text-[14px] text-slate-400 font-medium">
            Generated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Content Slides */}
      {result.slides.map((slide, index) => (
        <div key={index} data-slide-index={index} className="p-[48px] h-[1267px] w-[896px] bg-white flex flex-col page-break-after-always">
          <div className="flex-1 flex flex-col">
            <SlideContent slide={slide} result={result} isExport={true} />
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center text-slate-400 font-semibold">
            <div>Margdarshak Career Guidance Report</div>
            <div>Slide {index + 1} of {result.slides.length}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
