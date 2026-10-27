import React, { useState, useEffect } from 'react';
import { UserDetailsForm } from './components/UserDetailsForm';
import { Presentation } from './components/Presentation';
import { ExploreCareers } from './components/ExploreCareers';
import { HowItWorks } from './components/HowItWorks';
import { Resources } from './components/Resources';
import { SuccessStories } from './components/SuccessStories';
import { Profile } from './components/Profile';
import { OpenSchooling } from './components/OpenSchooling';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { ContactUs } from './components/ContactUs';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toast } from './components/Toast';
import { GeneratingOverlay } from './components/GeneratingOverlay';
import { StudentProfile, GuidanceResult } from './types';
import { generateGuidance } from './services/geminiService';
import { Sparkles, BookOpen, Users, ArrowRight, Star, User as UserIcon, Menu, X, Globe, Sun, Moon, Loader2, Brain, Atom, Dna, Rocket, Cpu, Compass, Zap, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, isProfileComplete, cleanObject, getFirstIncompleteStep } from './lib/utils';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import { Language, translations } from './lib/translations';

export default function App() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [view, setView] = useState<'landing' | 'user-details' | 'presentation' | 'explore' | 'resources' | 'success-stories' | 'profile' | 'open-schooling' | 'privacy' | 'terms' | 'contact'>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [result, setResult] = useState<GuidanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });
  const [lastProfile, setLastProfile] = useState<StudentProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Partial<StudentProfile> | null>(() => {
    const cached = localStorage.getItem('userProfile');
    return cached ? JSON.parse(cached) : null;
  });
  const [pendingIntent, setPendingIntent] = useState<'guide' | 'resume' | 'share' | null>(null);
  const [userDetailsStep, setUserDetailsStep] = useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  React.useEffect(() => {
    if (result) {
      localStorage.setItem('lastResult', JSON.stringify(result));
    }
  }, [result]);

  React.useEffect(() => {
    const cachedResult = localStorage.getItem('lastResult');
    if (cachedResult && !result) {
      setResult(JSON.parse(cachedResult));
    }
  }, []);

  React.useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = undefined;
      }
      if (currentUser) {
        unsubscribeProfile = onSnapshot(doc(db, 'profiles', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const profileData = docSnap.data() as StudentProfile;
            setUserProfile(profileData);
            
            // If we are in presentation view but result is missing, try to restore from profile
            if (view === 'presentation' && !result && profileData.lastGuidanceResult) {
              setResult(profileData.lastGuidanceResult);
            }
          } else if (view === 'landing') {
            setView('user-details');
          }
        }, (err) => {
          console.error("Error listening to profile:", err);
        });
      } else {
        const cached = localStorage.getItem('userProfile');
        setUserProfile(cached ? JSON.parse(cached) : null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [view]);

  const handleStart = async () => {
    if (userProfile && isProfileComplete(userProfile)) {
      let currentUser = user || auth.currentUser;
      let currentProfile = { ...userProfile };

      if (!currentUser) {
        try {
          const { signInWithPopup } = await import('firebase/auth');
          const { googleProvider } = await import('./firebase');
          const result = await signInWithPopup(auth, googleProvider);
          currentUser = result.user;
          setUser(currentUser);
          const profileRef = doc(db, 'profiles', currentUser.uid);
          const profileSnap = await getDoc(profileRef);
          
          if (profileSnap.exists()) {
            const firestoreProfile = profileSnap.data() as StudentProfile;
            // If firestore profile is newer or has guidance result, merge it
            if (firestoreProfile.lastGuidanceResult && !currentProfile.lastGuidanceResult) {
              currentProfile.lastGuidanceResult = firestoreProfile.lastGuidanceResult;
              currentProfile.lastReportAt = firestoreProfile.lastReportAt;
            }
          }
          
          await setDoc(profileRef, cleanObject({ ...currentProfile, updatedAt: currentProfile.updatedAt || Date.now() }), { merge: true });
          
          // Update local state with merged profile
          setUserProfile(currentProfile);
          
          setToast({ message: translations[language as keyof typeof translations].profileUpdated, isVisible: true });
        } catch (error: any) {
          if (error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-closed-by-user') {
            return;
          }
          console.error('Error signing in:', error);
          return;
        }
      }

      const lastUpdate = currentProfile.updatedAt || 0;
      const lastReport = currentProfile.lastReportAt || 0;

      if (currentProfile.lastGuidanceResult && lastReport >= lastUpdate) {
        setResult(currentProfile.lastGuidanceResult);
        setView('presentation');
        setPendingIntent(null);
      } else {
        setPendingIntent(null);
        handleSubmit(currentProfile as StudentProfile);
      }
    } else {
      setPendingIntent('guide');
      setUserDetailsStep(getFirstIncompleteStep(userProfile) || 1);
      setView('user-details');
    }
    setIsMenuOpen(false);
  };

  const goToExplore = () => { setView('explore'); setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goToResources = () => { setView('resources'); setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goToSuccessStories = () => { setView('success-stories'); setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goToProfile = () => { setView('profile'); setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goToOpenSchooling = () => { setView('open-schooling'); setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goToPrivacy = () => { setView('privacy'); setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goToTerms = () => { setView('terms'); setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goToContact = () => { setView('contact'); setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleSubmit = async (profile: StudentProfile) => {
    setIsLoading(true);
    setError(null);
    setLastProfile(profile);
    
    // Update local state immediately for UI responsiveness
    setUserProfile(profile);

    let currentUser = user || auth.currentUser;
    if (!currentUser) {
      try {
        const { signInWithPopup } = await import('firebase/auth');
        const { googleProvider } = await import('./firebase');
        const result = await signInWithPopup(auth, googleProvider);
        currentUser = result.user;
        setUser(currentUser);
      } catch (error: any) {
        setIsLoading(false);
        if (error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-closed-by-user') {
          return;
        }
        console.error('Error signing in:', error);
        return;
      }
    }

    try {
      // 1. Save/Update user profile
      const profileRef = doc(db, 'profiles', currentUser.uid);
      const profileSnap = await getDoc(profileRef);
      
      const updateData = {
        fullName: profile.fullName || currentUser.displayName || '',
        email: profile.email || currentUser.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        linkedin: profile.linkedin || '',
        birthDate: profile.birthDate || '',
        summary: profile.summary || '',
        grade: profile.grade || '',
        interests: profile.interests ?? [],
        strengths: profile.strengths ?? [],
        preferredSubjects: profile.preferredSubjects ?? [],
        academicPreferences: profile.preferredSubjects ?? [], // Backward compatibility
        aspirations: profile.aspirations ?? '',
        careerAspirations: profile.aspirations ?? '', // Backward compatibility
        isFresher: profile.isFresher ?? true,
        hasNoProjects: profile.hasNoProjects ?? false,
        experience: profile.experience ?? [],
        education: profile.education ?? [],
        skills: profile.skills ?? [],
        projects: profile.projects ?? [],
        updatedAt: Date.now()
      };

      if (profileSnap.exists()) {
        await updateDoc(profileRef, cleanObject(updateData));
      } else {
        await setDoc(profileRef, cleanObject(updateData));
      }
      
      setToast({ message: translations[language as keyof typeof translations].profileUpdated, isVisible: true });

      // 2. Handle pending intent or default to guidance
      if (pendingIntent === 'resume' || pendingIntent === 'share') {
        setView('profile');
        setUserDetailsStep(undefined);
        // We keep pendingIntent so Profile component can pick it up as initialAction
      } else {
        // Default or 'guide' intent
        const guidance = await generateGuidance(profile);
        setResult(guidance);

        // Cache the result in Firestore
        await updateDoc(profileRef, {
          lastGuidanceResult: guidance,
          lastReportAt: Date.now()
        });

        setView('presentation');
        setPendingIntent(null);
        setUserDetailsStep(undefined);
      }
    } catch (err) {
      setError("Failed to generate guidance. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRelatedCareer = async (career: string) => {
    const baseProfile: StudentProfile = lastProfile || {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      birthDate: '',
      summary: '',
      grade: '',
      interests: [],
      strengths: [],
      aspirations: '',
      preferredSubjects: [],
      isFresher: true,
      hasNoProjects: true,
      experience: [],
      education: [],
      skills: [],
      projects: [],
    };
    
    const newProfile: StudentProfile = {
      ...baseProfile,
      aspirations: `I am interested in exploring ${career} as a career path. Please guide me specifically for this.`,
    };
    
    handleSubmit(newProfile);
  };

  const handleReset = () => {
    setResult(null);
    setLastProfile(null);
    setView('landing');
    setIsMenuOpen(false);
    setPendingIntent(null);
    setUserDetailsStep(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 w-full shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.svg" alt="SERVE Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{t('appName')}</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6">
            <button onClick={goToExplore} className={cn("text-sm font-medium transition-colors", view === 'explore' ? "text-indigo-600" : "text-slate-600 dark:text-slate-400 hover:text-indigo-600")}>{t('exploreCareers')}</button>
            <button onClick={goToResources} className={cn("text-sm font-medium transition-colors", view === 'resources' ? "text-indigo-600" : "text-slate-600 dark:text-slate-400 hover:text-indigo-600")}>{t('resources')}</button>
            <button onClick={goToOpenSchooling} className={cn("text-sm font-medium transition-colors", view === 'open-schooling' ? "text-indigo-600" : "text-slate-600 dark:text-slate-400 hover:text-indigo-600")}>{t('openSchooling')}</button>
            <button onClick={goToSuccessStories} className={cn("text-sm font-medium transition-colors", view === 'success-stories' ? "text-indigo-600" : "text-slate-600 dark:text-slate-400 hover:text-indigo-600")}>{t('successStories')}</button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
            
            <button 
              onClick={goToProfile}
              className={cn("flex items-center gap-2 text-sm font-medium transition-colors", view === 'profile' ? "text-indigo-600" : "text-slate-600 dark:text-slate-400 hover:text-indigo-600")}
            >
              {user ? (
                <img src={user.photoURL || ''} className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon size={18} />
              )}
              {user ? user.displayName?.split(' ')[0] : t('profile')}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button 
              className="p-2 text-slate-600 dark:text-slate-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <button onClick={handleStart} className="w-full text-left px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-between">
                  {t('startGuide')} <ArrowRight size={18} />
                </button>
                <button onClick={goToExplore} className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 transition-colors">{t('exploreCareers')}</button>
                <button onClick={goToResources} className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 transition-colors">{t('resources')}</button>
                <button onClick={goToOpenSchooling} className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 transition-colors">{t('openSchooling')}</button>
                <button onClick={goToSuccessStories} className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 transition-colors">{t('successStories')}</button>
                
                <button onClick={goToProfile} className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 transition-colors flex items-center gap-2">
                  {user ? (
                    <img src={user.photoURL || ''} className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon size={18} />
                  )}
                  {user ? user.displayName : t('myProfile')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-bold mb-8">
                <Sparkles size={16} /> {t('tagline')}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {language === 'ur' ? (
                  <>اعتماد کے ساتھ اپنے مستقبل کی <span className="text-indigo-600">راہ منتخب کریں</span></>
                ) : language === 'hi' ? (
                  <>आत्मविश्वास के साथ अपने भविष्य की <span className="text-indigo-600">राह चुनें</span></>
                ) : language === 'mr' ? (
                  <>आत्मविश्वासाने तुमच्या भविष्याचा <span className="text-indigo-600">मार्ग निवडा</span></>
                ) : (
                  <>Navigate Your Future with <span className="text-indigo-600">Confidence</span></>
                )}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                {t('heroSubtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                <button 
                  onClick={handleStart}
                  disabled={isLoading}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {t('generating')}
                    </>
                  ) : (
                    <>
                      {t('startJourney')} <ArrowRight size={20} />
                    </>
                  )}
                </button>
                <button 
                  onClick={goToExplore}
                  className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  {t('exploreCareers')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={handleStart}>
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6">
                    <BookOpen className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">{t('streamSelection')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('streamSelectionDesc')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => {
                  const el = document.getElementById('how-it-works-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-6">
                    <Sparkles className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">{t('futureReady')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('futureReadyDesc')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={goToResources}>
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">{t('indianContext')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('indianContextDesc')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={goToSuccessStories}>
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 rounded-2xl flex items-center justify-center mb-6">
                    <Star className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">{t('successStories')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('successStoriesDesc')}</p>
                </div>
              </div>

              {/* Frontier & Advanced Careers Section (Direct on Landing Page) */}
              <div className="mt-20 text-left">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
                      <Sparkles size={13} className="animate-pulse" />
                      <span>Frontier & Next-Gen Careers 2026–2035</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                      Explore Cutting-Edge Deep Tech & Science
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
                      Click any frontier career to generate a personalized AI-powered education roadmap & stream guide.
                    </p>
                  </div>
                  <button
                    onClick={goToExplore}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-200 dark:shadow-none shrink-0"
                  >
                    <Compass size={16} />
                    <span>View All 30+ Careers & Streams</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* 7 Requested Career Cards with direct generation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[
                    {
                      name: 'AGI & Superintelligence',
                      stream: 'Science (PCM) + CS',
                      icon: <Brain className="text-violet-500" size={22} />,
                      desc: 'AI reasoning architectures, superalignment & large frontier models.',
                      tag: 'AI Frontier',
                      border: 'hover:border-violet-500'
                    },
                    {
                      name: 'Quantum Physics & Computing',
                      stream: 'Science (PCM) / Pure Physics',
                      icon: <Atom className="text-blue-500" size={22} />,
                      desc: 'Qubit hardware, quantum algorithms & topological matter.',
                      tag: 'Quantum Tech',
                      border: 'hover:border-blue-500'
                    },
                    {
                      name: 'Bio-Engineering & Longevity',
                      stream: 'Science (PCMB) / Biotech',
                      icon: <Dna className="text-emerald-500" size={22} />,
                      desc: 'Cellular rejuvenation, regenerative medicine & healthspan tech.',
                      tag: 'Biotech',
                      border: 'hover:border-emerald-500'
                    },
                    {
                      name: 'Material Science & Nanotech',
                      stream: 'Science (PCM) / Materials',
                      icon: <Cpu className="text-cyan-500" size={22} />,
                      desc: '2D materials, metamaterials & room-temp superconductors.',
                      tag: 'Nanomaterials',
                      border: 'hover:border-cyan-500'
                    },
                    {
                      name: 'Neuroscience & Brain-Computer Interface',
                      stream: 'Science (PCMB) / Cognitive Sci',
                      icon: <Brain className="text-purple-500" size={22} />,
                      desc: 'Neural implants, EEG signal decoding & sensory prosthetics.',
                      tag: 'Neurotech',
                      border: 'hover:border-purple-500'
                    },
                    {
                      name: 'Fusion Energy & Space Tech',
                      stream: 'Science (PCM) / Aerospace',
                      icon: <Rocket className="text-amber-500" size={22} />,
                      desc: 'Tokamak plasma physics, orbital launchers & space habitats.',
                      tag: 'Space & Fusion',
                      border: 'hover:border-amber-500'
                    },
                    {
                      name: 'Robotics & Autonomous Systems',
                      stream: 'Science (PCM) / Mechatronics',
                      icon: <Zap className="text-rose-500" size={22} />,
                      desc: 'Humanoid robotics, spatial AI perception & autonomous fleet systems.',
                      tag: 'Robotics',
                      border: 'hover:border-rose-500'
                    },
                    {
                      name: 'Neuromorphic Computing & AI Chips',
                      stream: 'Science (PCM) / Microelectronics',
                      icon: <Cpu className="text-indigo-500" size={22} />,
                      desc: 'Brain-inspired silicon, spiking neural networks & edge AI.',
                      tag: 'Hardware',
                      border: 'hover:border-indigo-500'
                    }
                  ].map((career) => (
                    <div
                      key={career.name}
                      onClick={() => handleSelectRelatedCareer(career.name)}
                      className={`p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 ${career.border} hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                            {career.icon}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {career.tag}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {career.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                          {career.desc}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium text-[11px]">
                          {career.stream}
                        </span>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="how-it-works-section" className="mt-32 pt-20 border-t border-slate-100 dark:border-slate-800">
                <HowItWorks onStart={handleStart} />
              </div>
            </motion.div>
          )}

          {view === 'user-details' && (
            <div key="user-details">
              <UserDetailsForm 
                onSubmit={handleSubmit} 
                onCancel={handleReset} 
                isLoading={isLoading} 
                initialData={userProfile || {}}
                initialStep={userDetailsStep}
                pendingIntent={pendingIntent}
              />
              {error && (
                <p className="text-center mt-4 text-rose-600 font-medium">{error}</p>
              )}
            </div>
          )}

          {view === 'presentation' && result && (
            <div key="presentation">
              <ErrorBoundary>
                <Presentation 
                  result={result} 
                  onReset={handleReset} 
                  onSelectRelatedCareer={handleSelectRelatedCareer}
                  username={userProfile?.fullName}
                />
              </ErrorBoundary>
            </div>
          )}

          {view === 'explore' && (
            <ExploreCareers 
              onSelectCareer={handleSelectRelatedCareer} 
              onNavigateToResources={goToResources}
            />
          )}

          {view === 'resources' && (
            <Resources onSelectCareer={handleSelectRelatedCareer} />
          )}

          {view === 'success-stories' && (
            <SuccessStories onStart={handleStart} isLoading={isLoading} />
          )}

          {view === 'profile' && (
            <Profile 
              onStartGuide={handleStart} 
              isLoading={isLoading} 
              initialAction={pendingIntent === 'resume' || pendingIntent === 'share' ? pendingIntent : undefined}
              onActionComplete={() => setPendingIntent(null)}
              onIncompleteProfile={(intent) => {
                setPendingIntent(intent);
                setUserDetailsStep(getFirstIncompleteStep(userProfile) || 1);
                setView('user-details');
              }}
              onDeleteProfile={() => {
                setUserProfile(null);
                setLastProfile(null);
                setResult(null);
                localStorage.removeItem('userProfile');
                localStorage.removeItem('lastResult');
              }}
            />
          )}

          {view === 'open-schooling' && (
            <OpenSchooling />
          )}

          {view === 'privacy' && (
            <PrivacyPolicy />
          )}

          {view === 'terms' && (
            <TermsOfService />
          )}

          {view === 'contact' && (
            <ContactUs />
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 flex items-center justify-center">
              <img src="/logo.svg" alt="SERVE Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{t('appName')}</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {t('footerMission')}
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 font-medium">
            {t('poweredBy')}
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <button onClick={goToPrivacy} className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">{t('privacyPolicy')}</button>
            <button onClick={goToTerms} className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">{t('termsOfService')}</button>
            <button onClick={goToContact} className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">{t('contactUs')}</button>
          </div>
        </div>
      </footer>
      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
      <GeneratingOverlay isVisible={isLoading && view !== 'user-details'} />
    </div>
  );
}
