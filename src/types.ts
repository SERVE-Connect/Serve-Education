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

export interface CourseFolder {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: number;
  createdBy?: string;
}

export interface Course {
  id: string;
  folderId: string;
  title: string;
  fileName: string;
  htmlContent: string;
  filePath?: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  tags: string[];
  createdAt: number;
  createdBy?: string;
}

export interface TestScore {
  testId: string;
  courseId: string;
  courseTitle: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  date: number;
  passed: boolean;
}

export interface PrepItem {
  id: string;
  courseId: string;
  title: string;
  category: string;
  completed: boolean;
  completedAt?: number;
}

export interface CompetitionEntry {
  id: string;
  title: string;
  courseTitle: string;
  rank?: number;
  score: number;
  date: number;
  badge: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  recipientName: string;
  issueDate: number;
  score: number;
  certificateNumber: string;
}

export interface UserLearningData {
  userId: string;
  courseProgress: Record<string, number>; // courseId -> percentage (0 - 100)
  testScores: TestScore[];
  preps: PrepItem[];
  competitions: CompetitionEntry[];
  certificates: Certificate[];
  xp: number;
  badges: string[];
  lastActivityAt: number;
}
