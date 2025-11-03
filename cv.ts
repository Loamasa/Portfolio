export interface CvProfile {
  id: number;
  userId: number;
  fullName: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  profilePhoto: string | null;
  profileSummary: string | null;
  coreStrengths: string | null;
  languages: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvExperience {
  id: number;
  userId: number;
  jobTitle: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: number;
  overview: string | null;
  roleCategories: string | null;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvEducation {
  id: number;
  userId: number;
  school: string;
  degree: string | null;
  field: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isOngoing: number;
  overview: string | null;
  educationSections: string | null;
  website: string | null;
  eqfLevel: string | null;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvSkill {
  id: number;
  userId: number;
  skillName: string;
  category: string | null;
  proficiency: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CvTemplate {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  selectedExperienceIds: string | null;
  selectedEducationIds: string | null;
  selectedSkillIds: string | null;
  includeProfile: number;
  includeLanguages: number;
  isDefault: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioProject {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  tags: string | null;
  link: string | null;
  order: number;
  isPublished: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: number;
  userId: number;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  imageUrl: string | null;
  tags: string | null;
  isPublished: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioSettings {
  id: number;
  userId: number;
  portfolioTitle: string | null;
  portfolioDescription: string | null;
  portfolioImage: string | null;
  socialLinks: string | null;
  createdAt: Date;
  updatedAt: Date;
}

