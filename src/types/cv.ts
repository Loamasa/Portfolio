export interface CvProfile {
  id: string;
  user_id: string;
  full_name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  profile_photo: string | null;
  profile_summary: string | null;
  core_strengths: string[] | null;
  languages: Array<{ language: string; proficiency: string }> | null;
  created_at: string;
  updated_at: string;

  fullName: string;
  dateOfBirth: string | null;
  profilePhoto: string | null;
  profileSummary: string | null;
  coreStrengths: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CvExperience {
  id: string;
  user_id: string;
  job_title: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  overview: string | null;
  role_categories: Array<{ category: string; items: string[] }> | null;
  description: string | null;
  order: number;
  created_at: string;
  updated_at: string;

  jobTitle: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  roleCategories: Array<{ category: string; items: string[] }> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CvEducation {
  id: string;
  user_id: string;
  school: string;
  degree: string | null;
  field: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_ongoing: boolean;
  overview: string | null;
  education_sections: Array<{ title: string; items: string[] }> | null;
  website: string | null;
  eqf_level: string | null;
  description: string | null;
  order: number;
  created_at: string;
  updated_at: string;

  startDate: string;
  endDate: string | null;
  isOngoing: boolean;
  educationSections: Array<{ title: string; items: string[] }> | null;
  eqfLevel: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CvSkill {
  id: string;
  user_id: string;
  skill_name: string;
  category: string | null;
  proficiency: string | null;
  order: number;
  created_at: string;
  updated_at: string;

  skillName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CvTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  selected_experience_ids: string[] | null;
  selected_education_ids: string[] | null;
  selected_skill_ids: string[] | null;
  include_profile: boolean;
  include_languages: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;

  selectedExperienceIds: string[] | null;
  selectedEducationIds: string[] | null;
  selectedSkillIds: string[] | null;
  includeProfile: boolean;
  includeLanguages: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioProject {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  link: string | null;
  order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;

  imageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;

  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSettings {
  id: string;
  user_id: string;
  portfolio_title: string | null;
  portfolio_description: string | null;
  portfolio_image: string | null;
  social_links: Record<string, string> | null;
  created_at: string;
  updated_at: string;

  portfolioTitle: string | null;
  portfolioDescription: string | null;
  portfolioImage: string | null;
  socialLinks: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
}

export type InsertCvProfile = Omit<CvProfile, 'id' | 'created_at' | 'updated_at' | 'createdAt' | 'updatedAt' | 'fullName' | 'dateOfBirth' | 'profilePhoto' | 'profileSummary' | 'coreStrengths'>;
export type InsertCvExperience = Omit<CvExperience, 'id' | 'created_at' | 'updated_at' | 'createdAt' | 'updatedAt' | 'jobTitle' | 'startDate' | 'endDate' | 'isCurrent' | 'roleCategories'>;
export type InsertCvEducation = Omit<CvEducation, 'id' | 'created_at' | 'updated_at' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'isOngoing' | 'educationSections' | 'eqfLevel'>;
export type InsertCvSkill = Omit<CvSkill, 'id' | 'created_at' | 'updated_at' | 'createdAt' | 'updatedAt' | 'skillName'>;
export type InsertCvTemplate = Omit<CvTemplate, 'id' | 'created_at' | 'updated_at' | 'createdAt' | 'updatedAt' | 'selectedExperienceIds' | 'selectedEducationIds' | 'selectedSkillIds' | 'includeProfile' | 'includeLanguages' | 'isDefault'>;
export type InsertPortfolioProject = Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'isPublished'>;
export type InsertBlogPost = Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'isPublished' | 'publishedAt'>;
export type InsertPortfolioSettings = Omit<PortfolioSettings, 'id' | 'created_at' | 'updated_at' | 'createdAt' | 'updatedAt' | 'portfolioTitle' | 'portfolioDescription' | 'portfolioImage' | 'socialLinks'>;
