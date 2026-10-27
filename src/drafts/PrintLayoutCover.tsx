import React from 'react';
import { GuidanceResult } from '../types';

export function PrintLayoutCoverDraft({ result }: { result: GuidanceResult }) {
  return (
    <div id="pdf-title-page" className="p-[60px] h-[1267px] w-[896px] flex flex-col justify-center bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
      <div className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] bg-indigo-600 opacity-5 rounded-full"></div>
      <div className="absolute -bottom-[50px] -left-[50px] w-[300px] h-[300px] bg-indigo-500 opacity-5 rounded-full"></div>
      
      <div className="border-l-[12px] border-indigo-600 pl-10 mb-20">
        <h1 className="text-[72px] font-black text-slate-900 m-0 leading-none tracking-tight">Margdarshak</h1>
        <p className="text-[24px] font-semibold text-indigo-600 mt-5 uppercase tracking-[0.2em]">AI-Powered Career Guidance</p>
      </div>
      
      <div className="bg-white p-[48px] rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="mb-8">
          <div className="text-[18px] text-slate-500 font-bold uppercase tracking-[0.1em] mb-4">Personalized Report For</div>
          <div className="text-[48px] font-extrabold text-slate-900 leading-tight">{result.recommendedCareer}</div>
        </div>
        
        <div className="flex gap-12">
          <div>
            <div className="text-[14px] text-slate-400 font-bold uppercase mb-2">Recommended Stream</div>
            <div className="text-[20px] font-bold text-slate-700">{result.recommendedStream}</div>
          </div>
          <div>
            <div className="text-[14px] text-slate-400 font-bold uppercase mb-2">Eligibility Score</div>
            <div className="text-[20px] font-bold text-emerald-500">{result.eligibilityScore}% Match</div>
          </div>
        </div>
      </div>
      
      <div className="mt-20 flex items-center gap-5">
        <div className="w-[48px] h-[2px] bg-slate-200"></div>
        <div className="text-[16px] text-slate-400 font-medium">
          Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
