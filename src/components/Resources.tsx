import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ExternalLink, BookOpen, GraduationCap, School, Globe, Stethoscope, Heart, 
  Atom, Brain, Dna, Rocket, Cpu, Sparkles, ArrowRight, Zap, CheckCircle2, ChevronRight
} from 'lucide-react';
import { AdBanner } from './AdBanner';
import { useLanguage } from '../contexts/LanguageContext';

interface ResourcesProps {
  onSelectCareer?: (career: string) => void;
}

interface AcademicStream {
  id: string;
  title: string;
  badge: string;
  subjects: string[];
  description: string;
  gatewayExams: string[];
  topInstitutes: string[];
  unlockedCareers: string[];
  icon: React.ReactNode;
  gradient: string;
  accentBorder: string;
}

export function Resources({ onSelectCareer }: ResourcesProps) {
  const { t } = useLanguage();
  const [selectedStreamId, setSelectedStreamId] = useState<string>('all');

  const ACADEMIC_STREAMS: AcademicStream[] = [
    {
      id: 'science-pcm',
      title: 'Science (PCM) — Advanced Computing, Physics & Mathematics',
      badge: 'Engineering & Deep Tech Gateway',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science / AI Elective'],
      description: 'The foundation for computational frontiers, AI reasoning, quantum mechanics, and hardware engineering. Emphasizes rigorous mathematical formulation, algorithmic thinking, and fundamental physics.',
      gatewayExams: ['JEE Main & Advanced (IITs/NITs)', 'IISc Bangalore Admission (IAT/JEE)', 'BITSAT', 'ISI Kolkata (B.Stat/B.Math)', 'CMI (Chennai Mathematical Institute)'],
      topInstitutes: ['IIT Bombay, Delhi, Madras, Kanpur', 'IISc Bangalore (Quantum & AI Labs)', 'IIIT Hyderabad (Kohli AI Centre)', 'BITS Pilani', 'ISI Kolkata'],
      unlockedCareers: [
        'AGI & Superintelligence',
        'Quantum Physics & Computing',
        'Robotics & Autonomous Systems',
        'Fusion Energy & Space Tech',
        'Material Science & Nanotech',
        'Neuromorphic Computing & AI Chips'
      ],
      icon: <Cpu className="text-blue-500" size={24} />,
      gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      accentBorder: 'border-blue-200 dark:border-blue-800/60 hover:border-blue-500'
    },
    {
      id: 'science-pcmb',
      title: 'Science (PCMB) — Bio-Engineering, Longevity & Biophysics',
      badge: 'Multidisciplinary Biotech Gateway',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology / Biotechnology'],
      description: 'The convergence of quantitative physical sciences and modern cellular biology. Ideal for computational neuroscience, longevity medicine, CRISPR gene editing, and cellular rejuvenation therapeutics.',
      gatewayExams: ['IISER Aptitude Test (IAT)', 'NEET-UG (Medical & Bio-Research)', 'JEE Advanced (Biotechnology / Bioeng)', 'KVPY / INSPIRE Fellowship'],
      topInstitutes: ['IISER Pune, Kolkata, Mohali, Bhopal', 'National Centre for Biological Sciences (NCBS)', 'IIT Madras Bio-Tech', 'AIIMS New Delhi', 'IISc Division of Biological Sciences'],
      unlockedCareers: [
        'Bio-Engineering & Longevity',
        'Neuroscience & Brain-Computer Interface',
        'Synthetic Biology & Genomics',
        'Nanomedicine & Targeted Therapeutics',
        'Bionic Systems & Neural Prosthetics'
      ],
      icon: <Dna className="text-emerald-500" size={24} />,
      gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      accentBorder: 'border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-500'
    },
    {
      id: 'interdisciplinary-neuro-ai',
      title: 'Cognitive & Computational Sciences (Interdisciplinary)',
      badge: 'Cognition & Machine Mind',
      subjects: ['Computer Science', 'Mathematics', 'Cognitive Psychology', 'Neurobiology'],
      description: 'Focused on the intersection of human cognition, machine intelligence, and neural interfaces. Prepares researchers for direct-brain decoding, AI safety alignment, and sensory prosthetic architectures.',
      gatewayExams: ['IIIT-H UGEE (Dual Degree CND)', 'CUET-UG (Cognitive Science & AI)', 'GATE (Data Science & AI / CS)', 'CEED / Design Research'],
      topInstitutes: ['IIIT Hyderabad (Center for Cognitive Science)', 'IIT Delhi (Cognitive Science Dept)', 'IIT Kanpur (Brain-Computer Interface Lab)', 'Ashoka University'],
      unlockedCareers: [
        'Neuroscience & Brain-Computer Interface',
        'AGI & Superintelligence',
        'Neuromorphic Computing & AI Chips',
        'Generative AI & XR Spatial Designer',
        'AI Ethics & Cyber Law Specialist'
      ],
      icon: <Brain className="text-purple-500" size={24} />,
      gradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
      accentBorder: 'border-purple-200 dark:border-purple-800/60 hover:border-purple-500'
    },
    {
      id: 'space-nanomaterials',
      title: 'Space Sciences, Propulsion & Nanomaterials',
      badge: 'Physical Frontier & Clean Energy',
      subjects: ['Physics', 'Advanced Mathematics', 'Materials Science', 'Applied Mechanics'],
      description: 'Aimed at unlocking fundamental physical frontiers: orbital propulsion, Tokamak plasma containment for fusion energy, and room-temperature superconductors.',
      gatewayExams: ['IIST Admission (via JEE Advanced)', 'NEST (NISER Bhubaneswar / UM-DAE CEBS)', 'JEE Advanced', 'BARC / ISRO OCES'],
      topInstitutes: ['Indian Institute of Space Science and Technology (IIST)', 'TIFR Mumbai', 'IIT Bombay Aerospace & Propulsion', 'ARCI Hyderabad (Advanced Nanomaterials)'],
      unlockedCareers: [
        'Fusion Energy & Space Tech',
        'Material Science & Nanotech',
        'Commercial Spaceflight & Orbital Mechanics',
        'CleanTech, Hydrogen & Next-Gen Energy'
      ],
      icon: <Rocket className="text-cyan-500" size={24} />,
      gradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
      accentBorder: 'border-cyan-200 dark:border-cyan-800/60 hover:border-cyan-500'
    },
    {
      id: 'commerce-quant-finance',
      title: 'Commerce & Quantitative Financial Systems',
      badge: 'FinTech & DeepTech Capital',
      subjects: ['Mathematics / Applied Math', 'Accountancy', 'Economics', 'Informatics Practices'],
      description: 'The foundation for mathematical finance, algorithmic quantitative trading, venture capital in scientific innovations, and corporate scale-up of disruptive frontier technologies.',
      gatewayExams: ['IPMAT (IIM Indore/Rohtak)', 'CUET-UG (SRCC/St. Stephen)', 'ISI B.Stat / B.Math', 'CA Foundation'],
      topInstitutes: ['IIM Indore/Ranchi (IPM 5-Yr)', 'SRCC New Delhi', 'St. Xavier’s College Mumbai', 'NMIMS Mumbai'],
      unlockedCareers: [
        'DeepTech Venture Capitalist',
        'Quantitative Analyst (Quant)',
        'CleanTech & Climate Entrepreneur',
        'Chartered Accountant & Strategic CFO'
      ],
      icon: <GraduationCap className="text-amber-500" size={24} />,
      gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
      accentBorder: 'border-amber-200 dark:border-amber-800/60 hover:border-amber-500'
    },
    {
      id: 'humanities-law-governance',
      title: 'Humanities, AI Ethics & Global Jurisprudence',
      badge: 'Governance & Strategic Policy',
      subjects: ['Political Science', 'Economics', 'Legal Studies / History', 'Philosophy & Logic'],
      description: 'Essential for defining regulatory frameworks, algorithmic audits, international space & bio-treaties, and civil administration in an era of pervasive artificial intelligence.',
      gatewayExams: ['CLAT (National Law Universities Consortium)', 'AILET (NLU Delhi)', 'CUET-UG', 'UPSC Civil Services Examination'],
      topInstitutes: ['National Law School of India University (NLSIU) Bangalore', 'NALSAR Hyderabad', 'WBNUJS Kolkata', 'Delhi University'],
      unlockedCareers: [
        'AI Ethics & Cyber Law Specialist',
        'Corporate & Intellectual Property Lawyer',
        'Civil Servant (IAS/IPS)',
        'Diplomat & International Relations Envoy'
      ],
      icon: <Globe className="text-rose-500" size={24} />,
      gradient: 'from-rose-500/10 via-orange-500/5 to-transparent',
      accentBorder: 'border-rose-200 dark:border-rose-800/60 hover:border-rose-500'
    }
  ];

  const FRONTIER_RESEARCH_GATEWAYS = [
    {
      name: 'Indian Institute of Science (IISc Bangalore)',
      focus: 'Quantum Tech, AI Supercomputing & Materials',
      url: 'https://iisc.ac.in',
      tag: 'Rank 1 India'
    },
    {
      name: 'IISERs National Admissions (IAT Portal)',
      focus: 'Pure & Interdisciplinary Sciences (BS-MS)',
      url: 'https://www.iiseradmission.in',
      tag: 'Premier Research'
    },
    {
      name: 'NISER & UM-DAE CEBS (NEST Portal)',
      focus: 'Nuclear Physics, Fusion & Fundamental Science',
      url: 'https://www.nestexam.in',
      tag: 'DAE Center'
    },
    {
      name: 'Tata Institute of Fundamental Research (TIFR)',
      focus: 'Theoretical Physics, Quantum & Neuro-biology',
      url: 'https://www.tifr.res.in',
      tag: 'Global Hub'
    },
    {
      name: 'IIST Thiruvananthapuram (ISRO)',
      focus: 'Space Transportation & Planetary Propulsion',
      url: 'https://www.iist.ac.in',
      tag: 'ISRO Gateway'
    },
    {
      name: 'National Centre for Biological Sciences (NCBS)',
      focus: 'Genomics, Cellular Architecture & Longevity',
      url: 'https://www.ncbs.res.in',
      tag: 'Deep Biology'
    }
  ];

  const GLOBAL_OPEN_CURRICULA = [
    {
      name: 'IBM Qiskit & Quantum Lab',
      desc: 'Free open-source quantum programming SDK, simulators, and real QPUs on IBM Cloud.',
      url: 'https://qiskit.org',
      domain: 'Quantum Computing'
    },
    {
      name: 'Hugging Face Deep RL & LLM Course',
      desc: 'Open comprehensive tracks covering transformer architectures, reinforcement learning & agentic reasoning.',
      url: 'https://huggingface.co/learn',
      domain: 'Frontier AI & AGI'
    },
    {
      name: 'Fast.ai Deep Learning Specialization',
      desc: 'Top-down hands-on deep learning curriculum for training neural networks from scratch.',
      url: 'https://course.fast.ai',
      domain: 'Applied Deep Learning'
    },
    {
      name: 'MIT OpenCourseWare: Biological Engineering',
      desc: 'Freely available undergraduate and graduate lecture series in synthetic biology and biomaterials.',
      url: 'https://ocw.mit.edu',
      domain: 'Bio-Engineering'
    },
    {
      name: 'ROS 2 (Robot Operating System) Tutorials',
      desc: 'The global standard framework for programming autonomous mobile robots and humanoids.',
      url: 'https://docs.ros.org',
      domain: 'Robotics'
    },
    {
      name: 'AlphaFold Protein Structure Database',
      desc: 'Explore over 200 million 3D protein predictions developed by Google DeepMind and EMBL-EBI.',
      url: 'https://alphafold.ebi.ac.uk',
      domain: 'Genomics & Longevity'
    }
  ];

  const HIGHER_ED_RESOURCES = [
    {
      category: t('topEngineeringColleges'),
      icon: <School className="text-blue-600 dark:text-blue-400" />,
      links: [
        { name: 'Indian Institutes of Technology (IITs)', url: 'https://www.iit.ac.in' },
        { name: 'National Institutes of Technology (NITs)', url: 'https://www.nits.ac.in' },
        { name: 'BITS Pilani', url: 'https://www.bits-pilani.ac.in' },
        { name: 'IIIT Hyderabad', url: 'https://www.iiit.ac.in' }
      ]
    },
    {
      category: t('topMedicalColleges'),
      icon: <Stethoscope className="text-rose-600 dark:text-rose-400" />,
      links: [
        { name: 'AIIMS New Delhi', url: 'https://www.aiims.edu' },
        { name: 'Christian Medical College (CMC) Vellore', url: 'https://www.cmcvellore.ac.in' },
        { name: 'Armed Forces Medical College (AFMC)', url: 'https://afmc.nic.in' },
        { name: 'Maulana Azad Medical College (MAMC)', url: 'https://www.mamc.ac.in' }
      ]
    },
    {
      category: t('topLawManagement'),
      icon: <GraduationCap className="text-amber-600 dark:text-amber-400" />,
      links: [
        { name: 'National Law Schools (NLUs)', url: 'https://www.consortiumofnlus.ac.in' },
        { name: 'Indian Institutes of Management (IIMs)', url: 'https://www.iim.ac.in' },
        { name: 'FMS Delhi', url: 'http://fms.edu' },
        { name: 'XLRI Jamshedpur', url: 'https://www.xlri.ac.in' }
      ]
    },
    {
      category: t('entranceExamPortals'),
      icon: <Globe className="text-indigo-600 dark:text-indigo-400" />,
      links: [
        { name: 'National Testing Agency (NTA)', url: 'https://nta.ac.in' },
        { name: 'JEE Main Portal', url: 'https://jeemain.nta.nic.in' },
        { name: 'NEET UG Portal', url: 'https://neet.nta.nic.in' },
        { name: 'CUET UG Portal', url: 'https://cuet.samarth.ac.in' }
      ]
    }
  ];

  const filteredStreams = selectedStreamId === 'all' 
    ? ACADEMIC_STREAMS 
    : ACADEMIC_STREAMS.filter(s => s.id === selectedStreamId);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 py-4 space-y-16"
    >
      {/* Page Title & Intro */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-4">
          <Sparkles size={14} className="animate-pulse" />
          <span>Academic Pathways & Learning Gateways</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Academic Streams & Educational Resources
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Comprehensive stream roadmaps from 10+2 high school through national research gateways, premier universities, and frontier deep-tech curricula.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ACADEMIC STREAMS (AT THE VERY TOP)                             */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <GraduationCap size={16} />
              <span>Section 1 • High School & Gateway Streams</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              Academic Streams (10+2 & Beyond)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Selecting your 11th & 12th subjects sets the springboard for high-impact frontier fields.
            </p>
          </div>

          {/* Quick Stream Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedStreamId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStreamId === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Streams
            </button>
            {ACADEMIC_STREAMS.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStreamId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedStreamId === s.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {s.title.split('—')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Academic Stream Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStreams.map((stream) => (
            <div
              key={stream.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-7 border ${stream.accentBorder} shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                    {stream.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 inline-block mb-1.5">
                      {stream.badge}
                    </span>
                    <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white leading-tight">
                      {stream.title}
                    </h3>
                  </div>
                </div>

                {/* Core Subjects */}
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Recommended 10+2 Subject Mix
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stream.subjects.map((subj) => (
                      <span
                        key={subj}
                        className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                  {stream.description}
                </p>

                {/* Gateway Exams & Institutes Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-indigo-600 dark:text-indigo-400" />
                      Gateway Exams
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {stream.gatewayExams.map((exam) => (
                        <li key={exam} className="leading-snug">
                          • {exam}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <School size={13} className="text-indigo-600 dark:text-indigo-400" />
                      Elite Indian Hubs
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {stream.topInstitutes.map((inst) => (
                        <li key={inst} className="leading-snug">
                          • {inst}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Unlocked Frontier Careers */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                  Unlocked Frontier & Advanced Careers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stream.unlockedCareers.map((career) => (
                    <button
                      key={career}
                      onClick={() => onSelectCareer && onSelectCareer(career)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800/80 transition-all flex items-center gap-1 group"
                      title={`Click to generate roadmap for ${career}`}
                    >
                      <span>{career}</span>
                      <ArrowRight size={11} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: FRONTIER RESEARCH GATEWAYS & OPEN DEEP TECH CURRICULA          */}
      {/* ========================================================================= */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Atom size={16} />
            <span>Section 2 • Frontier Research & Global Curricula</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Elite Indian Research Portals & Global Deep-Tech Tracks
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official gateways to India’s premier scientific laboratories and free, world-class curricula in AGI, Quantum, Robotics, and Longevity.
          </p>
        </div>

        {/* 2-Column Split: Indian Research Gateways vs Global Open Tracks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column A: Indian National Research Gateways */}
          <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
                <School size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  National Research Gateways (Pure Science & Deep Tech)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Government of India premier research institutes & unified aptitude portals
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {FRONTIER_RESEARCH_GATEWAYS.map((gateway) => (
                <a
                  key={gateway.name}
                  href={gateway.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-slate-100 dark:border-slate-800 transition-all group"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs md:text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {gateway.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                        {gateway.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {gateway.focus}
                    </p>
                  </div>
                  <ExternalLink size={15} className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Column B: Global Open-Access Deep-Tech Tracks */}
          <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-violet-50 dark:bg-violet-950/60 rounded-xl text-violet-600 dark:text-violet-400">
                <Globe size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Open Frontier Curricula & Deep-Tech Toolkits
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Global self-learning platforms directly aligned with the 7 frontier careers
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {GLOBAL_OPEN_CURRICULA.map((curricula) => (
                <a
                  key={curricula.name}
                  href={curricula.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-slate-100 dark:border-slate-800 transition-all group"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs md:text-sm text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                        {curricula.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 shrink-0">
                        {curricula.domain}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {curricula.desc}
                    </p>
                  </div>
                  <ExternalLink size={15} className="text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: STANDARD HIGHER ED, ENTRANCE EXAMS & AID                        */}
      {/* ========================================================================= */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen size={16} />
            <span>Section 3 • Higher Education & Examination Authority</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            National Examination Portals & University Directories
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official government portals for engineering, medical, law, and central university admissions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HIGHER_ED_RESOURCES.map((res) => (
                <div key={res.category} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      {res.icon}
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">{res.category}</h3>
                  </div>
                  <div className="space-y-2.5">
                    {res.links.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all group text-xs md:text-sm font-medium"
                      >
                        <span className="truncate pr-2">{link.name}</span>
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* NIRF Ranking Pro-Tip */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 p-6 rounded-3xl flex gap-5 items-start">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-2xl text-amber-700 dark:text-amber-400 shrink-0">
                <BookOpen size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-amber-900 dark:text-amber-200 mb-1.5">{t('nirfTipTitle')}</h4>
                <p className="text-xs md:text-sm text-amber-800/90 dark:text-amber-200/70 leading-relaxed">
                  {t('nirfTipDesc')}
                </p>
                <a 
                  href="https://www.nirfindia.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-xs md:text-sm text-amber-900 dark:text-amber-300 font-bold hover:underline"
                >
                  {t('visitNirf')} <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Funding & Financial Aid */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white px-1">{t('supportYourDreams')}</h3>
            <AdBanner 
              platform="ImpactGuru"
              title={t('crowdfundEducation')}
              description={t('impactGuruDesc')}
              link="https://www.impactguru.com"
              type="funding"
            />
            <AdBanner 
              platform="Kickstarter"
              title={t('bringProjectToLife')}
              description={t('kickstarterDesc')}
              link="https://www.kickstarter.com"
              type="funding"
            />
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xs">
                  <Heart className="text-rose-500" size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">{t('needFinancialAid')}</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {t('financialAidDesc')}
              </p>
              <div className="space-y-2 text-xs">
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:text-indigo-600 transition-colors"
                >
                  <span>National Scholarship Portal (NSP)</span>
                  <ExternalLink size={12} />
                </a>
                <a
                  href="https://dst.gov.in/scientific-programmes/scientific-engineering-research/inspire-programme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:text-indigo-600 transition-colors"
                >
                  <span>DST INSPIRE Science Fellowship</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
