import { useMemo, useState } from "react";
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
  useCvEducation,
  useCvExperiences,
  useCvProfile,
  useCvSkills,
} from "@/hooks/cv";
import { toast } from "sonner";

export default function CVManagerExpanded() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [isExportingAiJson, setIsExportingAiJson] = useState(false);

  const profileQuery = useCvProfile();
  const experiencesQuery = useCvExperiences();
  const educationQuery = useCvEducation();
  const skillsQuery = useCvSkills();

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
      const payload = {
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

  const handleExportJsonForAi = async () => {
    if (isLoading) {
      toast.error("Data is still loading. Please try again in a moment.");
      return;
    }

    try {
      setIsExportingAiJson(true);
      const payload = {
        summary: profile?.profileSummary ?? "",
        coreStrengths: profile?.coreStrengths ?? [],
        languages: profile?.languages ?? [],
        experiences: experiences.map((exp) => ({
          jobTitle: exp.jobTitle,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.isCurrent ? "Present" : exp.endDate,
          description: exp.description,
          overview: exp.overview,
        })),
        education: education.map((edu) => ({
          school: edu.school,
          degree: edu.degree,
          field: edu.field,
          startDate: edu.startDate,
          endDate: edu.isOngoing ? "Ongoing" : edu.endDate,
          description: edu.description,
        })),
        skills: skills.map((skill) => ({
          name: skill.skillName,
          category: skill.category,
          proficiency: skill.proficiency,
        })),
      };

      const jsonString = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cv-ai-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("AI-friendly export generated");
    } catch (error) {
      console.error("Failed to export CV for AI:", error);
      toast.error("Failed to export AI JSON");
    } finally {
      setIsExportingAiJson(false);
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
              {isExportingJson ? "Exporting..." : "Export CV as JSON"}
            </Button>
            <Button
              onClick={handleExportJsonForAi}
              variant="outline"
              disabled={isExportingAiJson || isLoading}
            >
              <FileJson className="w-4 h-4 mr-2" />
              {isExportingAiJson ? "Preparing..." : "Export for AI"}
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
                <Button
                  onClick={() => setShowCreateTemplate((prev) => !prev)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {showCreateTemplate ? "Hide Form" : "Create Template"}
                </Button>
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
                    <CVTemplateForm onSuccess={() => setShowCreateTemplate(false)} onCancel={() => setShowCreateTemplate(false)} />
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
