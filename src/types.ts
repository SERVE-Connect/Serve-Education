export interface StudentProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  birthDate: string;
  summary: string;
  grade: string;
  interests: string[];
  strengths: string[];
  aspirations: string;
  preferredSubjects: string[];
  isFresher: boolean;
  hasNoProjects: boolean;
  experience: { company: string; role: string; duration: string; description: string }[];
  education: { school: string; degree: string; year: string }[];
  skills: string[];
  projects: { name: string; description: string; link: string }[];
  academicPreferences?: string[]; // For backward compatibility if needed
  careerAspirations?: string; // For backward compatibility if needed
  lastGuidanceResult?: GuidanceResult;
  updatedAt?: number;
  lastReportAt?: number;
}

export interface CareerSlide {
  title: string;
  content: string;
  type: 'overview' | 'roadmap' | 'market' | 'future' | 'skills';
  data?: any; // For charts
}

export interface GuidanceResult {
  recommendedCareer: string;
  recommendedStream: string;
  slides: CareerSlide[];
  relatedCareers: string[];
  eligibilityScore: number;
  eligibilityCriteria: {
    label: string;
    score: number;
    feedback: string;
  }[];
  improvementAreas: {
    skill: string;
    description: string;
    impact: string;
  }[];
  suggestedCourses: {
    title: string;
    platform: 'Coursera' | 'Udemy' | 'LinkedIn Learning' | 'Google' | 'edX';
    link: string;
    duration: string;
  }[];
  scholarships: {
    name: string;
    provider: string;
    amount: string;
    eligibility: string;
    link: string;
  }[];
  sponsorships: {
    name: string;
    company: string;
    description: string;
    link: string;
  }[];
  internships: {
    title: string;
    company: string;
    duration: string;
    type: 'Remote' | 'On-site' | 'Hybrid';
    stipend: string;
    link: string;
  }[];
}
