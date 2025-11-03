import { CvEducation, CvExperience, CvSkill, CvTemplateInput } from "@/types/cv";

interface TemplateImportContext {
  experiences: CvExperience[];
  education: CvEducation[];
  skills: CvSkill[];
}

interface TemplateImportOptions {
  fallbackName?: string;
  fallbackDescription?: string | null;
}

export interface TemplateImportResult {
  input: CvTemplateInput;
  warnings: string[];
  meta: {
    hadExperienceSelection: boolean;
    hadEducationSelection: boolean;
    hadSkillSelection: boolean;
    matchedExperienceCount: number;
    matchedEducationCount: number;
    matchedSkillCount: number;
  };
  debug?: {
    unmatchedExperiences: string[];
    unmatchedEducation: string[];
    unmatchedSkills: string[];
  };
}

type UnknownRecord = Record<string, unknown>;

const normalize = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const extractIdCandidates = (value: unknown, fallbackRecords: unknown[]) => {
  const ids = new Set<string>();

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string") {
        ids.add(item);
      } else if (isRecord(item) && typeof item.id === "string") {
        ids.add(item.id);
      }
    }
  }

  if (ids.size === 0) {
    for (const record of fallbackRecords) {
      if (isRecord(record) && typeof record.id === "string") {
        ids.add(record.id);
      }
    }
  }

  return Array.from(ids);
};

type MatchFn<T> = (snapshot: UnknownRecord, item: T) => boolean;
type DescribeFn = (snapshot: UnknownRecord) => string;

type MatchResult = {
  matchedIds: string[];
  unmatched: string[];
};

const matchTemplateItems = <T extends { id: string }>(
  dataset: T[],
  idCandidates: string[],
  snapshots: unknown[],
  matches: MatchFn<T>,
  describe: DescribeFn,
  warnWhenMissing: boolean
): MatchResult => {
  const matched = new Set<string>();
  const unmatched = new Set<string>();

  const findById = (id: string) => dataset.find((item) => item.id === id);

  for (const id of idCandidates) {
    const item = findById(id);
    if (item) {
      matched.add(item.id);
    }
  }

  const snapshotRecords = snapshots.filter(isRecord) as UnknownRecord[];

  for (const snapshot of snapshotRecords) {
    const snapshotId = typeof snapshot.id === "string" ? snapshot.id : undefined;

    if (snapshotId && matched.has(snapshotId)) {
      continue;
    }

    if (snapshotId) {
      const byId = findById(snapshotId);
      if (byId && !matched.has(byId.id)) {
        matched.add(byId.id);
        continue;
      }
    }

    const byMatch = dataset.find(
      (item) => !matched.has(item.id) && matches(snapshot, item)
    );

    if (byMatch) {
      matched.add(byMatch.id);
      continue;
    }

    if (warnWhenMissing && (idCandidates.length === 0 || (snapshotId && idCandidates.includes(snapshotId)))) {
      unmatched.add(describe(snapshot));
    }
  }

  if (warnWhenMissing) {
    for (const id of idCandidates) {
      if (matched.has(id)) {
        continue;
      }

      const snapshot = snapshotRecords.find((record) => record.id === id);
      if (snapshot) {
        unmatched.add(describe(snapshot));
      } else {
        unmatched.add(id);
      }
    }
  }

  return {
    matchedIds: Array.from(matched),
    unmatched: Array.from(unmatched).filter(Boolean),
  };
};

const describeExperience = (snapshot: UnknownRecord) => {
  const title = typeof snapshot.jobTitle === "string"
    ? snapshot.jobTitle
    : typeof snapshot.title === "string"
    ? snapshot.title
    : undefined;
  const company = typeof snapshot.company === "string" ? snapshot.company : undefined;

  if (title && company) {
    return `${title} @ ${company}`;
  }
  if (title) {
    return title;
  }
  if (company) {
    return `Role at ${company}`;
  }
  return "Experience";
};

const describeEducation = (snapshot: UnknownRecord) => {
  const school = typeof snapshot.school === "string" ? snapshot.school : undefined;
  const degree = typeof snapshot.degree === "string" ? snapshot.degree : undefined;
  if (school && degree) {
    return `${degree} — ${school}`;
  }
  if (school) {
    return school;
  }
  return "Education";
};

const describeSkill = (snapshot: UnknownRecord) => {
  const name =
    typeof snapshot.skillName === "string"
      ? snapshot.skillName
      : typeof snapshot.name === "string"
      ? snapshot.name
      : undefined;
  if (!name) {
    return "Skill";
  }
  const category = typeof snapshot.category === "string" ? snapshot.category : undefined;
  return category ? `${name} (${category})` : name;
};

const matchesExperience: MatchFn<CvExperience> = (snapshot, item) => {
  const title = normalize(snapshot.jobTitle ?? snapshot.title);
  const company = normalize(snapshot.company);
  const startDate = normalize(snapshot.startDate);
  const endDate = normalize(snapshot.endDate);

  if (!title || title !== normalize(item.jobTitle)) {
    return false;
  }

  if (company && company !== normalize(item.company)) {
    return false;
  }

  if (startDate && startDate !== normalize(item.startDate)) {
    return false;
  }

  if (endDate && item.endDate && endDate !== normalize(item.endDate)) {
    return false;
  }

  return true;
};

const matchesEducation: MatchFn<CvEducation> = (snapshot, item) => {
  const school = normalize(snapshot.school);
  const degree = normalize(snapshot.degree);
  const field = normalize(snapshot.field);
  const startDate = normalize(snapshot.startDate);

  if (!school || school !== normalize(item.school)) {
    return false;
  }

  if (degree && degree !== normalize(item.degree)) {
    return false;
  }

  if (field && field !== normalize(item.field)) {
    return false;
  }

  if (startDate && startDate !== normalize(item.startDate)) {
    return false;
  }

  return true;
};

const matchesSkill: MatchFn<CvSkill> = (snapshot, item) => {
  const name = normalize(snapshot.skillName ?? snapshot.name);
  const category = normalize(snapshot.category);
  const proficiency = normalize(snapshot.proficiency);

  if (!name || name !== normalize(item.skillName)) {
    return false;
  }

  if (category && category !== normalize(item.category)) {
    return false;
  }

  if (proficiency && proficiency !== normalize(item.proficiency)) {
    return false;
  }

  return true;
};

const summarizeWarnings = (label: string, values: string[]) => {
  if (values.length === 0) {
    return null;
  }

  if (values.length === 1) {
    return `${label} "${values[0]}" could not be matched to your current data.`;
  }

  const preview = values.slice(0, 3).join(", ");
  const suffix = values.length > 3 ? ` and ${values.length - 3} more` : "";
  return `${values.length} ${label}s from the JSON file could not be matched (${preview}${suffix}).`;
};

export const buildTemplateImportResult = (
  rawData: unknown,
  context: TemplateImportContext,
  options: TemplateImportOptions = {}
): TemplateImportResult => {
  const base = isRecord(rawData) ? rawData : {};
  const templateSection = isRecord(base.template) ? base.template : base;

  const experiencesSnapshot = Array.isArray(base.experiences)
    ? (base.experiences.filter(isRecord) as UnknownRecord[])
    : [];
  const educationSnapshot = Array.isArray(base.education)
    ? (base.education.filter(isRecord) as UnknownRecord[])
    : [];
  const skillsSnapshot = Array.isArray(base.skills)
    ? (base.skills.filter(isRecord) as UnknownRecord[])
    : [];

  const nameCandidate =
    typeof templateSection.name === "string" && templateSection.name.trim().length > 0
      ? templateSection.name.trim()
      : options.fallbackName ?? `Imported Template ${new Date().toISOString()}`;

  const descriptionCandidate =
    typeof templateSection.description === "string"
      ? templateSection.description
      : options.fallbackDescription ?? null;

  const includeProfileCandidate =
    typeof templateSection.includeProfile === "boolean"
      ? templateSection.includeProfile
      : true;

  const includeLanguagesCandidate =
    typeof templateSection.includeLanguages === "boolean"
      ? templateSection.includeLanguages
      : true;

  const experienceIds = extractIdCandidates(
    templateSection.selectedExperienceIds,
    experiencesSnapshot
  );
  const educationIds = extractIdCandidates(
    templateSection.selectedEducationIds,
    educationSnapshot
  );
  const skillIds = extractIdCandidates(
    templateSection.selectedSkillIds,
    skillsSnapshot
  );

  const experienceMatches = matchTemplateItems(
    context.experiences,
    experienceIds,
    experiencesSnapshot,
    matchesExperience,
    describeExperience,
    experienceIds.length > 0
  );

  const educationMatches = matchTemplateItems(
    context.education,
    educationIds,
    educationSnapshot,
    matchesEducation,
    describeEducation,
    educationIds.length > 0
  );

  const skillMatches = matchTemplateItems(
    context.skills,
    skillIds,
    skillsSnapshot,
    matchesSkill,
    describeSkill,
    skillIds.length > 0
  );

  const warnings: string[] = [];

  const experienceWarning = summarizeWarnings("experience", experienceMatches.unmatched);
  if (experienceWarning) {
    warnings.push(experienceWarning);
  }

  const educationWarning = summarizeWarnings("education entry", educationMatches.unmatched);
  if (educationWarning) {
    warnings.push(educationWarning);
  }

  const skillWarning = summarizeWarnings("skill", skillMatches.unmatched);
  if (skillWarning) {
    warnings.push(skillWarning);
  }

  return {
    input: {
      name: nameCandidate,
      description: descriptionCandidate,
      includeProfile: includeProfileCandidate,
      includeLanguages: includeLanguagesCandidate,
      selectedExperienceIds: experienceMatches.matchedIds,
      selectedEducationIds: educationMatches.matchedIds,
      selectedSkillIds: skillMatches.matchedIds,
    },
    warnings,
    meta: {
      hadExperienceSelection: experienceIds.length > 0,
      hadEducationSelection: educationIds.length > 0,
      hadSkillSelection: skillIds.length > 0,
      matchedExperienceCount: experienceMatches.matchedIds.length,
      matchedEducationCount: educationMatches.matchedIds.length,
      matchedSkillCount: skillMatches.matchedIds.length,
    },
    debug: {
      unmatchedExperiences: experienceMatches.unmatched,
      unmatchedEducation: educationMatches.unmatched,
      unmatchedSkills: skillMatches.unmatched,
    },
  };
};
