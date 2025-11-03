import { useState } from "react";
import { trpc } from "@/lib/trpc";
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

export default function CVManagerExpanded() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);

  const profileQuery = trpc.cv.getProfile.useQuery();
  const experiencesQuery = trpc.cv.getExperiences.useQuery();
  const educationQuery = trpc.cv.getEducation.useQuery();
  const skillsQuery = trpc.cv.getSkills.useQuery();

  const exportJsonQuery = trpc.cv.exportJson.useQuery({});
  const exportJsonForAiQuery = trpc.cv.exportJsonForAi.useQuery({});

  const handleExportJson = async () => {
    try {
      if (exportJsonQuery.data) {
        const jsonString = JSON.stringify(exportJsonQuery.data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cv-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to export CV:", error);
    }
  };

  const handleExportJsonForAi = async () => {
    try {
      if (exportJsonForAiQuery.data) {
        const jsonString = JSON.stringify(exportJsonForAiQuery.data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cv-ai-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to export CV for AI:", error);
    }
  };

  const handleImportJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      // TODO: Implement import mutation
      console.log("Imported data:", data);
    } catch (error) {
      console.error("Failed to import CV:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
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
            disabled={exportJsonQuery.isLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CV as JSON
          </Button>
          <Button
            onClick={handleExportJsonForAi}
            variant="outline"
            disabled={exportJsonForAiQuery.isLoading}
          >
            <FileJson className="w-4 h-4 mr-2" />
            Export for AI
          </Button>
          <label>
            <Button variant="outline" asChild>
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
                {profileQuery.data && (
                  <CVProfileForm profile={profileQuery.data} />
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
                onClick={() => setShowAddExperience(!showAddExperience)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </Button>
            </div>

            {showAddExperience && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle>New Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* TODO: Add experience form component */}
                  <p className="text-muted-foreground">Experience form coming soon</p>
                </CardContent>
              </Card>
            )}

            {experiencesQuery.data && (
              <CVExperienceList experiences={experiencesQuery.data} />
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
                onClick={() => setShowAddEducation(!showAddEducation)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </Button>
            </div>

            {showAddEducation && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle>New Education</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* TODO: Add education form component */}
                  <p className="text-muted-foreground">Education form coming soon</p>
                </CardContent>
              </Card>
            )}

            {educationQuery.data && (
              <CVEducationList education={educationQuery.data} />
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
                onClick={() => setShowAddSkill(!showAddSkill)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </Button>
            </div>

            {showAddSkill && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle>New Skill</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* TODO: Add skill form component */}
                  <p className="text-muted-foreground">Skill form coming soon</p>
                </CardContent>
              </Card>
            )}

            {skillsQuery.data && (
              <CVSkillsList skills={skillsQuery.data} />
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CV Templates</CardTitle>
                <CardDescription>
                  Create and manage targeted CV templates for different opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* TODO: Add templates management component */}
                <p className="text-muted-foreground">Templates management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Preview Section */}
        <div className="mt-8">
          {profileQuery.data && experiencesQuery.data && educationQuery.data && skillsQuery.data && (
            <CVPreview
              cvData={{
                profile: profileQuery.data ? {
                  fullName: profileQuery.data.fullName,
                  title: profileQuery.data.title ?? undefined,
                  email: profileQuery.data.email ?? undefined,
                  phone: profileQuery.data.phone ?? undefined,
                  location: profileQuery.data.location ?? undefined,
                  profileSummary: profileQuery.data.profileSummary ?? undefined,
                  coreStrengths: profileQuery.data.coreStrengths ? (typeof profileQuery.data.coreStrengths === 'string' ? JSON.parse(profileQuery.data.coreStrengths) : profileQuery.data.coreStrengths) : undefined,
                  languages: profileQuery.data.languages ? (typeof profileQuery.data.languages === 'string' ? JSON.parse(profileQuery.data.languages) : profileQuery.data.languages) : undefined,
                } : null,
                experiences: experiencesQuery.data.map(e => ({
                  jobTitle: e.jobTitle,
                  company: e.company,
                  location: e.location ?? undefined,
                  startDate: e.startDate,
                  endDate: e.endDate ?? undefined,
                  isCurrent: e.isCurrent === 1,
                  overview: e.overview ?? undefined,
                  roleCategories: e.roleCategories ? (typeof e.roleCategories === 'string' ? JSON.parse(e.roleCategories) : e.roleCategories) : undefined,
                  description: e.description ?? undefined,
                })),
                education: educationQuery.data.map(e => ({
                  school: e.school,
                  degree: e.degree ?? undefined,
                  field: e.field ?? undefined,
                  location: e.location ?? undefined,
                  startDate: e.startDate,
                  endDate: e.endDate ?? undefined,
                  isOngoing: e.isOngoing === 1,
                  overview: e.overview ?? undefined,
                  educationSections: e.educationSections ? (typeof e.educationSections === 'string' ? JSON.parse(e.educationSections) : e.educationSections) : undefined,
                  website: e.website ?? undefined,
                  eqfLevel: e.eqfLevel ?? undefined,
                  description: e.description ?? undefined,
                })),
                skills: skillsQuery.data.map(s => ({
                  skillName: s.skillName,
                  category: s.category ?? undefined,
                  proficiency: s.proficiency ?? undefined,
                })),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

