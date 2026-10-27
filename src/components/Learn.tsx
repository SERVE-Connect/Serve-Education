import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Download, GraduationCap, LogIn } from 'lucide-react';
import { User, signInWithPopup } from 'firebase/auth';
import { addDoc, collection, getDocs, limit, query, serverTimestamp, where } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { LearnResult, LearnResultItem, StudentProfile } from '../types';

// Each part is a standalone HTML tutorial in /public/learn. Add new parts here.
const PARTS = [
  {
    id: 'house-price-prediction',
    file: '/learn/house-price-prediction.html',
    title: 'AI Project #1: House Price Prediction App',
    level: 'Beginner',
    minutes: 45,
    tags: ['Python', 'Pandas', 'Scikit-learn', 'Streamlit'],
  },
];

const clampInt = (v: unknown, max: number) => Math.max(0, Math.min(max, Math.round(Number(v) || 0)));
const clip = (v: unknown, n: number) => String(v ?? '').slice(0, n);
const millis = (r: LearnResult) => r.createdAt?.toDate().getTime() ?? 0;
const newestFirst = (a: LearnResult, b: LearnResult) => millis(b) - millis(a);
const when = (r: LearnResult) => (r.createdAt ? r.createdAt.toDate().toLocaleString() : '');
// Student-typed text goes into a spreadsheet: neutralise cells that would run as formulas.
const csvCell = (v: unknown) => {
  const s = String(v ?? '');
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

interface LearnProps {
  user: User | null;
  profile: Partial<StudentProfile> | null;
}

export function Learn({ user, profile }: LearnProps) {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mine, setMine] = useState<LearnResult[]>([]);
  const [all, setAll] = useState<LearnResult[] | null>(null); // stays null unless Firestore rules say this user is an admin
  const [saved, setSaved] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const active = PARTS.find((p) => p.id === activeId) || null;

  const loadMine = useCallback(async () => {
    if (!user) { setMine([]); return; }
    const snap = await getDocs(query(collection(db, 'learnResults'), where('uid', '==', user.uid)));
    setMine(snap.docs.map((d) => ({ id: d.id, ...d.data() } as LearnResult)).sort(newestFirst));
  }, [user]);

  useEffect(() => { loadMine().catch(console.error); }, [loadMine]);

  // Admin probe: an unfiltered read only succeeds when the Firestore rules allow it (see firestore.rules).
  useEffect(() => {
    setAll(null);
    if (!user) return;
    let cancelled = false;
    getDocs(query(collection(db, 'learnResults'), limit(500)))
      .then((snap) => { if (!cancelled) setAll(snap.docs.map((d) => ({ id: d.id, ...d.data() } as LearnResult)).sort(newestFirst)); })
      .catch(() => { /* not an admin */ });
    return () => { cancelled = true; };
  }, [user]);

  const reply = (msg: object) => iframeRef.current?.contentWindow?.postMessage(msg, window.location.origin);

  // The tutorial (same-origin iframe) sends its result here; this page saves it to the signed-in user's account.
  useEffect(() => {
    const onMessage = async (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== iframeRef.current?.contentWindow) return;
      if (!e.data || e.data.type !== 'serve-tutorial-result' || !e.data.payload) return;
      if (!user) { reply({ type: 'serve-tutorial-error', message: 'Please sign in using the button above the tutorial, then press Submit again.' }); return; }
      const p = e.data.payload;
      const part = PARTS.find((x) => x.id === p.tutorialId);
      if (!part) { reply({ type: 'serve-tutorial-error', message: 'Unknown tutorial.' }); return; }
      const items: LearnResultItem[] = (Array.isArray(p.items) ? p.items : []).slice(0, 20).map((i: any) => ({
        label: clip(i?.label, 80), status: clip(i?.status, 40), pts: clampInt(i?.pts, 1000), max: clampInt(i?.max, 1000), detail: clip(i?.detail, 2000),
      }));
      const max = clampInt(p.max, 100000);
      const lastEdu = profile?.education?.[profile.education.length - 1];
      const attempt = mine.filter((r) => r.tutorialId === part.id).length + 1;
      try {
        await addDoc(collection(db, 'learnResults'), {
          uid: user.uid,
          tutorialId: part.id,
          tutorialTitle: part.title,
          studentName: clip(profile?.fullName || user.displayName, 100),
          email: clip(profile?.email || user.email, 200),
          linkedin: clip(profile?.linkedin, 200),
          qualification: clip(lastEdu?.degree, 100),
          passOutYear: clip(lastEdu?.year, 10),
          score: Math.min(clampInt(p.score, 100000), max),
          max,
          finished: clampInt(p.finished, 20),
          total: clampInt(p.total, 20),
          attempt,
          startedAt: clampInt(p.startedAt, 4102444800000),
          timeTakenSec: clampInt(p.timeTakenSec, 10000000),
          items,
          createdAt: serverTimestamp(),
        });
        setSaved(attempt);
        reply({ type: 'serve-tutorial-saved', attempt });
        loadMine().catch(console.error);
      } catch (err) {
        console.error(err);
        reply({ type: 'serve-tutorial-error', message: 'Could not save your result. Please try again.' });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [user, profile, mine, loadMine]);

  const signIn = async () => {
    try { await signInWithPopup(auth, googleProvider); }
    catch (err: any) {
      if (err?.code !== 'auth/cancelled-popup-request' && err?.code !== 'auth/popup-closed-by-user') console.error(err);
    }
  };

  const downloadCsv = () => {
    if (!all) return;
    const head = ['Date', 'Name', 'Email', 'LinkedIn', 'Qualification', 'Pass-out year', 'Tutorial', 'Attempt', 'Score', 'Max', 'Percent', 'Finished', 'Time (s)'];
    const rows = all.map((r) => [when(r), r.studentName, r.email, r.linkedin, r.qualification, r.passOutYear, r.tutorialTitle, r.attempt, r.score, r.max, r.max ? Math.round((r.score / r.max) * 100) : 0, `${r.finished}/${r.total}`, r.timeTakenSec]);
    const csv = [head, ...rows].map((r) => r.map(csvCell).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'learn-results.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const card = 'bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm';

  if (active) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <button onClick={() => { setActiveId(null); setSaved(null); }} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 mb-4">
          <ArrowLeft size={16} /> {t('learnBack')}
        </button>
        {!user && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-amber-900 dark:text-amber-200">{t('learnSignInPrompt')}</span>
            <button onClick={signIn} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2"><LogIn size={16} /> {t('learnSignIn')}</button>
          </div>
        )}
        {saved !== null && (
          <div className="mb-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-sm text-emerald-900 dark:text-emerald-200">
            ✅ {t('learnResultSaved')} ({t('learnAttempt')} #{saved})
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={active.file}
          title={active.title}
          onLoad={() => reply({ type: 'serve-learner', name: profile?.fullName || user?.displayName || '' })}
          className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white"
          style={{ height: '85vh', minHeight: 600 }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('learnTitle')}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t('learnSubtitle')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {PARTS.map((p) => (
          <div key={p.id} className={card}>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wide mb-3"><GraduationCap size={16} /> {p.level}</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3"><Clock size={14} /> {p.minutes} min</div>
            <div className="flex flex-wrap gap-2 mb-5">
              {p.tags.map((tag) => <span key={tag} className="px-2 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{tag}</span>)}
            </div>
            <button onClick={() => setActiveId(p.id)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold">{t('learnStart')}</button>
          </div>
        ))}
      </div>

      {user && (
        <section className="mt-12">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('learnYourResults')}</h3>
          {mine.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">{t('learnNoResults')}</p>
          ) : (
            <div className="space-y-3">
              {mine.map((r) => (
                <div key={r.id} className={`${card} !p-4 flex flex-wrap items-center justify-between gap-2`}>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{r.tutorialTitle}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t('learnAttempt')} #{r.attempt} · {when(r)}</div>
                  </div>
                  <div className="font-bold text-indigo-600">{r.score} / {r.max}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {all && (
        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('learnAdminTitle')}</h3>
            <button onClick={downloadCsv} className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-sm font-bold flex items-center gap-2"><Download size={16} /> {t('learnDownloadCsv')}</button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-sm text-left bg-white dark:bg-slate-900">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>{['Date', 'Name', 'Email', 'Qualification', 'Pass-out', 'Attempt', 'Score', 'Time'].map((h) => <th key={h} className="px-3 py-2 whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300">
                {all.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2 whitespace-nowrap">{when(r)}</td>
                    <td className="px-3 py-2">{r.studentName}</td>
                    <td className="px-3 py-2">{r.email}</td>
                    <td className="px-3 py-2">{r.qualification}</td>
                    <td className="px-3 py-2">{r.passOutYear}</td>
                    <td className="px-3 py-2">#{r.attempt}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{r.score}/{r.max}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{Math.floor(r.timeTakenSec / 60)}m {r.timeTakenSec % 60}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </motion.div>
  );
}
