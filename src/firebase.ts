import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { getAI, GoogleAIBackend } from 'firebase/ai';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// App Check proves that AI requests come from this real site. Firebase AI Logic requires it.
// Set VITE_RECAPTCHA_ENTERPRISE_SITE_KEY at build time (see DEPLOY.md). It is a public site key, not a secret.
const appCheckSiteKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY as string | undefined;
if (import.meta.env.DEV) {
  // Local development only: the console prints a debug token to register under Firebase console > App Check.
  (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string }).FIREBASE_APPCHECK_DEBUG_TOKEN =
    (import.meta.env.VITE_APPCHECK_DEBUG_TOKEN as string | undefined) || true;
}
if (appCheckSiteKey || import.meta.env.DEV) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey || 'debug-only'),
    isTokenAutoRefreshEnabled: true,
  });
} else {
  console.warn('App Check is not configured: AI guidance requests will be rejected. See DEPLOY.md.');
}

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();
// Gemini is called through Firebase AI Logic: Google keeps the API key on its side, so no key ships in this app.
export const ai = getAI(app, { backend: new GoogleAIBackend() });
