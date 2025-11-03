import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Upload, FileJson } from "lucide-react";
import CVProfileForm from "@/components/cv/CVProfileForm";
import CVExperienceList from "@/components/cv/CVExperienceList";
import CVEducationList from "@/components/cv/CVEducationList";
import CVSkillsList from "@/components/cv/CVSkillsList";
import CVTemplatesList from "@/components/cv/CVTemplatesList";
import CVPreview from "@/components/cv/CVPreview";
import { EmailVerificationBanner } from "@/components/auth/EmailVerificationBanner";
import CVExperienceForm from "@/components/cv/CVExperienceForm";
import CVEducationForm from "@/components/cv/CVEducationForm";
import CVSkillForm from "@/components/cv/CVSkillForm";
import CVTemplateForm from "@/components/cv/CVTemplateForm";
import {
  useCreateCvTemplate,
  useCvEducation,
  useCvExperiences,
  useCvProfile,
  useCvSkills,
} from "@/hooks/cv";
import { buildTemplateImportResult } from "@/lib/cv-template-import";
import { toast } from "sonner";

export default function CVManagerExpanded() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [isExportingJson, setIsExportingJson] = useState(false);
  const templateImportInputRef = useRef<HTMLInputElement | null>(null);

  const profileQuery = useCvProfile();
  const experiencesQuery = useCvExperiences();
  const educationQuery = useCvEducation();
  const skillsQuery = useCvSkills();
  const createTemplateMutation = useCreateCvTemplate();

  const profile = profileQuery.data ?? null;
  const experiences = experiencesQuery.data ?? [];
  const education = educationQuery.data ?? [];
  const skills = skillsQuery.data ?? [];

  const isLoading = useMemo(
    () =>
      profileQuery.isLoading ||
      experiencesQuery.isLoading ||
      educationQuery.isLoading ||
      skillsQuery.isLoading,
    [
      profileQuery.isLoading,
      experiencesQuery.isLoading,
      educationQuery.isLoading,
      skillsQuery.isLoading,
    ]
  );

  const handleExportJson = async () => {
    if (isLoading) {
      toast.error("Data is still loading. Please try again in a moment.");
      return;
    }

    try {
      setIsExportingJson(true);

      const technicalGuide = `
CV DATA EXPORT - Technical Guide
=================================

This JSON file contains your complete CV data and can be used to:
- Backup your CV information
- Import into CV templates
- Share with AI assistants for optimization
- Transfer data between accounts
- Programmatically create or update CV entries via Supabase

STRUCTURE:
----------
- profile: Personal information (single object, can be null)
- experiences: Work history (array of experience objects)
- education: Academic background (array of education objects)
- skills: Skill set (array of skill objects)

USAGE WITH SUPABASE:
--------------------

1. CREATE NEW PROFILE (if profile is null in your account):
   - Use profile object fields to insert into 'cv_profiles' table
   - Required fields: fullName
   - Optional fields: title, email, phone, location, dateOfBirth, nationality, profilePhoto, profileSummary, coreStrengths (array), languages (array of {language, proficiency})
   - Example: await supabase.from('cv_profiles').insert({ fullName: profile.fullName, title: profile.title, ... })

2. UPDATE EXISTING PROFILE:
   - Use profile object fields to update 'cv_profiles' table
   - Example: await supabase.from('cv_profiles').update({ fullName: profile.fullName, ... }).eq('user_id', userId)

3. CREATE NEW EXPERIENCES:
   - Iterate through experiences array and insert into 'cv_experiences' table
   - Required fields: jobTitle, company, startDate
   - Optional fields: location, endDate, isCurrent (boolean), overview, roleCategories (array of {category, items[]}), description, order
   - Example: for (const exp of experiences) { await supabase.from('cv_experiences').insert({ job_title: exp.jobTitle, company: exp.company, ... }) }

4. UPDATE EXISTING EXPERIENCES:
   - Match experiences by jobTitle + company + startDate to find existing records
   - Example: await supabase.from('cv_experiences').update({ job_title: exp.jobTitle, ... }).eq('id', existingId)

5. CREATE NEW EDUCATION:
   - Iterate through education array and insert into 'cv_education' table
   - Required fields: school, startDate
   - Optional fields: degree, field, location, endDate, isOngoing (boolean), overview, educationSections (array of {title, items[]}), website, eqfLevel, description, order
   - Example: for (const edu of education) { await supabase.from('cv_education').insert({ school: edu.school, degree: edu.degree, ... }) }

6. UPDATE EXISTING EDUCATION:
   - Match education by school + degree + startDate to find existing records
   - Example: await supabase.from('cv_education').update({ school: edu.school, ... }).eq('id', existingId)

7. CREATE NEW SKILLS:
   - Iterate through skills array and insert into 'cv_skills' table
   - Required fields: skillName
   - Optional fields: category, proficiency, order
   - Example: for (const skill of skills) { await supabase.from('cv_skills').insert({ skill_name: skill.skillName, category: skill.category, ... }) }

8. UPDATE EXISTING SKILLS:
   - Match skills by skillName to find existing records
   - Example: await supabase.from('cv_skills').update({ skill_name: skill.skillName, ... }).eq('id', existingId)

IMPORTANT NOTES:
----------------
- All IDs in this export are UUIDs from your Supabase database
- When creating new entries, do NOT include the 'id', 'userId', 'createdAt', or 'updatedAt' fields (Supabase auto-generates these)
- Field names use camelCase in JSON but snake_case in Supabase (e.g., jobTitle → job_title, skillName → skill_name)
- Boolean fields: isCurrent, isOngoing (use true/false in Supabase)
- Array fields (roleCategories, educationSections, coreStrengths, languages) are stored as JSONB in Supabase
- For template imports, use the built-in "Import Template" feature in the Templates tab for automatic matching

SUPABASE TABLE NAMES:
----------------------
- cv_profiles
- cv_experiences
- cv_education
- cv_skills
- cv_templates

For more details, see the database schema in supabase/migrations/
`;

      const payload = {
        _technicalGuide: technicalGuide,
        exportDate: new Date().toISOString(),
        profile,
        experiences,
        education,
        skills,
      };
      const jsonString = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cv-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CV exported successfully");
    } catch (error) {
      console.error("Failed to export CV:", error);
      toast.error("Failed to export CV");
    } finally {
      setIsExportingJson(false);
    }
  };


  const handleImportJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      console.log("Imported data:", data);
      toast.success("Import file loaded. Apply logic to persist data.");
    } catch (error) {
      console.error("Failed to import CV:", error);
      toast.error("Failed to import CV data");
    }
  };

  const handleImportTemplateFile = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const { input, warnings, debug } = buildTemplateImportResult(
        data,
        { experiences, education, skills }
      );

      const created = await createTemplateMutation.mutateAsync({
        name: input.name,
        description: input.description ?? null,
        includeProfile: input.includeProfile ?? true,
        includeLanguages: input.includeLanguages ?? true,
        selectedExperienceIds: input.selectedExperienceIds ?? [],
        selectedEducationIds: input.selectedEducationIds ?? [],
        selectedSkillIds: input.selectedSkillIds ?? [],
      });

      toast.success(`Template "${created.name}" imported successfully`);

      if (warnings.length > 0) {
        warnings.forEach((message) => toast.warning(message));
        console.warn("Template import warnings", {
          templateId: created.id,
          debug,
        });
      }
    } catch (error) {
      console.error("Failed to import template JSON", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to import template JSON"
      );
    }
  };

  const previewData = useMemo(() => {
    if (!profile && experiences.length === 0 && education.length === 0 && skills.length === 0) {
      return null;
    }

    return {
      profile: profile
        ? {
            fullName: profile.fullName,
            title: profile.title,
            email: profile.email,
            phone: profile.phone,
            location: profile.location,
            profileSummary: profile.profileSummary,
            coreStrengths: profile.coreStrengths,
            languages: profile.languages,
          }
        : null,
      experiences: experiences.map((exp) => ({
        jobTitle: exp.jobTitle,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: exp.isCurrent,
        overview: exp.overview,
        roleCategories: exp.roleCategories
          ? exp.roleCategories.map((category) => ({
              name: category.category,
              items: category.items,
            }))
          : undefined,
        description: exp.description,
      })),
      education: education.map((edu) => ({
        school: edu.school,
        degree: edu.degree,
        field: edu.field,
        location: edu.location,
        startDate: edu.startDate,
        endDate: edu.endDate,
        isOngoing: edu.isOngoing,
        overview: edu.overview,
        educationSections: edu.educationSections
          ? edu.educationSections.map((section) => ({
              name: section.title,
              items: section.items,
            }))
          : undefined,
        website: edu.website,
        eqfLevel: edu.eqfLevel,
        description: edu.description,
      })),
      skills: skills.map((skill) => ({
        skillName: skill.skillName,
        category: skill.category,
        proficiency: skill.proficiency,
      })),
    };
  }, [profile, experiences, education, skills]);

  return (
    <div className="min-h-screen bg-background">
      <EmailVerificationBanner />
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">CV Manager</h1>
            <p className="text-muted-foreground">
              Manage your CV data and create targeted CVs for different opportunities
            </p>
          </div>

          {/* Export/Import Actions */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              onClick={handleExportJson}
              variant="outline"
              disabled={isExportingJson || isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              {isExportingJson ? "Exporting..." : "Export JSON"}
            </Button>
            <label>
              <Button variant="outline" asChild disabled={isLoading}>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import from JSON
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your basic profile information and professional summary
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profileQuery.isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading profile...</p>
                  ) : (
                    <CVProfileForm profile={profile} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Work Experience</h2>
                  <p className="text-muted-foreground">
                    Add your work experiences with detailed role categories
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddExperience((prev) => !prev)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {showAddExperience ? "Hide Form" : "Add Experience"}
                </Button>
              </div>

              {showAddExperience && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle>New Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CVExperienceForm
                      onSuccess={() => setShowAddExperience(false)}
                      onCancel={() => setShowAddExperience(false)}
                    />
                  </CardContent>
                </Card>
              )}

              {experiencesQuery.isLoading ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Loading experiences...</p>
                  </CardContent>
                </Card>
              ) : (
                <CVExperienceList experiences={experiences} />
              )}
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Education</h2>
                  <p className="text-muted-foreground">
                    Add your education with structured sections
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddEducation((prev) => !prev)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {showAddEducation ? "Hide Form" : "Add Education"}
                </Button>
              </div>

              {showAddEducation && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle>New Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CVEducationForm
                      onSuccess={() => setShowAddEducation(false)}
                      onCancel={() => setShowAddEducation(false)}
                    />
                  </CardContent>
                </Card>
              )}

              {educationQuery.isLoading ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Loading education...</p>
                  </CardContent>
                </Card>
              ) : (
                <CVEducationList education={education} />
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Skills</h2>
                  <p className="text-muted-foreground">
                    Manage your skills and competencies
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddSkill((prev) => !prev)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {showAddSkill ? "Hide Form" : "Add Skill"}
                </Button>
              </div>

              {showAddSkill && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle>New Skill</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CVSkillForm
                      onSuccess={() => setShowAddSkill(false)}
                      onCancel={() => setShowAddSkill(false)}
                    />
                  </CardContent>
                </Card>
              )}

              {skillsQuery.isLoading ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Loading skills...</p>
                  </CardContent>
                </Card>
              ) : (
                <CVSkillsList skills={skills} />
              )}
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">CV Templates</h2>
                  <p className="text-muted-foreground">
                    Create tailored configurations and export them as JSON for specific opportunities
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={templateImportInputRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        await handleImportTemplateFile(file);
                        event.target.value = "";
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => templateImportInputRef.current?.click()}
                    disabled={createTemplateMutation.isPending}
                  >
                    <Upload className="w-4 h-4" />
                    Import Template
                  </Button>
                  <Button
                    onClick={() => setShowCreateTemplate((prev) => !prev)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {showCreateTemplate ? "Hide Form" : "Create Template"}
                  </Button>
                </div>
              </div>

              {showCreateTemplate && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle>New CV Template</CardTitle>
                    <CardDescription>
                      Choose which sections and entries should appear in this configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CVTemplateForm
                      onSuccess={() => setShowCreateTemplate(false)}
                      onCancel={() => setShowCreateTemplate(false)}
                    />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Saved Templates</CardTitle>
                  <CardDescription>
                    Import and export JSON snapshots tied to each template or remove templates you no longer need
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CVTemplatesList
                    profile={profile}
                    experiences={experiences}
                    education={education}
                    skills={skills}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Preview Section */}
          <div className="mt-8">
            {previewData && (
              <CVPreview cvData={previewData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
