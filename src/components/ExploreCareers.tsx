import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Code, Stethoscope, Scale, Palette, Briefcase, Microscope, 
  ChevronRight, Brain, Atom, Cpu, Rocket, Dna, Zap, 
  Sparkles, Search, GraduationCap, ArrowRight 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ExploreCareersProps {
  onSelectCareer: (career: string) => void;
  onNavigateToResources?: () => void;
}

interface CareerItem {
  name: string;
  isFrontier?: boolean;
  desc?: string;
  recommendedStream?: string;
}

interface Category {
  id: string;
  name: string;
  tag: string;
  isFrontierCategory?: boolean;
  icon: React.ReactNode;
  accentBg: string;
  borderColor: string;
  careers: CareerItem[];
}

export function ExploreCareers({ onSelectCareer, onNavigateToResources }: ExploreCareersProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const CATEGORIES: Category[] = [
    {
      id: 'frontier-ai-superintelligence',
      name: 'Frontier AI & Superintelligence',
      tag: 'frontier',
      isFrontierCategory: true,
      icon: <Brain className="text-violet-500 dark:text-violet-400" size={26} />,
      accentBg: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300',
      borderColor: 'border-violet-200 dark:border-violet-800/60 hover:border-violet-500',
      careers: [
        { name: 'AGI & Superintelligence', isFrontier: true, desc: 'Artificial General Intelligence architectures, reasoning models & AI safety alignment', recommendedStream: 'Science (PCM) + CS' },
        { name: 'Quantum Physics & Computing', isFrontier: true, desc: 'Quantum algorithms, qubit hardware, topological matter & cryogenic systems', recommendedStream: 'Science (PCM) / Pure Physics' },
        { name: 'Robotics & Autonomous Systems', isFrontier: true, desc: 'Humanoid robotics, sensor fusion, spatial AI & industrial teleoperation', recommendedStream: 'Science (PCM) / Mechatronics' },
        { name: 'Neuromorphic Computing & AI Chips', isFrontier: true, desc: 'Brain-inspired silicon, spiking neural networks & ultra-low power hardware', recommendedStream: 'Science (PCM) / Microelectronics' },
        { name: 'Autonomous Mobility & Drone Systems', isFrontier: true, desc: 'Self-driving perception stacks, aerial robotics & autonomous logistics', recommendedStream: 'Science (PCM) / Aerospace' }
      ]
    },
    {
      id: 'bioengineering-longevity',
      name: 'Bio-Engineering & Longevity',
      tag: 'frontier',
      isFrontierCategory: true,
      icon: <Dna className="text-emerald-500 dark:text-emerald-400" size={26} />,
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-500',
      careers: [
        { name: 'Bio-Engineering & Longevity', isFrontier: true, desc: 'Cellular rejuvenation, telomere biology, regenerative medicine & healthspan tech', recommendedStream: 'Science (PCMB) / Biotech' },
        { name: 'Neuroscience & Brain-Computer Interface', isFrontier: true, desc: 'Neural implants, EEG signal processing, sensory prosthetics & cognitive interfaces', recommendedStream: 'Science (PCMB) / Cognitive Sci' },
        { name: 'Synthetic Biology & Genomics', isFrontier: true, desc: 'CRISPR gene editing, engineered biocatalysts & DNA data storage', recommendedStream: 'Science (PCMB) / Genetics' },
        { name: 'Nanomedicine & Targeted Therapeutics', isFrontier: true, desc: 'Nanoparticle drug delivery, targeted cancer immunotherapy & mRNA vaccines', recommendedStream: 'Science (PCMB) / Chemistry' },
        { name: 'Bionic Systems & Neural Prosthetics', isFrontier: true, desc: 'Electromechanical limb integration, neural bridging & cybernetic augmentation', recommendedStream: 'Science (PCM/PCMB) / Biomedical' }
      ]
    },
    {
      id: 'deep-science-space',
      name: 'Space Tech, Fusion & Nanotech',
      tag: 'frontier',
      isFrontierCategory: true,
      icon: <Atom className="text-cyan-500 dark:text-cyan-400" size={26} />,
      accentBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300',
      borderColor: 'border-cyan-200 dark:border-cyan-800/60 hover:border-cyan-500',
      careers: [
        { name: 'Fusion Energy & Space Tech', isFrontier: true, desc: 'Tokamak plasma physics, nuclear fusion reactors & interplanetary propulsion', recommendedStream: 'Science (PCM) / Nuclear Physics' },
        { name: 'Material Science & Nanotech', isFrontier: true, desc: '2D materials, metamaterials, room-temperature superconductors & aerogels', recommendedStream: 'Science (PCM) / Materials' },
        { name: 'Commercial Spaceflight & Orbital Mechanics', isFrontier: true, desc: 'Launch vehicle trajectory optimization, satellite constellations & space habitats', recommendedStream: 'Science (PCM) / Aerospace' },
        { name: 'CleanTech, Hydrogen & Next-Gen Energy', isFrontier: true, desc: 'Solid-state batteries, green hydrogen electrolysis & grid-scale storage', recommendedStream: 'Science (PCM) / Chemical Eng' },
        { name: 'Quantum Cryptography & Defense Systems', isFrontier: true, desc: 'Quantum key distribution (QKD), post-quantum cybersecurity & secure networks', recommendedStream: 'Science (PCM) / Quantum Info' }
      ]
    },
    {
      id: 'tech-engineering',
      name: t('techEngineering'),
      tag: 'tech',
      icon: <Code className="text-blue-600 dark:text-blue-400" size={26} />,
      accentBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      borderColor: 'border-slate-200 dark:border-slate-800 hover:border-blue-500',
      careers: [
        { name: 'Software Engineer', desc: 'Distributed systems, scalable cloud apps & web architecture', recommendedStream: 'Science (PCM)' },
        { name: 'Data Scientist & AI Architect', desc: 'Statistical modeling, predictive pipelines & enterprise ML models', recommendedStream: 'Science (PCM) / Statistics' },
        { name: 'Aerospace Engineer', desc: 'Avionics, aerodynamic design & rocket propulsion systems', recommendedStream: 'Science (PCM)' },
        { name: 'Cybersecurity Specialist', desc: 'Threat intelligence, network defense & zero-trust security', recommendedStream: 'Science (PCM)' },
        { name: 'Cloud & Distributed Systems Architect', desc: 'High-availability infrastructure, Kubernetes & microservices', recommendedStream: 'Science (PCM)' }
      ]
    },
    {
      id: 'healthcare-medicine',
      name: t('healthcareMedicine'),
      tag: 'health',
      icon: <Stethoscope className="text-rose-600 dark:text-rose-400" size={26} />,
      accentBg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300',
      borderColor: 'border-slate-200 dark:border-slate-800 hover:border-rose-500',
      careers: [
        { name: 'Surgeon & Precision Oncology', desc: 'Minimally invasive robotic surgery & personalized cancer protocols', recommendedStream: 'Science (PCB) - MBBS/MS' },
        { name: 'Biotechnologist', desc: 'Industrial fermentation, molecular diagnostic kits & recombinant vaccines', recommendedStream: 'Science (PCB/PCMB)' },
        { name: 'Neuropsychologist & Cognitive Scientist', desc: 'Brain mapping, behavioral health diagnostics & cognitive recovery', recommendedStream: 'Humanities / Science' },
        { name: 'Clinical Geneticist', desc: 'Rare disease genomic sequencing & genetic counseling', recommendedStream: 'Science (PCB)' },
        { name: 'Dentist & Maxillofacial Specialist', desc: 'Implantology, regenerative dental tissue & 3D surgical guides', recommendedStream: 'Science (PCB) - BDS/MDS' }
      ]
    },
    {
      id: 'pure-sciences',
      name: t('pureSciences'),
      tag: 'science',
      icon: <Microscope className="text-indigo-600 dark:text-indigo-400" size={26} />,
      accentBg: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
      borderColor: 'border-slate-200 dark:border-slate-800 hover:border-indigo-500',
      careers: [
        { name: 'Theoretical Astrophysicist', desc: 'Black hole mechanics, gravitational waves & cosmic radiation', recommendedStream: 'Science (PCM) - BS/MS' },
        { name: 'Molecular Biophysicist', desc: 'Protein folding dynamics, cryo-EM imaging & molecular machines', recommendedStream: 'Science (PCMB)' },
        { name: 'Climate Modeler & Environmental Scientist', desc: 'Atmospheric fluid dynamics, ocean currents & carbon cycle analysis', recommendedStream: 'Science (PCM/PCB)' },
        { name: 'Marine Biologist & Oceanographer', desc: 'Deep-sea hydrothermal ecosystems & marine biodiversity conservation', recommendedStream: 'Science (PCB)' }
      ]
    },
    {
      id: 'business-finance',
      name: t('businessFinance'),
      tag: 'business',
      icon: <Briefcase className="text-emerald-600 dark:text-emerald-400" size={26} />,
      accentBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-slate-200 dark:border-slate-800 hover:border-emerald-500',
      careers: [
        { name: 'DeepTech Venture Capitalist', desc: 'Investing in frontier scientific startups, quantum, AI & biotech', recommendedStream: 'Commerce / Engineering + MBA' },
        { name: 'Quantitative Analyst (Quant)', desc: 'Algorithmic trading, financial mathematics & risk modeling', recommendedStream: 'Science (PCM) / Economics' },
        { name: 'Chartered Accountant & Strategic CFO', desc: 'Corporate tax governance, audit excellence & capital allocation', recommendedStream: 'Commerce (CA)' },
        { name: 'CleanTech & Climate Entrepreneur', desc: 'Building circular economy businesses & renewable energy ventures', recommendedStream: 'Interdisciplinary' }
      ]
    },
    {
      id: 'law-governance',
      name: t('lawGovernance'),
      tag: 'law',
      icon: <Scale className="text-amber-600 dark:text-amber-400" size={26} />,
      accentBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
      borderColor: 'border-slate-200 dark:border-slate-800 hover:border-amber-500',
      careers: [
        { name: 'AI Ethics & Cyber Law Specialist', desc: 'AI regulatory frameworks, algorithmic audits & international data treaties', recommendedStream: 'Humanities / Law (CLAT)' },
        { name: 'Corporate & Intellectual Property Lawyer', desc: 'Patent litigation, biotech licensing & multinational contracts', recommendedStream: 'Humanities / Commerce / Law' },
        { name: 'Civil Servant (IAS/IPS)', desc: 'Public policy execution, district administration & strategic national projects', recommendedStream: 'Any Stream (UPSC CSE)' },
        { name: 'Diplomat & International Relations Envoy', desc: 'Bilateral negotiations, space treaties & global geopolitical policy', recommendedStream: 'Humanities / Political Science' }
      ]
    },
    {
      id: 'design-creative',
      name: t('designCreativeArts'),
      tag: 'design',
      icon: <Palette className="text-purple-600 dark:text-purple-400" size={26} />,
      accentBg: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
      borderColor: 'border-slate-200 dark:border-slate-800 hover:border-purple-500',
      careers: [
        { name: 'Generative AI & XR Spatial Designer', desc: 'Virtual environments, spatial computing UI & immersive generative worlds', recommendedStream: 'Design / CS (UCEED/NID)' },
        { name: 'Sustainable Architect & Biomimetic Planner', desc: 'Carbon-neutral skyscrapers, passive solar design & smart city masterplans', recommendedStream: 'Science (PCM) - B.Arch' },
        { name: 'Industrial Robotics & Product Designer', desc: 'Ergonomic hardware interfaces, consumer electronics & drone casings', recommendedStream: 'Design / Engineering' },
        { name: '3D Animator & Visual FX Director', desc: 'Real-time rendering, physics simulations & cinematic digital artistry', recommendedStream: 'Arts / Digital Media' }
      ]
    }
  ];

  const filteredCategories = useMemo(() => {
    return CATEGORIES.map(category => {
      if (selectedTag !== 'all') {
        if (selectedTag === 'frontier' && !category.isFrontierCategory) return null;
        if (selectedTag !== 'frontier' && category.tag !== selectedTag) return null;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCategory = category.name.toLowerCase().includes(query);
        const matchingCareers = category.careers.filter(c => 
          c.name.toLowerCase().includes(query) || 
          (c.desc && c.desc.toLowerCase().includes(query)) ||
          (c.recommendedStream && c.recommendedStream.toLowerCase().includes(query))
        );

        if (matchesCategory) {
          return category;
        }
        if (matchingCareers.length > 0) {
          return {
            ...category,
            careers: matchingCareers
          };
        }
        return null;
      }

      return category;
    }).filter(Boolean) as Category[];
  }, [CATEGORIES, searchQuery, selectedTag]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 py-6"
    >
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-4">
          <Sparkles size={14} className="animate-pulse" />
          <span>Frontier Technology & Industry Sectors 2026-2035</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          {t('exploreCareerPaths')}
        </h2>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          {t('exploreCareersSubtitle')}
        </p>
      </div>

      {/* Stream Selection Notice & Callout */}
      {onNavigateToResources && (
        <div className="mb-8 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <GraduationCap size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Looking for 10+2 Stream Selection & Entrance Exam Roadmaps?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Explore PCM, PCMB, Interdisciplinary, Commerce & Humanities pathways at the top of Educational Resources.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToResources}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
          >
            <span>View Academic Streams</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Quick Access to Featured Frontier Careers */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-cyan-500/10 border border-indigo-200/80 dark:border-indigo-800/80">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
            <Sparkles size={14} className="text-indigo-500" />
            Featured Frontier Deep Tech
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Click any to auto-generate roadmap</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            'AGI & Superintelligence',
            'Quantum Physics & Computing',
            'Bio-Engineering & Longevity',
            'Material Science & Nanotech',
            'Neuroscience & Brain-Computer Interface',
            'Fusion Energy & Space Tech',
            'Robotics & Autonomous Systems'
          ].map(name => (
            <button
              key={name}
              onClick={() => onSelectCareer(name)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-all shadow-xs flex items-center gap-1.5 group"
            >
              <span>{name}</span>
              <ArrowRight size={12} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Search & Tag Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search careers (e.g. AGI, Quantum, Bio-Engineering, Fusion...)"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          {[
            { id: 'all', label: 'All Fields' },
            { id: 'frontier', label: '🚀 Frontier Tech' },
            { id: 'tech', label: '💻 Tech & CS' },
            { id: 'health', label: '🩺 Healthcare' },
            { id: 'science', label: '⚛️ Pure Sciences' },
            { id: 'business', label: '💼 Business' },
            { id: 'law', label: '⚖️ Law & Policy' },
            { id: 'design', label: '🎨 Design' }
          ].map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                selectedTag === tag.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <motion.div
            key={cat.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg relative overflow-hidden flex flex-col justify-between ${
              cat.isFrontierCategory 
                ? 'border-indigo-300 dark:border-indigo-800/80 shadow-sm shadow-indigo-100 dark:shadow-none' 
                : cat.borderColor
            }`}
          >
            {/* Frontier Glow Accent Bar */}
            {cat.isFrontierCategory && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />
            )}

            <div>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.accentBg}`}>
                  {cat.icon}
                </div>
                {cat.isFrontierCategory && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs">
                    <Zap size={10} className="fill-white" />
                    Frontier Tech
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                {cat.name}
              </h3>
              
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
                {cat.careers.length} specialized career paths
              </div>

              {/* Careers List */}
              <div className="space-y-2">
                {cat.careers.map((career) => (
                  <button
                    key={career.name}
                    onClick={() => onSelectCareer(career.name)}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800/60 transition-all duration-200 group flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {career.name}
                        </span>
                        {career.isFrontier && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 tracking-wider">
                            Deep Tech
                          </span>
                        )}
                      </div>
                      {career.desc && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-normal">
                          {career.desc}
                        </p>
                      )}
                      {career.recommendedStream && (
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium flex items-center gap-1">
                          <span>Path:</span>
                          <span className="text-slate-600 dark:text-slate-300 font-normal">{career.recommendedStream}</span>
                        </div>
                      )}
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-all">
                      <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Footer action note */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Click to generate AI roadmap</span>
              <span className="text-indigo-500 font-semibold group-hover:underline">Explore &rarr;</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Search size={40} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No careers match your search</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try searching for keywords like "Quantum", "Bio", "AI", or "Fusion"</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedTag('all'); }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Reset filters
          </button>
        </div>
      )}
    </motion.div>
  );
}
