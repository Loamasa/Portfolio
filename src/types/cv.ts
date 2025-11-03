export interface CvProfile {
  id: string;
  userId: string;
  fullName: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  profilePhoto: string | null;
  profileSummary: string | null;
  coreStrengths: string[] | null;
  languages: Array<{ language: string; proficiency: string }> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CvProfileInput {
  fullName: string;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  profilePhoto?: string | null;
  profileSummary?: string | null;
  coreStrengths?: string[] | null;
  languages?: Array<{ language: string; proficiency: string }> | null;
}

export interface CvExperience {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  overview: string | null;
  roleCategories: Array<{ category: string; items: string[] }> | null;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CvExperienceInput {
  jobTitle: string;
  company: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  overview?: string | null;
  roleCategories?: Array<{ category: string; items: string[] }> | null;
  description?: string | null;
  order?: number;
}

export interface CvExperienceUpdateInput extends Partial<CvExperienceInput> {
  id: string;
}

export interface CvEducation {
  id: string;
  userId: string;
  school: string;
  degree: string | null;
  field: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isOngoing: boolean;
  overview: string | null;
  educationSections: Array<{ title: string; items: string[] }> | null;
  website: string | null;
  eqfLevel: string | null;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CvEducationInput {
  school: string;
  degree?: string | null;
  field?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isOngoing?: boolean;
  overview?: string | null;
  educationSections?: Array<{ title: string; items: string[] }> | null;
  website?: string | null;
  eqfLevel?: string | null;
  description?: string | null;
  order?: number;
}

export interface CvEducationUpdateInput extends Partial<CvEducationInput> {
  id: string;
}

export interface CvSkill {
  id: string;
  userId: string;
  skillName: string;
  category: string | null;
  proficiency: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CvSkillInput {
  skillName: string;
  category?: string | null;
  proficiency?: string | null;
  order?: number;
}

export interface CvSkillUpdateInput extends Partial<CvSkillInput> {
  id: string;
}

export interface CvTemplate {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  selectedExperienceIds: string[] | null;
  selectedEducationIds: string[] | null;
  selectedSkillIds: string[] | null;
  includeProfile: boolean;
  includeLanguages: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CvTemplateInput {
  name: string;
  description?: string | null;
  selectedExperienceIds?: string[] | null;
  selectedEducationIds?: string[] | null;
  selectedSkillIds?: string[] | null;
  includeProfile?: boolean;
  includeLanguages?: boolean;
  isDefault?: boolean;
}

export interface PortfolioProject {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  tags: string[] | null;
  link: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioProjectInput {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  tags?: string[] | null;
  link?: string | null;
  order?: number;
  isPublished?: boolean;
}

export interface BlogPost {
  id: string;
  userId: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  imageUrl: string | null;
  tags: string[] | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostInput {
  title: string;
  slug: string;
  content?: string | null;
  excerpt?: string | null;
  imageUrl?: string | null;
  tags?: string[] | null;
  isPublished?: boolean;
  publishedAt?: string | null;
}

export interface PortfolioSettings {
  id: string;
  userId: string;
  portfolioTitle: string | null;
  portfolioDescription: string | null;
  portfolioImage: string | null;
  socialLinks: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSettingsInput {
  portfolioTitle?: string | null;
  portfolioDescription?: string | null;
  portfolioImage?: string | null;
  socialLinks?: Record<string, string> | null;
}
