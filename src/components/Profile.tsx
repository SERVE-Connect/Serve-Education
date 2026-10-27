import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { LogIn, LogOut, Download, Save, User as UserIcon, Mail, Phone, MapPin, Briefcase, GraduationCap, Code, Plus, Trash2, Loader2, Rocket, Heart, BookOpen, Target, Share2, Sun, Moon, SlidersHorizontal, Compass, Pencil, Layout, Check, X, ChevronLeft, ChevronRight, FileDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../lib/translations';
import { cn, getFirstIncompleteStep, isProfileComplete, cleanObject, calculateCompletion } from '../lib/utils';
import { UserDetailsForm } from './UserDetailsForm';
import { Toast } from './Toast';
import { StudentProfile } from '../types';
import { exportResumeToPDF } from '../lib/pdfExport';
import { BasicInfoForm } from './BasicInfoForm';
import { SelectionList } from './SelectionList';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { ModalShell } from './ModalShell';
import { ProfileProgressBar } from './ProfileProgressBar';

import { ResumePreview } from './ResumePreview';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: { school: string; degree: string; year: string }[];
  experience: { company: string; role: string; duration: string; description: string }[];
  skills: string[];
  projects: { name: string; description: string; link: string }[];
  interests: string[];
  strengths: string[];
  academicPreferences: string[];
  careerAspirations: string;
  linkedin: string;
  birthDate: string;
  isFresher: boolean;
  hasNoProjects: boolean;
  grade: string;
  aspirations?: string;
  preferredSubjects?: string[];
  updatedAt?: number;
}

const INITIAL_PROFILE: ProfileData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  education: [],
  experience: [],
  skills: [],
  projects: [],
  interests: [],
  strengths: [],
  academicPreferences: [],
  careerAspirations: '',
  linkedin: '',
  birthDate: '',
  isFresher: false,
  hasNoProjects: false,
  grade: ''
};

const INTERESTS = ['Technology', 'Arts', 'Science', 'Business', 'Social Work', 'Law', 'Medicine', 'Sports', 'Design', 'Writing'];
const STRENGTHS = ['Problem Solving', 'Creativity', 'Communication', 'Leadership', 'Analytical Thinking', 'Empathy', 'Discipline', 'Public Speaking'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics', 'Computer Science', 'Psychology', 'Fine Arts'];

export function Profile({ 
  onStartGuide, 
  isLoading, 
  initialAction, 
  onActionComplete, 
  onIncompleteProfile,
  onDeleteProfile
}: { 
  onStartGuide?: () => void, 
  isLoading?: boolean,
  initialAction?: 'resume' | 'share',
  onActionComplete?: () => void,
  onIncompleteProfile?: (intent: 'resume' | 'share') => void,
  onDeleteProfile?: () => void
}) {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStep, setEditStep] = useState<number | undefined>(undefined);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });

  const TEMPLATES = [
    { id: 'simple', name: 'Simple Classic', desc: 'Clean, traditional layout for all industries', color: 'bg-slate-50' },
    { id: 'modern', name: 'Modern Yellow', desc: 'Stylish layout with yellow accents and sidebar', color: 'bg-slate-100' },
    { id: 'professional', name: 'Executive Pro', desc: 'Two-column layout for experienced professionals', color: 'bg-slate-50' },
    { id: 'creative', name: 'Creative Dark', desc: 'Bold, dark-themed layout for modern roles', color: 'bg-slate-900' }
  ];

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = undefined;
      }
      if (currentUser) {
        // Use onSnapshot for real-time updates
        unsubscribeProfile = onSnapshot(doc(db, 'profiles', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as ProfileData;
            setProfile(prev => ({ ...INITIAL_PROFILE, ...data }));
            setIsEditing(false);
          } else {
            setIsEditing(true);
            setProfile(prev => ({
              ...prev,
              fullName: prev.fullName || currentUser.displayName || '',
              email: prev.email || currentUser.email || ''
            }));
          }
          setLoading(false);
        }, (error) => {
          console.error('Error listening to profile:', error);
          setLoading(false);
        });
      } else {
        const cached = localStorage.getItem('userProfile');
        if (cached) {
          try {
            setProfile(prev => ({ ...INITIAL_PROFILE, ...JSON.parse(cached) }));
          } catch (e) {
            setProfile(INITIAL_PROFILE);
          }
        } else {
          setProfile(INITIAL_PROFILE);
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  useEffect(() => {
    if (initialAction && !loading) {
      if (initialAction === 'resume') {
        setShowTemplateModal(true);
      } else if (initialAction === 'share') {
        handleShareProfile();
      }
      onActionComplete?.();
    }
  }, [initialAction, loading]);

  useEffect(() => {
    if (showTemplateModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showTemplateModal]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-closed-by-user') {
        return;
      }
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteData = async () => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'profiles', user.uid));
      } catch (error) {
        console.error('Error deleting profile data:', error);
      }
    }
    localStorage.removeItem('userProfile');
    localStorage.removeItem('lastResult');
    setProfile(INITIAL_PROFILE);
    if (onDeleteProfile) {
      onDeleteProfile();
    }
    setToast({ message: 'Profile data deleted successfully', isVisible: true });
  };

  const handleEdit = (step?: number) => {
    setEditStep(step || getFirstIncompleteStep(profile) || 1);
    setIsEditing(true);
  };

  const handleSave = async (updatedProfile: StudentProfile) => {
    let currentUser = user;
    if (!currentUser) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        currentUser = result.user;
        setUser(currentUser);
      } catch (error: any) {
        if (error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-closed-by-user') {
          return;
        }
        console.error('Error signing in:', error);
        return;
      }
    }

    setSaving(true);
    try {
      const profileToSave = {
        ...updatedProfile,
        fullName: updatedProfile.fullName || currentUser.displayName || '',
        email: updatedProfile.email || currentUser.email || '',
        updatedAt: Date.now()
      };
      setProfile(profileToSave as any);
      await setDoc(doc(db, 'profiles', currentUser.uid), cleanObject(profileToSave));
      setToast({ message: t('profileUpdated'), isVisible: true });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateResume = async () => {
    if (!isProfileComplete(profile)) {
      onIncompleteProfile?.('resume');
      return;
    }
    
    setIsGeneratingResume(true);
    let currentUser = user;
    if (!currentUser) {
      try {
        const { signInWithPopup } = await import('firebase/auth');
        const { googleProvider } = await import('../firebase');
        const result = await signInWithPopup(auth, googleProvider);
        currentUser = result.user;
        await setDoc(doc(db, 'profiles', currentUser.uid), cleanObject({ ...profile, updatedAt: profile.updatedAt || Date.now() }));
        setToast({ message: t('profileUpdated'), isVisible: true });
      } catch (error: any) {
        setIsGeneratingResume(false);
        if (error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-closed-by-user') {
          return;
        }
        console.error('Error signing in:', error);
        return;
      }
    }

    setShowTemplateModal(true);
    setIsGeneratingResume(false);
  };

  const handleShareProfile = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.fullName}'s Profile`,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Profile link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const downloadResume = async (templateId: string = 'simple') => {
    try {
      setSaving(true);
      await exportResumeToPDF(profile as unknown as StudentProfile, templateId);
      setToast({ message: 'Resume downloaded successfully!', isVisible: true });
    } catch (error) {
      console.error('Error generating resume:', error);
      setToast({ message: 'Error generating PDF. Please try again.', isVisible: true });
    } finally {
      setSaving(false);
    }
  };

  const completionPercentage = calculateCompletion(profile);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="sticky top-16 z-30 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 mb-6 -mx-4 px-4 md:mx-0 md:px-0 rounded-b-2xl md:rounded-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-16 h-16 rounded-2xl border-2 border-white dark:border-slate-800 shadow-lg" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <UserIcon size={32} />
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{profile.fullName || t('professionalProfile')}</h2>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">{t('buildProfessionalIdentity')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end flex-wrap">
            <button
              onClick={handleCreateResume}
              disabled={isGeneratingResume}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all text-sm sm:text-base whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
              title={t('createResume')}
            >
              {isGeneratingResume ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Download size={20} />
              )}
              <span>{t('createResume')}</span>
            </button>

            {onStartGuide && (
              <button
                onClick={onStartGuide}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm sm:text-base whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                title={t('startGuide')}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>{t('generating')}</span>
                  </>
                ) : (
                  <>
                    <Compass size={20} />
                    <span>{t('startGuide')}</span>
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={async () => {
                if (isProfileComplete(profile)) {
                  let currentUser = user;
                  if (!currentUser) {
                    try {
                      const { signInWithPopup } = await import('firebase/auth');
                      const { googleProvider } = await import('../firebase');
                      const result = await signInWithPopup(auth, googleProvider);
                      currentUser = result.user;
                      await setDoc(doc(db, 'profiles', currentUser.uid), cleanObject({ ...profile, updatedAt: Date.now() }));
                      setToast({ message: t('profileUpdated'), isVisible: true });
                    } catch (error: any) {
                      if (error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-closed-by-user') {
                        return;
                      }
                      console.error('Error signing in:', error);
                      return;
                    }
                  }
                  handleShareProfile();
                } else {
                  onIncompleteProfile?.('share');
                }
              }}
              className="p-2.5 sm:p-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
              title={t('shareProfile')}
            >
              <Share2 size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowPersonalize(!showPersonalize)}
                className={cn(
                  "p-2.5 sm:p-3 rounded-xl font-bold transition-all",
                  showPersonalize 
                    ? "bg-indigo-600 text-white" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
                title={t('personalise')}
              >
                <SlidersHorizontal size={20} />
              </button>

              {showPersonalize && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowPersonalize(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 z-50"
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('language')}</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['en', 'hi', 'mr', 'ur'] as Language[]).map((lang) => (
                            <button
                              key={lang}
                              onClick={() => {
                                setLanguage(lang);
                                setShowPersonalize(false);
                              }}
                              className={cn(
                                "px-3 py-2 text-xs font-bold rounded-lg transition-all",
                                language === lang 
                                  ? "bg-indigo-600 text-white shadow-md" 
                                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                              )}
                            >
                              {lang === 'en' && 'English'}
                              {lang === 'hi' && 'हिन्दी'}
                              {lang === 'mr' && 'मराठी'}
                              {lang === 'ur' && 'اردو'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('theme')}</label>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setTheme('light');
                              setShowPersonalize(false);
                            }}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all",
                              theme === 'light'
                                ? "bg-indigo-600 text-white shadow-md" 
                                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            )}
                          >
                            <Sun size={14} /> {t('light')}
                          </button>
                          <button 
                            onClick={() => {
                              setTheme('dark');
                              setShowPersonalize(false);
                            }}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all",
                              theme === 'dark'
                                ? "bg-indigo-600 text-white shadow-md" 
                                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            )}
                          >
                            <Moon size={14} /> {t('dark')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            {!isEditing && (
              <button
                onClick={() => handleEdit()}
                disabled={saving}
                className="p-2.5 sm:p-3 rounded-xl font-bold transition-all bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                title={t('editProfile')}
              >
                <Pencil size={20} />
              </button>
            )}

            <button
              onClick={handleDeleteData}
              className="p-2.5 sm:p-3 text-slate-400 hover:text-rose-600 transition-colors"
              title="Delete Profile Data"
            >
              <Trash2 size={20} />
            </button>

            {user ? (
              <button
                onClick={handleSignOut}
                className="p-2.5 sm:p-3 text-slate-400 hover:text-rose-600 transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="p-2.5 sm:p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Sign In"
              >
                <LogIn size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Completion Progress */}
      <ProfileProgressBar 
        completionPercentage={completionPercentage}
        showAction={!isEditing && completionPercentage < 100}
        onAction={handleEdit}
        actionText={t('addMissingDetails')}
      />

      {isEditing ? (
        <div className="max-w-2xl mx-auto">
          <UserDetailsForm 
            initialData={profile as any}
            onSubmit={handleSave}
            onCancel={() => setIsEditing(false)}
            isLoading={saving}
            mode="profile"
            initialStep={editStep}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <UserIcon size={20} className="text-indigo-600 dark:text-indigo-400" /> {t('basicInformation')}
            </h3>
            <BasicInfoForm 
              data={profile} 
              onChange={(data) => setProfile({ ...profile, ...data })} 
              readOnly={!isEditing}
            />
          </section>

          {/* Education */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <EducationForm
              education={profile.education}
              onChange={(education) => setProfile({ ...profile, education, grade: education[0]?.degree || '' })}
              readOnly={!isEditing}
            />
          </section>

          {/* Experience */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <ExperienceForm 
              isFresher={profile.isFresher} 
              experience={profile.experience} 
              onChange={(data) => setProfile({ ...profile, ...data })} 
              readOnly={!isEditing}
            />
          </section>

          {/* Skills */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <SkillsForm
              skills={profile.skills}
              onChange={(skills) => setProfile({ ...profile, skills })}
              readOnly={!isEditing}
            />
          </section>

          {/* Projects */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <ProjectsForm
              hasNoProjects={profile.hasNoProjects}
              projects={profile.projects}
              onChange={(data) => setProfile({ ...profile, ...data })}
              readOnly={!isEditing}
            />
          </section>

          {/* Interests & Strengths */}
          <section id="interests" className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Heart size={20} className="text-rose-500" /> {t('interestsStrengths')}
            </h3>
            <div className="space-y-8">
              <div>
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 block">Interests</label>
                <SelectionList
                  items={INTERESTS}
                  selectedItems={profile.interests}
                  onChange={(items) => setProfile({ ...profile, interests: items })}
                  color="rose"
                  placeholder="Add other interest..."
                  readOnly={!isEditing}
                />
              </div>
              <div id="strengths">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 block">Strengths</label>
                <SelectionList
                  items={STRENGTHS}
                  selectedItems={profile.strengths}
                  onChange={(items) => setProfile({ ...profile, strengths: items })}
                  color="amber"
                  placeholder="Add other strength..."
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </section>

          {/* Academic Preferences */}
          <section id="academic-preferences" className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-emerald-500" /> {t('academicPreferences')}
            </h3>
            <SelectionList
              items={SUBJECTS}
              selectedItems={profile.academicPreferences}
              onChange={(items) => setProfile({ ...profile, academicPreferences: items })}
              variant="grid"
              color="emerald"
              placeholder="Add other academic preference..."
              readOnly={!isEditing}
            />
          </section>

          {/* Career Aspirations */}
          <section id="career-aspirations" className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Target size={20} className="text-indigo-600 dark:text-indigo-400" /> {t('careerAspirations')}
            </h3>
            <textarea
              value={profile.careerAspirations}
              onChange={e => setProfile({ ...profile, careerAspirations: e.target.value })}
              readOnly={!isEditing}
              className={cn(
                "w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 resize-none dark:text-white",
                !isEditing ? "bg-transparent p-0 focus:ring-0 h-auto min-h-[2rem]" : "bg-slate-50 dark:bg-slate-800"
              )}
              placeholder={!isEditing ? t('notSpecified') : t('careerGoalsPlaceholder')}
            />
          </section>
        </div>
      </div>
    )}
    {/* Template Selection Modal */}
    <ModalShell
      isOpen={showTemplateModal}
      onClose={() => {
        setShowTemplateModal(false);
      }}
      title="Resume Preview"
      subtitle="Review your resume before downloading"
      maxWidth="max-w-4xl"
      headerActions={
        <button 
          onClick={() => {
            downloadResume(selectedTemplate);
            setShowTemplateModal(false);
            setToast({ message: 'Resume downloaded successfully!', isVisible: true });
          }}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
          title="Download PDF"
        >
          <FileDown size={24} />
        </button>
      }
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2">
            {TEMPLATES.map((tmpl) => (
              <div 
                key={tmpl.id} 
                className={cn(
                  "h-1.5 w-8 rounded-full transition-all",
                  selectedTemplate === tmpl.id ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-200 dark:bg-slate-700'
                )}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                const currentIndex = TEMPLATES.findIndex(t => t.id === selectedTemplate);
                if (currentIndex > 0) {
                  setSelectedTemplate(TEMPLATES[currentIndex - 1].id);
                }
              }}
              disabled={TEMPLATES.findIndex(t => t.id === selectedTemplate) === 0}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all text-slate-600 dark:text-slate-400"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => {
                const currentIndex = TEMPLATES.findIndex(t => t.id === selectedTemplate);
                if (currentIndex < TEMPLATES.length - 1) {
                  setSelectedTemplate(TEMPLATES[currentIndex + 1].id);
                }
              }}
              disabled={TEMPLATES.findIndex(t => t.id === selectedTemplate) === TEMPLATES.length - 1}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all text-slate-600 dark:text-slate-400"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      }
    >
      <div className="h-full flex-grow overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
        <ResumePreview profile={profile as unknown as StudentProfile} templateId={selectedTemplate} />
      </div>
    </ModalShell>
      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </div>
  );
}
