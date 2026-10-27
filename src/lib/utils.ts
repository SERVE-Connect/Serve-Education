import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateCompletion(profile: any): number {
  if (!profile) return 0;
  let score = 0;
  
  // Step 1: Basic Info (20%)
  const fullName = String(profile.fullName || '');
  const phone = String(profile.phone || '');
  const location = String(profile.location || '');
  const birthDate = String(profile.birthDate || '');
  const basicFields = [fullName, phone, location, birthDate];
  const filledBasic = basicFields.filter(f => f.trim() !== '').length;
  score += (filledBasic / 4) * 20;

  // Step 2: Education & Skills (20%)
  let eduScore = 0;
  if (profile.grade) eduScore += 1;
  if (profile.education && profile.education.length > 0) eduScore += 1;
  if (profile.skills && profile.skills.length > 0) eduScore += 1;
  score += (eduScore / 3) * 20;

  // Step 3: Experience & Projects (20%)
  let expProjScore = 0;
  if (profile.isFresher || (profile.experience && profile.experience.length > 0)) expProjScore += 1;
  if (profile.hasNoProjects || (profile.projects && profile.projects.length > 0)) expProjScore += 1;
  score += (expProjScore / 2) * 20;

  // Step 4: Interests & Strengths (20%)
  let intStrScore = 0;
  if (profile.interests && profile.interests.length >= 2) intStrScore += 1;
  else if (profile.interests && profile.interests.length === 1) intStrScore += 0.5;
  
  if (profile.strengths && profile.strengths.length >= 2) intStrScore += 1;
  else if (profile.strengths && profile.strengths.length === 1) intStrScore += 0.5;
  
  score += (intStrScore / 2) * 20;

  // Step 5: Preferences & Aspirations (20%)
  let prefAspScore = 0;
  const subjects = profile.preferredSubjects || profile.academicPreferences || [];
  const aspirations = String(profile.aspirations || profile.careerAspirations || '');
  
  if (subjects.length >= 2) prefAspScore += 1;
  else if (subjects.length === 1) prefAspScore += 0.5;
  
  if (aspirations.trim() !== '') prefAspScore += 1;
  
  score += (prefAspScore / 2) * 20;

  return Math.round(score);
}

export function getFirstIncompleteStep(profile: any): number | null {
  if (!profile) return 1;
  
  // Step 1: Basic Info
  const fullName = String(profile.fullName || '');
  const phone = String(profile.phone || '');
  const location = String(profile.location || '');
  const birthDate = String(profile.birthDate || '');
  if (!fullName.trim() || !phone.trim() || !location.trim() || !birthDate.trim()) return 1;
  
  // Step 2: Education & Skills
  if (!profile.grade || (profile.education?.length || 0) === 0 || (profile.skills?.length || 0) === 0) return 2;
  
  // Step 3: Experience & Projects
  if ((!profile.isFresher && (profile.experience?.length || 0) === 0) || (!profile.hasNoProjects && (profile.projects?.length || 0) === 0)) return 3;
  
  // Step 4: Interests & Strengths
  if ((profile.interests?.length || 0) < 2 || (profile.strengths?.length || 0) < 2) return 4;
  
  // Step 5: Preferences & Aspirations
  const aspirations = String(profile.aspirations || profile.careerAspirations || '');
  const subjects = profile.preferredSubjects || profile.academicPreferences;
  if ((subjects?.length || 0) < 2 || !aspirations.trim()) return 5;
  
  return null; // All complete
}

export function isProfileComplete(profile: any): boolean {
  return getFirstIncompleteStep(profile) === null;
}

export function cleanObject(obj: any) {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
}
