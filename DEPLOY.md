# Deploying Margdarshak on Firebase (free Spark plan)

Target: `https://serve-margdarshak.web.app`, project `gen-lang-client-0737271374`.

The app has no Gemini API key. AI guidance goes through **Firebase AI Logic**, where Google keeps the key on its side.
**App Check** (reCAPTCHA Enterprise) proves requests come from this site. Both are free and need no billing account.

## One-time console setup

1. **AI Logic.** Firebase console > Build > AI Logic > Get started > choose **Gemini Developer API**.
   Do not link a Cloud Billing account if you want to stay on the free plan.
2. **reCAPTCHA Enterprise key.** Create it in the **Google Cloud console** (Security > Fraud Defense / reCAPTCHA), not on the
   classic reCAPTCHA admin site (a classic key comes with a secret key and will not work here). Create a **Web**-type key,
   leave **"Use checkbox challenge" unticked** (App Check needs a score-based key), and list the domains
   `serve-margdarshak.web.app` (and your custom domain later). Do **not** add `localhost`.
   Free quota: 10,000 assessments per month. Put the key ID in `.env.production` as `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` before building.
   There is no secret key to store: App Check keeps that part inside Firebase.
3. **App Check.** Firebase console > App Check > Apps > register the web app > reCAPTCHA Enterprise > paste the key ID.
   Then App Check > APIs > **Firebase AI Logic** > **Enforce**. (From 2 Nov 2026 Google enforces this anyway.)
4. **Restrict the Firebase web key.** Google Cloud console > APIs & Services > Credentials > the browser key:
   Application restriction = HTTP referrers, `https://serve-margdarshak.web.app/*`. Do not add the Generative Language API.
5. **Per-user AI limit (optional).** Default is 100 requests per minute per user. Lower it in Google Cloud console >
   Firebase AI Logic API > Quotas.
6. **Hosting site.** `npx firebase-tools hosting:sites:create serve-margdarshak` (or Hosting > Add another site).
7. **Sign-in domain.** Authentication > Settings > Authorized domains: make sure `serve-margdarshak.web.app` is listed.
8. **Admins.** The email list in `firestore.rules` (`isAdmin`) currently has `i.k.shaikh@gmail.com`; add others there and redeploy
   the rules. Admins see the all-results table on the Learn page.

## Deploy

```bash
npm install
npm run build
npx firebase-tools login
npx firebase-tools deploy --only hosting,firestore:rules
```

## Local development

`npm run dev` prints an App Check debug token in the browser console. Register it under App Check > Apps > Manage debug
tokens, and optionally set it as `VITE_APPCHECK_DEBUG_TOKEN`. Never use a debug token in a production build.

## Adding a Learn part

Put the tutorial HTML in `public/learn/` and add an entry to `PARTS` in `src/components/Learn.tsx`.
The tutorial sends its result to the app with `postMessage`; the app saves it to the `learnResults` collection.

## Known limits (read before launch)

- **No live web search.** Google Search grounding is not available on the free Gemini tier, so guidance comes from the
  model's own knowledge. The prompt asks for approximate figures and official homepage links only.
- **Free-tier data terms.** Under the Gemini API terms for unpaid services, Google may use submitted content to improve
  its products and human reviewers may read it, and the terms say not to submit personal information.
  The terms also require API users to be 18+ and prohibit API clients directed at or likely to be accessed by people under 18.
  Margdarshak serves students from 8th standard, so decide how to handle this before launch.
  See https://ai.google.dev/gemini-api/terms
- **Scores are self-reported.** They are calculated in the learner's browser. Rules can check format and limits, not honesty.
  Review the project links in mini challenges before trusting a score.
- **Rules are untested here.** Check `firestore.rules` in the Firebase console Rules Playground or the emulator before launch.
