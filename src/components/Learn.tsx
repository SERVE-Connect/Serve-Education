import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderPlus, Upload, Folder, FileCode, CheckCircle, Award, Trophy, 
  BookOpen, Sparkles, Brain, Compass, Clock, ChevronRight, ChevronDown, 
  ExternalLink, Trash2, ShieldCheck, Flame, RefreshCw, BarChart2, CheckSquare, 
  Download, Play, ArrowRight, Lightbulb, Target, Layers, Plus, X, Search, Lock,
  LogIn, UserCheck, GraduationCap, ShieldAlert
} from 'lucide-react';
import { Course, CourseFolder, UserLearningData, TestScore, Certificate, PrepItem } from '../types';
import { 
  getFolders, getCourses, saveFolder, saveCourse, deleteFolder, deleteCourse, 
  getUserLearningData, saveUserLearningData, ADMIN_EMAIL, isUserAdmin 
} from '../services/courseService';
import { User, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface LearnProps {
  user: User | null;
  userProfileName?: string;
  onNavigateToExplore?: () => void;
  onNavigateToResources?: () => void;
  onRequireAuth?: () => void;
}

export function Learn({ user, userProfileName, onNavigateToExplore, onNavigateToResources, onRequireAuth }: LearnProps) {
  const [folders, setFolders] = useState<CourseFolder[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [learningData, setLearningData] = useState<UserLearningData | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'scoreboard' | 'methodology'>('catalog');

  // If user logs out while on scoreboard tab, automatically redirect to catalog
  useEffect(() => {
    if (!user && activeTab === 'scoreboard') {
      setActiveTab('catalog');
    }
  }, [user, activeTab]);
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication Gating for unregistered or logged-out users
  const [showAuthGateModal, setShowAuthGateModal] = useState(false);
  const [authGateTargetCourse, setAuthGateTargetCourse] = useState<Course | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Sign In handler for Google Auth
  const handleSignIn = async (targetCourse?: Course) => {
    if (onRequireAuth) {
      onRequireAuth();
      return;
    }
    try {
      setIsSigningIn(true);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        notify(`Welcome, ${res.user.displayName || 'Learner'}! Course access unlocked.`);
        setShowAuthGateModal(false);
        const courseToOpen = targetCourse || authGateTargetCourse;
        if (courseToOpen) {
          setActiveCourse(courseToOpen);
          setSelectedFolderId(courseToOpen.folderId);
          setTimeout(() => {
            document.getElementById('course-player-view')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        console.error("Sign-in error:", err);
        notify("Sign-in was not completed. Please try again.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  // Safe course selector: blocks logged-out/unregistered users and opens the registration prompt
  const handleSelectCourse = (course: Course) => {
    if (!user) {
      setAuthGateTargetCourse(course);
      setShowAuthGateModal(true);
      return;
    }
    setActiveCourse(course);
    setSelectedFolderId(course.folderId);
    const player = document.getElementById('course-player-view');
    player?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Admin modals
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showUploadCourseModal, setShowUploadCourseModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  
  // Upload course form state
  const [uploadFolderId, setUploadFolderId] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadDifficulty, setUploadDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [uploadEstMinutes, setUploadEstMinutes] = useState(30);
  const [uploadTags, setUploadTags] = useState('');
  const [uploadHtmlContent, setUploadHtmlContent] = useState('');

  // Certificate Modal state
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin access check: user email is i.k.shaikh@gmail.com or preview admin override
  // Strict Admin access check via isUserAdmin
  const isAdmin = isUserAdmin(user);
  const currentUserId = user?.uid || 'guest-learner';
  const studentDisplayName = userProfileName || user?.displayName || 'Learner';
  const studentEmail = user?.email || 'student@margdarshak.org';

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const courseIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Send student handshake to embedded tutorial iframe so it activates embedded mode & hides legacy form
  const sendLearnerHandshake = () => {
    try {
      courseIframeRef.current?.contentWindow?.postMessage({
        type: 'serve-learner',
        name: studentDisplayName
      }, '*');
    } catch (err) {
      console.warn("Handshake message error:", err);
    }
  };

  // Trigger handshake on active course change
  useEffect(() => {
    if (activeCourse) {
      const timer = setTimeout(sendLearnerHandshake, 350);
      return () => clearTimeout(timer);
    }
  }, [activeCourse, studentDisplayName]);

  // Load folders & courses
  useEffect(() => {
    loadContent();
  }, []);

  // Load user learning data
  useEffect(() => {
    loadUserProgress();
  }, [currentUserId]);

  const loadContent = async () => {
    const f = await getFolders();
    const c = await getCourses();
    setFolders(f);
    setCourses(c);
    if (f.length > 0 && !selectedFolderId) {
      setSelectedFolderId(f[0].id);
    }
    if (c.length > 0) {
      if (user) {
        if (!activeCourse) setActiveCourse(c[0]);
      } else {
        if (!authGateTargetCourse) setAuthGateTargetCourse(c[0]);
      }
    }
  };

  // Automatically unlock and activate course when user logs in
  useEffect(() => {
    if (user && courses.length > 0 && !activeCourse) {
      setActiveCourse(authGateTargetCourse || courses[0]);
    }
  }, [user, courses, authGateTargetCourse, activeCourse]);

  const loadUserProgress = async () => {
    const data = await getUserLearningData(currentUserId);
    setLearningData(data);
  };

  // Show temporary toast notification
  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Listen to postMessage from embedded interactive course iframe (supports both SERVE and Margdarshak events)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      // 1. SERVE Tutorial postMessage event (from house-price-prediction-tutorial_17f13d69.html)
      if (event.data.type === 'serve-tutorial-result') {
        const payload = event.data.payload;
        if (!payload || !activeCourse || !learningData) return;

        const maxPoints = Number(payload.max) || 100;
        const scorePoints = Number(payload.score) || 0;
        const percentage = Math.min(100, Math.round((scorePoints / maxPoints) * 100));

        const newScore: TestScore = {
          testId: `test-${Date.now()}`,
          courseId: activeCourse.id,
          courseTitle: payload.tutorialTitle || activeCourse.title,
          quizTitle: `${payload.tutorialTitle || activeCourse.title} (Practice & Labs)`,
          score: scorePoints,
          maxScore: maxPoints,
          percentage,
          date: Date.now(),
          passed: percentage >= 50
        };

        const updatedScores = [newScore, ...learningData.testScores.filter(s => s.courseId !== activeCourse.id)];
        const earnedXp = Math.max(60, scorePoints * 2);
        const updatedXp = (learningData.xp || 0) + earnedXp;

        const progressPct = payload.total > 0 
          ? Math.min(100, Math.round(((payload.finished || 0) / payload.total) * 100)) 
          : 100;

        const updatedProgress = {
          ...learningData.courseProgress,
          [activeCourse.id]: progressPct
        };

        // Convert tutorial items into student prep/checklist records
        let updatedPreps = [...(learningData.preps || [])];
        if (Array.isArray(payload.items)) {
          payload.items.forEach((item: any, idx: number) => {
            const prepId = `prep-${activeCourse.id}-${idx}`;
            const existingIdx = updatedPreps.findIndex(p => p.id === prepId || p.title === item.label);
            const isDone = Boolean(item.status && (item.status.includes('Correct') || item.status.includes('Done')));
            if (existingIdx >= 0) {
              updatedPreps[existingIdx] = {
                ...updatedPreps[existingIdx],
                completed: isDone,
                completedAt: isDone ? Date.now() : undefined
              };
            } else {
              updatedPreps.push({
                id: prepId,
                courseId: activeCourse.id,
                title: item.label,
                category: 'Lab Practice',
                completed: isDone,
                completedAt: isDone ? Date.now() : undefined
              });
            }
          });
        }

        // Award verified certificate if score is 70% or higher
        let updatedCerts = [...learningData.certificates];
        if (percentage >= 70 && !updatedCerts.some(c => c.courseId === activeCourse.id)) {
          const newCert: Certificate = {
            id: `cert-${Date.now()}`,
            courseId: activeCourse.id,
            courseTitle: activeCourse.title,
            recipientName: studentDisplayName,
            issueDate: Date.now(),
            score: percentage,
            certificateNumber: `MRG-AI-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`
          };
          updatedCerts.push(newCert);
          notify(`🎉 Score saved! Verified Certificate earned for ${activeCourse.title} (+${earnedXp} XP)`);
        } else {
          notify(`🎉 Scoreboard updated! ${percentage}% saved to your ID (+${earnedXp} XP)`);
        }

        const attemptCount = updatedScores.filter(s => s.courseId === activeCourse.id).length;

        // Acknowledge back to the embedded iframe to display success message
        courseIframeRef.current?.contentWindow?.postMessage({
          type: 'serve-tutorial-saved',
          attempt: attemptCount
        }, '*');

        const newData: UserLearningData = {
          ...learningData,
          courseProgress: updatedProgress,
          testScores: updatedScores,
          certificates: updatedCerts,
          preps: updatedPreps,
          xp: updatedXp,
          lastActivityAt: Date.now()
        };

        setLearningData(newData);
        await saveUserLearningData(currentUserId, newData);
      }

      // 2. Standard Margdarshak interactive quiz event
      else if (event.data.type === 'MARGDARSHAK_QUIZ_COMPLETE') {
        const payload = event.data.payload;
        if (!payload || !activeCourse || !learningData) return;

        const newScore: TestScore = {
          testId: `test-${Date.now()}`,
          courseId: activeCourse.id,
          courseTitle: activeCourse.title,
          quizTitle: payload.quizTitle || activeCourse.title,
          score: payload.score ?? 0,
          maxScore: payload.maxScore ?? 1,
          percentage: payload.percentage ?? Math.round(((payload.score || 0) / (payload.maxScore || 1)) * 100),
          date: Date.now(),
          passed: Boolean(payload.passed)
        };

        const updatedScores = [newScore, ...learningData.testScores.filter(s => s.courseId !== activeCourse.id)];
        const earnedXp = payload.xp || (newScore.passed ? 80 : 30);
        const updatedXp = (learningData.xp || 0) + earnedXp;

        const updatedProgress = {
          ...learningData.courseProgress,
          [activeCourse.id]: 100
        };

        // If high score, award certificate
        let updatedCerts = [...learningData.certificates];
        if (newScore.percentage >= 70 && !updatedCerts.some(c => c.courseId === activeCourse.id)) {
          const newCert: Certificate = {
            id: `cert-${Date.now()}`,
            courseId: activeCourse.id,
            courseTitle: activeCourse.title,
            recipientName: studentDisplayName,
            issueDate: Date.now(),
            score: newScore.percentage,
            certificateNumber: `MRG-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`
          };
          updatedCerts.push(newCert);
          notify(`🎉 Score saved! Certificate earned for ${activeCourse.title} (+${earnedXp} XP)`);
        } else {
          notify(`🎉 Scoreboard updated! ${newScore.percentage}% saved to your ID (+${earnedXp} XP)`);
        }

        const newData: UserLearningData = {
          ...learningData,
          courseProgress: updatedProgress,
          testScores: updatedScores,
          certificates: updatedCerts,
          xp: updatedXp,
          lastActivityAt: Date.now()
        };

        setLearningData(newData);
        await saveUserLearningData(currentUserId, newData);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeCourse, learningData, currentUserId, studentDisplayName]);

  // Strip or hide user details form from HTML course before rendering in iframe
  const sanitizeCourseHtml = (rawHtml: string) => {
    if (!rawHtml) return '';

    let processed = rawHtml;

    // Injected CSS to hide legacy user details form and embed sleek authentication badge
    const customInjection = `
      <style>
        #user-details-form, .user-details-form, form[id*="user"], form[class*="user"], .student-info-form, #student-info, .registration-form {
          display: none !important;
        }
      </style>
      <div style="margin: 28px 0; padding: 14px 18px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #16a34a; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">✓</div>
          <div>
            <div style="font-weight: 700; color: #166534; font-size: 13px;">Verified Margdarshak Student</div>
            <div style="font-size: 11px; color: #15803d;">${studentDisplayName} (${studentEmail})</div>
          </div>
        </div>
        <div style="font-size: 11px; background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 20px; font-weight: 700; border: 1px solid #86efac;">
          ⚡ Auto-saving scores to your ID
        </div>
      </div>
    `;

    // Inject before </body> if present, otherwise append
    if (processed.includes('</body>')) {
      processed = processed.replace('</body>', `${customInjection}</body>`);
    } else {
      processed += customInjection;
    }

    return processed;
  };

  // Create Folder Handler
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      notify("Unauthorized: Administrator permissions required.");
      setShowAddFolderModal(false);
      return;
    }
    if (!newFolderName.trim()) return;

    const folder: CourseFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      description: newFolderDesc.trim(),
      icon: 'Folder',
      createdAt: Date.now(),
      createdBy: studentEmail
    };

    await saveFolder(folder);
    setFolders(prev => [folder, ...prev]);
    setSelectedFolderId(folder.id);
    setNewFolderName('');
    setNewFolderDesc('');
    setShowAddFolderModal(false);
    notify(`Folder "${folder.name}" created successfully!`);
  };

  // File Upload Reader Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    if (!uploadTitle) {
      // derive title from filename
      const titleCandidate = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setUploadTitle(titleCandidate.charAt(0).toUpperCase() + titleCandidate.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setUploadHtmlContent(content || '');
    };
    reader.readAsText(file);
  };

  // Save Uploaded Course
  const handleUploadCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      notify("Unauthorized: Administrator permissions required.");
      setShowUploadCourseModal(false);
      return;
    }
    if (!uploadTitle.trim() || !uploadFileName.trim() || !uploadHtmlContent.trim()) {
      notify("Please provide course title, filename, and HTML content.");
      return;
    }

    const targetFolderId = uploadFolderId || selectedFolderId || folders[0]?.id || 'folder-default';

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      folderId: targetFolderId,
      title: uploadTitle.trim(),
      fileName: uploadFileName.trim(),
      htmlContent: uploadHtmlContent,
      description: uploadDesc.trim() || `Comprehensive module on ${uploadTitle}`,
      difficulty: uploadDifficulty,
      estimatedMinutes: Number(uploadEstMinutes) || 30,
      tags: uploadTags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: Date.now(),
      createdBy: studentEmail
    };

    await saveCourse(newCourse);
    setCourses(prev => [newCourse, ...prev]);
    setActiveCourse(newCourse);
    setSelectedFolderId(targetFolderId);

    // Reset upload state
    setUploadTitle('');
    setUploadFileName('');
    setUploadDesc('');
    setUploadHtmlContent('');
    setUploadTags('');
    setShowUploadCourseModal(false);
    notify(`Course "${newCourse.title}" uploaded to directory!`);
  };

  // Delete Course
  const handleDeleteCourse = async (courseId: string, title: string) => {
    if (!isAdmin) {
      notify("Unauthorized: Administrator permissions required.");
      return;
    }
    await deleteCourse(courseId);
    setCourses(prev => prev.filter(c => c.id !== courseId));
    if (activeCourse?.id === courseId) {
      const remaining = courses.filter(c => c.id !== courseId);
      setActiveCourse(remaining[0] || null);
    }
    notify(`Deleted course "${title}"`);
  };

  // Toggle Prep Item
  const handleTogglePrep = async (prepId: string) => {
    if (!learningData) return;
    const updatedPreps = learningData.preps.map(p => 
      p.id === prepId ? { ...p, completed: !p.completed, completedAt: !p.completed ? Date.now() : undefined } : p
    );
    const updatedData = { ...learningData, preps: updatedPreps, xp: (learningData.xp || 0) + 15 };
    setLearningData(updatedData);
    await saveUserLearningData(currentUserId, updatedData);
    notify(`Checklist updated! +15 XP`);
  };

  // Filtered courses for current folder or search
  const visibleCourses = courses.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.fileName.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    }
    return !selectedFolderId || c.folderId === selectedFolderId;
  });

  // Latest courses: 4 most recently added
  const latestCourses = [...courses].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

  // Overall stats
  const completedCount = learningData ? Object.values(learningData.courseProgress).filter(p => p === 100).length : 0;
  const avgScore = learningData && learningData.testScores.length > 0 
    ? Math.round(learningData.testScores.reduce((acc, curr) => acc + curr.percentage, 0) / learningData.testScores.length) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <Sparkles className="text-amber-400" size={18} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Inspiring Header: Philosophy of Learning & Where to Focus */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl border border-indigo-800/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-4">
            <Brain size={14} className="text-indigo-400" />
            Empowered Learning Space
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
            Master Any Frontier. <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-sky-300 to-emerald-400">Think From First Principles.</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed max-w-3xl">
            True excellence doesn't come from rote memorization. It is forged through active recall, continuous testing, hands-on experimentation, and understanding the core axioms of technology and nature.
          </p>

          {/* Quick Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-indigo-400/50 transition-all">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-3">
                <Lightbulb size={18} className="text-indigo-400" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Feynman Technique</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Explain complex ideas in simple, everyday language without jargon until the core is crystalline.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-400/50 transition-all">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
                <Target size={18} className="text-emerald-400" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">70-20-10 Focus Formula</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                70% hands-on problem solving, 20% guided preps & checklists, 10% competing on public leaderboards.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-sky-400/50 transition-all">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center mb-3">
                <Trophy size={18} className="text-sky-400" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Live Scoreboard Tracking</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every exercise and test score is verified and saved under your ID for credentials and certificates.
              </p>
            </div>
          </div>

          {/* Tab Navigation inside Learn */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10">
              <button 
                onClick={() => setActiveTab('catalog')} 
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'catalog' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <BookOpen size={16} /> Course Catalog & Labs
              </button>
              {user && (
                <button 
                  onClick={() => setActiveTab('scoreboard')} 
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'scoreboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <BarChart2 size={16} /> My Scoreboard & Records ({learningData?.testScores.length || 0})
                </button>
              )}
              <button 
                onClick={() => setActiveTab('methodology')} 
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'methodology' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <Compass size={16} /> Where to Focus Guide
              </button>
            </div>

            {/* Admin Controls: Strictly limited to authorized administrators */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
                  <ShieldCheck size={13} /> Admin
                </span>
                <button
                  onClick={() => setShowAddFolderModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/10"
                  title="Create a new course directory folder"
                >
                  <FolderPlus size={15} /> Add Directory
                </button>
                <button
                  onClick={() => setShowUploadCourseModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/40"
                  title="Upload custom HTML course file"
                >
                  <Upload size={15} /> Upload Course (.html)
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TAB 1: CATALOG & LABS */}
      {activeTab === 'catalog' && (
        <div className="space-y-8">
          {/* Latest Courses Highlight Cards with Filenames */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                  <Flame size={14} /> Recently Added Courses
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Latest Interactive Modules</h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Click any card to start lab
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {latestCourses.map((c) => {
                const isSelected = activeCourse?.id === c.id;
                const isCompleted = learningData?.courseProgress[c.id] === 100;
                return (
                  <div 
                    key={c.id}
                    onClick={() => handleSelectCourse(c)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected && user
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md ring-2 ring-indigo-500/20' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">
                          {c.fileName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                          c.difficulty === 'Intermediate' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {c.difficulty}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
                        {c.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {c.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Clock size={13} />
                        <span>{c.estimatedMinutes} mins</span>
                      </div>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle size={13} /> Finished
                        </span>
                      ) : !user ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                          <Lock size={12} /> Log in to start
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                          Start <ChevronRight size={13} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main 2-Column: Hierarchy Tree on Left, Course Player on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Folders & Course Hierarchy */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="text-indigo-600" size={18} />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Course Hierarchy</h3>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setShowAddFolderModal(true)}
                    className="p-1.5 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                    title="Add New Folder (Admin Only)"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses or files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Folder list */}
              <div className="space-y-3">
                {folders.map(folder => {
                  const folderCourses = courses.filter(c => c.folderId === folder.id);
                  const isFolderSelected = selectedFolderId === folder.id;

                  return (
                    <div 
                      key={folder.id}
                      className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/60"
                    >
                      {/* Folder Header */}
                      <button
                        onClick={() => setSelectedFolderId(folder.id)}
                        className={`w-full text-left p-3 flex items-center justify-between transition-colors ${
                          isFolderSelected 
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/40 font-bold text-indigo-900 dark:text-indigo-200' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Folder size={17} className={isFolderSelected ? "text-indigo-600" : "text-amber-500"} />
                          <span className="text-xs font-bold truncate">{folder.name}</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {folderCourses.length}
                        </span>
                      </button>

                      {/* Folder Courses List */}
                      {isFolderSelected && (
                        <div className="p-2 space-y-1 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                          {folderCourses.length === 0 ? (
                            <div className="p-3 text-center text-xs text-slate-400">
                              No course files yet.
                              {isAdmin && (
                                <button 
                                  onClick={() => {
                                    setUploadFolderId(folder.id);
                                    setShowUploadCourseModal(true);
                                  }}
                                  className="block mx-auto mt-2 text-indigo-600 text-xs font-bold hover:underline"
                                >
                                  + Upload HTML File
                                </button>
                              )}
                            </div>
                          ) : (
                            folderCourses.map(course => {
                              const isActive = activeCourse?.id === course.id;
                              const isCompleted = learningData?.courseProgress[course.id] === 100;
                              return (
                                <div
                                  key={course.id}
                                  onClick={() => handleSelectCourse(course)}
                                  className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-all ${
                                    isActive && user
                                      ? 'bg-indigo-600 text-white font-semibold shadow-xs' 
                                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate pr-2">
                                    <FileCode size={14} className={isActive && user ? "text-white" : "text-indigo-500"} />
                                    <div className="truncate">
                                      <div className="truncate">{course.title}</div>
                                      <div className={`text-[10px] font-mono truncate ${isActive && user ? 'text-indigo-100' : 'text-slate-400'}`}>
                                        {course.fileName}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {!user ? (
                                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60">
                                        <Lock size={10} /> Locked
                                      </span>
                                    ) : isCompleted ? (
                                      <CheckCircle size={14} className={isActive ? "text-white" : "text-emerald-500"} />
                                    ) : null}
                                    {isAdmin && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteCourse(course.id, course.title);
                                        }}
                                        className={`p-1 rounded-md opacity-70 hover:opacity-100 hover:text-rose-500`}
                                        title="Delete file"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Student Sync Status */}
              {!user ? (
                <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 mb-1">
                    <Lock size={15} className="text-amber-600 dark:text-amber-400" />
                    Guest / Logged Out
                  </div>
                  <p className="text-amber-800/90 dark:text-amber-300/90 text-[11px] leading-relaxed mb-3">
                    Course access and scoreboards are locked. Register or sign in to start learning and earn certificates.
                  </p>
                  <button
                    onClick={() => handleSignIn()}
                    disabled={isSigningIn}
                    className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <LogIn size={13} /> Log In / Register Now
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white mb-1">
                    <ShieldCheck size={15} className="text-emerald-500" />
                    Authenticated Profile
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    Exercise scores, certifications, and test data are stored for <strong>{studentDisplayName}</strong> (Cloud Synced).
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Active Interactive Course Viewer & Scoreboard */}
            <div id="course-player-view" className="lg:col-span-8 space-y-6">
              {!user ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

                  <div className="relative z-10 max-w-xl mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
                      <Lock size={30} />
                    </div>

                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 mb-3 border border-amber-200 dark:border-amber-800/60">
                      Learner Registration Required
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
                      Log In or Register to Access the Course
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      Interactive tutorials, live in-browser Python execution, automated scoreboards, and verified SERVE completion certificates are exclusively accessible to registered students.
                    </p>

                    {(authGateTargetCourse || (courses.length > 0 && courses[0])) && (
                      <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-left flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                          <FileCode size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                            Ready to unlock: {(authGateTargetCourse || courses[0]).fileName}
                          </div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {(authGateTargetCourse || courses[0]).title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {(authGateTargetCourse || courses[0]).estimatedMinutes} mins • {(authGateTargetCourse || courses[0]).difficulty} • In-browser Python sandbox & practice tests
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Features checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-8">
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                          <Sparkles size={14} className="text-amber-500" />
                          Interactive Labs
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          In-browser Python code execution & real-time graphs.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                          <BarChart2 size={14} className="text-indigo-500" />
                          Personal Scoreboard
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          Quiz scores & progress saved to your learner account.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                          <Trophy size={14} className="text-yellow-500" />
                          Verified Certificates
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          Earn official verifiable certificates for your resume.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSignIn(authGateTargetCourse || courses[0])}
                      disabled={isSigningIn}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2.5 mx-auto transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
                    >
                      {isSigningIn ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <LogIn size={16} />
                          Log In / Register with Google to Access
                        </>
                      )}
                    </button>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">
                      Takes 5 seconds. Free for all learners with zero fees.
                    </div>
                  </div>
                </div>
              ) : activeCourse ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                  {/* Course Header Bar */}
                  <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                          {activeCourse.fileName}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          • {activeCourse.estimatedMinutes} mins • {activeCourse.difficulty}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                        {activeCourse.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      {learningData?.courseProgress[activeCourse.id] === 100 ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                          <CheckCircle size={15} /> Completed
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                          <Play size={13} fill="currentColor" /> In Progress
                        </div>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteCourse(activeCourse.id, activeCourse.title)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sanitized Sandbox Frame (User details form at bottom automatically replaced) */}
                  <div className="w-full bg-slate-100 dark:bg-slate-950 p-2 md:p-4">
                    <iframe
                      ref={courseIframeRef}
                      title={activeCourse.title}
                      src={activeCourse.filePath || undefined}
                      srcDoc={activeCourse.filePath ? undefined : sanitizeCourseHtml(activeCourse.htmlContent)}
                      onLoad={sendLearnerHandshake}
                      className="w-full h-[740px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white shadow-inner"
                      sandbox="allow-scripts allow-forms allow-same-origin allow-modals allow-downloads"
                    />
                  </div>

                  {/* Course Footer Info & Metadata */}
                  <div className="p-5 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Sparkles size={14} className="text-amber-500" />
                      <span>Completing exercises automatically updates your student record and unlocks rewards.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {user && (
                        <button 
                          onClick={() => setActiveTab('scoreboard')}
                          className="px-4 py-2 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors"
                        >
                          View My Scores
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <FileCode size={40} className="mx-auto text-slate-400 mb-3" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">No Course Selected</h3>
                  <p className="text-slate-500 text-sm mt-1">Select a course module from the directory on the left.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY SCOREBOARD & RECORDS */}
      {activeTab === 'scoreboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Overview Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Total XP Points</span>
                <Flame className="text-amber-500" size={20} />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {learningData?.xp || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">Earned via exercises & tests</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Average Test Score</span>
                <Award className="text-indigo-500" size={20} />
              </div>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {avgScore}%
              </div>
              <p className="text-xs text-slate-500 mt-1">Across all completed quizzes</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Completed Modules</span>
                <CheckCircle className="text-emerald-500" size={20} />
              </div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {completedCount} / {courses.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Course progress tracking</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Certificates Earned</span>
                <Trophy className="text-yellow-500" size={20} />
              </div>
              <div className="text-3xl font-black text-yellow-600 dark:text-yellow-400">
                {learningData?.certificates.length || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">Scores ≥ 70% verified</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Detailed Test Submissions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Test Scores & Quiz Results</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Synchronized under User ID: {currentUserId}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 text-xs font-bold">
                    {learningData?.testScores.length || 0} Tests
                  </span>
                </div>

                {(!learningData || learningData.testScores.length === 0) ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    No test submissions yet. Start an interactive course and take the knowledge check!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {learningData.testScores.map(t => (
                      <div 
                        key={t.testId} 
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">{t.quizTitle}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {t.courseTitle} • {new Date(t.date).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className={`text-base font-black ${t.percentage >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {t.percentage}%
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.passed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'}`}>
                            {t.passed ? 'Passed' : 'Needs Review'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Certificates */}
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Earned Certificates</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Official Margdarshak competency credentials</p>
                  </div>
                  <Award className="text-amber-500" size={20} />
                </div>

                {(!learningData || learningData.certificates.length === 0) ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    Score 70% or higher in course quizzes to unlock verified certificates.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {learningData.certificates.map(cert => (
                      <div 
                        key={cert.id}
                        className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-linear-to-br from-amber-50/60 to-yellow-50/20 dark:from-amber-950/20 dark:to-yellow-950/10 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold">
                              {cert.certificateNumber}
                            </span>
                            <Trophy size={16} className="text-amber-500" />
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                            {cert.courseTitle}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Issued to <strong>{cert.recipientName}</strong> with {cert.score}% score.
                          </p>
                        </div>

                        <button
                          onClick={() => setViewingCertificate(cert)}
                          className="mt-4 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Award size={14} /> View Certificate
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Prep Checklist & Competition Leaderboards */}
            <div className="lg:col-span-5 space-y-6">
              {/* Prep & Readiness Checklist */}
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckSquare size={18} className="text-indigo-600" />
                    Essential Preps & Checklists
                  </h3>
                  <span className="text-xs font-bold text-indigo-600">+15 XP each</span>
                </div>

                <div className="space-y-3">
                  {learningData?.preps.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => handleTogglePrep(p.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        p.completed 
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50' 
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-indigo-300'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={p.completed} 
                        onChange={() => {}}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500" 
                      />
                      <div className="text-xs">
                        <div className={`font-semibold ${p.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                          {p.title}
                        </div>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold text-slate-400">
                          {p.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competition Entries */}
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Trophy size={18} className="text-amber-500" />
                    Hackathons & Competitions
                  </h3>
                </div>

                <div className="space-y-3">
                  {learningData?.competitions.map(comp => (
                    <div 
                      key={comp.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{comp.title}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{comp.courseTitle}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          {comp.badge}
                        </span>
                        <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                          Score: {comp.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHERE TO FOCUS GUIDE */}
      {activeTab === 'methodology' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">
              Where to Focus by Academic Stage
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-3xl">
              Success in higher education, entrance exams, and frontier careers follows a deliberate sequence. Here is how high-performing students organize their cognitive energy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stage 1: Grades 8 to 10 */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Phase 1: Foundation
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                    Classes 8th to 10th
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>Mathematical Intuition:</strong> Master geometry, algebraic proofs, and rate of change.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>Scientific Method:</strong> Conduct kitchen experiments and question cause-and-effect.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>Coding Fundamentals:</strong> Write simple Python scripts or scratch games to learn algorithmic logic.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  Focus: Curiosity & Rigorous Basics
                </div>
              </div>

              {/* Stage 2: Grades 11 to 12 */}
              <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Phase 2: Depth & Rigor
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                    Classes 11th & 12th (Entrance Focus)
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>High-Stakes Problem Solving:</strong> Timed practice with JEE Advanced, NEET, or CLAT standard questions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>Deep Work Blocks:</strong> 3-hour uninterrupted focus cycles to simulate actual exam pressure.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>Error Logging:</strong> Keep an "Error Notebook" and review every wrong answer weekly.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  Focus: Speed, Precision & Conceptual Depth
                </div>
              </div>

              {/* Stage 3: College & Frontier */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Phase 3: Frontier Mastery
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                    Undergraduate & Research
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Open-Source Contributions:</strong> Publish GitHub repos, papers, or technical blog breakdowns.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Competitions & Hackathons:</strong> Test your skills against global talent on Kaggle or developer jams.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Mentorship & Industry Networks:</strong> Reach out directly to researchers and lab leads.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Focus: High-Impact Projects & Public Proof of Work
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-indigo-600 text-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base">Ready to align your learning with high-growth careers?</h4>
                <p className="text-xs text-indigo-100 mt-1">Explore career paths and official exam portals mapped to your academic preferences.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onNavigateToExplore}
                  className="px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-colors"
                >
                  Explore Careers
                </button>
                <button
                  onClick={onNavigateToResources}
                  className="px-4 py-2 bg-indigo-700 text-white hover:bg-indigo-800 rounded-xl text-xs font-bold transition-colors"
                >
                  View Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD DIRECTORY / FOLDER */}
      <AnimatePresence>
        {showAddFolderModal && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FolderPlus className="text-indigo-600" size={20} />
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Create Course Directory</h3>
                </div>
                <button onClick={() => setShowAddFolderModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Directory Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neuromorphic Computing & AI Chips"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the course files contained in this folder..."
                    value={newFolderDesc}
                    onChange={(e) => setNewFolderDesc(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddFolderModal(false)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
                  >
                    Create Directory
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: UPLOAD COURSE FILE (.html) */}
      <AnimatePresence>
        {showUploadCourseModal && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl my-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Upload className="text-emerald-600" size={20} />
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Upload Custom HTML Course</h3>
                </div>
                <button onClick={() => setShowUploadCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUploadCourse} className="space-y-4">
                {/* Target Folder */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Select Target Directory *
                  </label>
                  <select
                    value={uploadFolderId || selectedFolderId || (folders[0]?.id || '')}
                    onChange={(e) => setUploadFolderId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {/* File picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Select .HTML File from your computer
                  </label>
                  <input
                    type="file"
                    accept=".html,.htm"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-indigo-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Spiking Neural Networks Lab"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Filename (.html) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. spiking_neural_net.html"
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={uploadDifficulty}
                      onChange={(e) => setUploadDifficulty(e.target.value as any)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Estimated Minutes
                    </label>
                    <input
                      type="number"
                      value={uploadEstMinutes}
                      onChange={(e) => setUploadEstMinutes(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Course Description
                  </label>
                  <input
                    type="text"
                    placeholder="Short description for preview cards..."
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    HTML Course Content (or paste code) *
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="<!DOCTYPE html><html>...paste HTML course code here...</html>"
                    value={uploadHtmlContent}
                    onChange={(e) => setUploadHtmlContent(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Note: Any user details form in the HTML will be stripped automatically, as student details are pre-authenticated.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadCourseModal(false)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30"
                  >
                    Upload & Publish Course
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CERTIFICATE PREVIEW MODAL */}
      <AnimatePresence>
        {viewingCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-2xl w-full border-4 border-amber-400 shadow-2xl relative text-center"
            >
              <button 
                onClick={() => setViewingCertificate(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>

              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 mb-4 border border-amber-300">
                <Award size={32} />
              </div>

              <div className="text-xs uppercase tracking-widest font-black text-amber-600 mb-1">
                Certificate of Academic Achievement
              </div>
              <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-4">
                Margdarshak Center for Frontier Learning
              </h2>

              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">This is proudly presented to</p>
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-300 font-serif mb-4 underline decoration-amber-400">
                {viewingCertificate.recipientName}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
                For successfully mastering and demonstrating proficiency in the frontier course module:
                <br />
                <strong className="text-slate-900 dark:text-white text-base">{viewingCertificate.courseTitle}</strong>
                <br />
                with a verified score of <strong>{viewingCertificate.score}%</strong>.
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                <div className="text-left font-mono">
                  Certificate ID: <strong className="text-slate-700 dark:text-slate-300">{viewingCertificate.certificateNumber}</strong>
                  <br />
                  Issued Date: {new Date(viewingCertificate.issueDate).toLocaleDateString()}
                </div>
                <div className="text-right">
                  <div className="font-serif font-bold text-slate-900 dark:text-white text-sm">Margdarshak Academic Board</div>
                  <div className="text-[10px] text-slate-400">SERVE Educational Initiatives</div>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/30"
                >
                  <Download size={14} /> Print / Save PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AUTH GATE MODAL: Prompt logged out or unregistered users */}
      <AnimatePresence>
        {showAuthGateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 relative overflow-hidden"
            >
              <button
                onClick={() => setShowAuthGateModal(false)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Lock size={24} />
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1.5">
                Sign In to Access Course
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Interactive tutorials, live in-browser labs, and verified certificates require student registration so your records and attempts are saved.
              </p>

              {authGateTargetCourse && (
                <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold block mb-0.5">
                    Course Module:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">
                    {authGateTargetCourse.title}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {authGateTargetCourse.fileName} • {authGateTargetCourse.estimatedMinutes} mins • {authGateTargetCourse.difficulty}
                  </span>
                </div>
              )}

              <div className="space-y-2.5">
                <button
                  onClick={() => handleSignIn()}
                  disabled={isSigningIn}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-70"
                >
                  {isSigningIn ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Connecting to Sign-In...
                    </>
                  ) : (
                    <>
                      <LogIn size={15} />
                      Sign In / Register with Google
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowAuthGateModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-xs transition-colors"
                >
                  Cancel & Browse Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
