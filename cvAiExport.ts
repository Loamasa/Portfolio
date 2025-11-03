/**
 * AI-Friendly CV Export Utility
 * 
 * This utility generates CV data in a format optimized for AI modification.
 * It includes clear guidelines for AI to modify only content while preserving structure.
 */

export interface RoleCategory {
  name: string;
  items: string[];
}

export interface EducationSection {
  name: string;
  items: string[];
}

export interface CvExperience {
  jobTitle: string;
  company: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  overview?: string | null;
  roleCategories?: RoleCategory[];
  description?: string | null;
}

export interface CvEducation {
  school: string;
  degree?: string | null;
  field?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isOngoing: boolean;
  overview?: string | null;
  educationSections?: EducationSection[];
  website?: string | null;
  eqfLevel?: string | null;
  description?: string | null;
}

export interface CvProfile {
  fullName: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  dateOfBirth?: string;
  nationality?: string;
  profilePhoto?: string;
  profileSummary?: string;
  coreStrengths?: string[];
  languages?: Array<{ language: string; proficiency: string }>;
}

export interface CvData {
  profile: CvProfile | null;
  experiences: CvExperience[];
  education: CvEducation[];
  skills: Array<{ skillName: string; category?: string | null; proficiency?: string | null }>;
}

export interface AiFriendlyCvExport {
  metadata: {
    exportedAt: string;
    version: string;
    instructions: string;
  };
  modificationGuidelines: {
    profile: string;
    experiences: string;
    education: string;
    skills: string;
  };
  data: CvData;
}

/**
 * Generate an AI-friendly CV export with clear modification guidelines
 * @param cvData The CV data to export
 * @returns AI-friendly export with guidelines
 */
export function generateAiFriendlyCvExport(cvData: CvData): AiFriendlyCvExport {
  return {
    metadata: {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      instructions:
        "This CV data is formatted for AI modification. Follow the modification guidelines below. " +
        "IMPORTANT: Only modify the content values. Do NOT change the structure, field names, or data types. " +
        "Do NOT add or remove any fields. Do NOT modify the format of dates (YYYY-MM format) or boolean values.",
    },
    modificationGuidelines: {
      profile:
        "Modify only the text content of: fullName, title, email, phone, location, dateOfBirth, nationality, " +
        "profileSummary, coreStrengths (array items), and languages (language names and proficiency levels). " +
        "Keep all field names and structure intact. Do not change profilePhoto URL format.",
      experiences:
        "For each experience, modify only: jobTitle, company, location, overview, and roleCategories items. " +
        "Keep dates in YYYY-MM format unchanged. Keep isCurrent as boolean (true/false). " +
        "For roleCategories, only modify the item text within each category, not the category names or structure.",
      education:
        "For each education entry, modify only: school, degree, field, location, overview, and educationSections items. " +
        "Keep dates in YYYY-MM format unchanged. Keep isOngoing as boolean (true/false). " +
        "For educationSections, only modify the item text within each section, not the section names or structure. " +
        "Keep website URL and eqfLevel format unchanged.",
      skills:
        "For each skill, modify only: skillName, category, and proficiency. " +
        "Keep the array structure and all field names intact.",
    },
    data: cvData,
  };
}

/**
 * Validate AI-modified CV export to ensure structure integrity
 * @param exportData The modified export data
 * @returns Validation result with any errors
 */
export function validateAiModifiedExport(
  exportData: AiFriendlyCvExport
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate metadata
  if (!exportData.metadata || !exportData.metadata.exportedAt) {
    errors.push("Missing or invalid metadata");
  }

  // Validate data structure
  if (!exportData.data) {
    errors.push("Missing data object");
  }

  // Validate profile
  if (exportData.data.profile) {
    if (typeof exportData.data.profile.fullName !== "string") {
      errors.push("Profile fullName must be a string");
    }
    if (
      exportData.data.profile.coreStrengths &&
      !Array.isArray(exportData.data.profile.coreStrengths)
    ) {
      errors.push("Profile coreStrengths must be an array");
    }
  }

  // Validate experiences
  if (!Array.isArray(exportData.data.experiences)) {
    errors.push("Experiences must be an array");
  } else {
    for (let i = 0; i < exportData.data.experiences.length; i++) {
      const exp = exportData.data.experiences[i];
      if (typeof exp.jobTitle !== "string") {
        errors.push(`Experience ${i}: jobTitle must be a string`);
      }
      if (typeof exp.company !== "string") {
        errors.push(`Experience ${i}: company must be a string`);
      }
      if (typeof exp.isCurrent !== "boolean") {
        errors.push(`Experience ${i}: isCurrent must be a boolean`);
      }
      if (exp.startDate && !/^\d{4}-\d{2}$/.test(exp.startDate)) {
        errors.push(`Experience ${i}: startDate must be in YYYY-MM format`);
      }
      if (exp.roleCategories && !Array.isArray(exp.roleCategories)) {
        errors.push(`Experience ${i}: roleCategories must be an array`);
      }
    }
  }

  // Validate education
  if (!Array.isArray(exportData.data.education)) {
    errors.push("Education must be an array");
  } else {
    for (let i = 0; i < exportData.data.education.length; i++) {
      const edu = exportData.data.education[i];
      if (typeof edu.school !== "string") {
        errors.push(`Education ${i}: school must be a string`);
      }
      if (typeof edu.isOngoing !== "boolean") {
        errors.push(`Education ${i}: isOngoing must be a boolean`);
      }
      if (edu.startDate && !/^\d{4}-\d{2}$/.test(edu.startDate)) {
        errors.push(`Education ${i}: startDate must be in YYYY-MM format`);
      }
      if (edu.educationSections && !Array.isArray(edu.educationSections)) {
        errors.push(`Education ${i}: educationSections must be an array`);
      }
    }
  }

  // Validate skills
  if (!Array.isArray(exportData.data.skills)) {
    errors.push("Skills must be an array");
  } else {
    for (let i = 0; i < exportData.data.skills.length; i++) {
      const skill = exportData.data.skills[i];
      if (typeof skill.skillName !== "string") {
        errors.push(`Skill ${i}: skillName must be a string`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

