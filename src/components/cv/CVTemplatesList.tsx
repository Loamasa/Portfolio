import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Trash2, Upload, Edit, FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  useCvTemplates,
  useDeleteCvTemplate,
  useUpdateCvTemplate,
} from "@/hooks/cv";
import { buildTemplateImportResult } from "@/lib/cv-template-import";
import {
  CvEducation,
  CvExperience,
  CvProfile,
  CvSkill,
  CvTemplate,
} from "@/types/cv";
import { generateCVPDF } from "@/lib/pdfGenerator";
import CVTemplateForm from "./CVTemplateForm";

interface CVTemplatesListProps {
  profile: CvProfile | null;
  experiences: CvExperience[];
  education: CvEducation[];
  skills: CvSkill[];
}

export default function CVTemplatesList({
  profile,
  experiences,
  education,
  skills,
}: CVTemplatesListProps) {
  const { data: templates, isLoading } = useCvTemplates();
  const deleteTemplate = useDeleteCvTemplate();
  const updateTemplate = useUpdateCvTemplate();
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const [editingTemplate, setEditingTemplate] = useState<CvTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<CvTemplate | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete template "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteTemplate.mutateAsync(id);
      toast.success("Template deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete template");
    }
  };

  const handleExportTemplate = (template: CvTemplate) => {
    try {
      const selectedExperienceIds = Array.isArray(
        template.selectedExperienceIds
      )
        ? template.selectedExperienceIds
        : [];
      const selectedEducationIds = Array.isArray(
        template.selectedEducationIds
      )
        ? template.selectedEducationIds
        : [];
      const selectedSkillIds = Array.isArray(template.selectedSkillIds)
        ? template.selectedSkillIds
        : [];

      const payload = {
        template: {
          id: template.id,
          name: template.name,
          description: template.description,
          includeProfile: template.includeProfile,
          includeLanguages: template.includeLanguages,
          selectedExperienceIds,
          selectedEducationIds,
          selectedSkillIds,
        },
        profile: template.includeProfile ? profile : null,
        experiences: experiences.filter((experience) =>
          selectedExperienceIds.includes(experience.id)
        ),
        education: education.filter((item) =>
          selectedEducationIds.includes(item.id)
        ),
        skills: skills.filter((skill) => selectedSkillIds.includes(skill.id)),
        exportedAt: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${template.name.replace(/\s+/g, "-").toLowerCase()}-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Template exported");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export template");
    }
  };

  const handleImportTemplate = async (template: CvTemplate, file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const { input, warnings, debug, meta } = buildTemplateImportResult(
        data,
        { experiences, education, skills },
        {
          fallbackName: template.name,
          fallbackDescription: template.description ?? null,
        }
      );

      const nextExperienceIds =
        meta.hadExperienceSelection || meta.matchedExperienceCount > 0
          ? input.selectedExperienceIds ?? []
          : Array.isArray(template.selectedExperienceIds)
          ? template.selectedExperienceIds
          : [];

      const nextEducationIds =
        meta.hadEducationSelection || meta.matchedEducationCount > 0
          ? input.selectedEducationIds ?? []
          : Array.isArray(template.selectedEducationIds)
          ? template.selectedEducationIds
          : [];

      const nextSkillIds =
        meta.hadSkillSelection || meta.matchedSkillCount > 0
          ? input.selectedSkillIds ?? []
          : Array.isArray(template.selectedSkillIds)
          ? template.selectedSkillIds
          : [];

      await updateTemplate.mutateAsync({
        id: template.id,
        input: {
          name: input.name,
          description: input.description ?? template.description,
          includeProfile: input.includeProfile ?? template.includeProfile,
          includeLanguages:
            input.includeLanguages ?? template.includeLanguages,
          selectedExperienceIds: nextExperienceIds,
          selectedEducationIds: nextEducationIds,
          selectedSkillIds: nextSkillIds,
        },
      });

      toast.success(`Template "${input.name}" updated`);

      if (warnings.length > 0) {
        warnings.forEach((message) => toast.warning(message));
        console.warn("Template import warnings", {
          templateId: template.id,
          debug,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to import template"
      );
    }
  };

  const getTemplateData = (template: CvTemplate) => {
    const selectedExperienceIds = Array.isArray(template.selectedExperienceIds)
      ? template.selectedExperienceIds
      : [];
    const selectedEducationIds = Array.isArray(template.selectedEducationIds)
      ? template.selectedEducationIds
      : [];
    const selectedSkillIds = Array.isArray(template.selectedSkillIds)
      ? template.selectedSkillIds
      : [];

    const filteredExperiences = experiences.filter((exp) =>
      selectedExperienceIds.includes(exp.id)
    );

    const filteredEducation = education.filter((edu) =>
      selectedEducationIds.includes(edu.id)
    );

    return {
      profile: template.includeProfile ? profile : null,
      experiences: filteredExperiences.map((exp) => ({
        ...exp,
        isCurrent: exp.isCurrent ? 1 : 0,
        roleCategories: exp.roleCategories
          ? exp.roleCategories.map((cat) => ({
              name: cat.category,
              items: cat.items,
            }))
          : null,
      })),
      education: filteredEducation.map((edu) => ({
        ...edu,
        isOngoing: edu.isOngoing ? 1 : 0,
        educationSections: edu.educationSections
          ? edu.educationSections.map((sec) => ({
              name: sec.title,
              items: sec.items,
            }))
          : null,
      })),
      skills: skills.filter((skill) => selectedSkillIds.includes(skill.id)),
    };
  };

  const handleDownloadPDF = async (template: CvTemplate) => {
    try {
      const cvData = getTemplateData(template);
      const fileName = `${template.name.replace(/\s+/g, "-").toLowerCase()}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      await generateCVPDF(cvData, fileName);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    }
  };

  const handlePreviewPDF = (template: CvTemplate) => {
    setPreviewTemplate(template);
  };

  if (editingTemplate) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Template: {editingTemplate.name}</h3>
          <Button variant="outline" onClick={() => setEditingTemplate(null)}>
            Back to List
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <CVTemplateForm
              template={editingTemplate}
              onSuccess={() => {
                setEditingTemplate(null);
                toast.success("Template updated successfully");
              }}
              onCancel={() => setEditingTemplate(null)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (previewTemplate) {
    const cvData = getTemplateData(previewTemplate);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Preview: {previewTemplate.name}</h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleDownloadPDF(previewTemplate)}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
              Back to List
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="prose max-w-none bg-white border rounded p-6">
              {cvData.profile && (
                <div className="mb-6">
                  <h1 className="text-2xl font-bold">{cvData.profile.fullName}</h1>
                  {cvData.profile.title && (
                    <p className="text-lg text-slate-600">{cvData.profile.title}</p>
                  )}
                  <div className="text-sm text-slate-600 mt-2 space-y-1">
                    {cvData.profile.email && <p>Email: {cvData.profile.email}</p>}
                    {cvData.profile.phone && <p>Phone: {cvData.profile.phone}</p>}
                    {cvData.profile.location && <p>Location: {cvData.profile.location}</p>}
                  </div>
                  {cvData.profile.profileSummary && (
                    <p className="mt-4 text-sm">{cvData.profile.profileSummary}</p>
                  )}
                </div>
              )}

              {cvData.experiences.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 border-b pb-2">Experience</h2>
                  {cvData.experiences.map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <h3 className="font-semibold">{exp.jobTitle}</h3>
                      <p className="text-sm text-slate-600">
                        {exp.company} • {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                      {exp.overview && <p className="text-sm mt-2">{exp.overview}</p>}
                    </div>
                  ))}
                </div>
              )}

              {cvData.education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 border-b pb-2">Education</h2>
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="mb-4">
                      <h3 className="font-semibold">{edu.school}</h3>
                      <p className="text-sm text-slate-600">
                        {edu.degree} {edu.field && `in ${edu.field}`} • {edu.startDate} - {edu.endDate || "Present"}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {cvData.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 border-b pb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-slate-100 text-sm rounded"
                      >
                        {skill.skillName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Loading templates...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground">
            No templates created yet. Create one to save your CV configuration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {templates.map((template) => (
        <Card key={template.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">
                  {template.name}
                </CardTitle>
                <CardDescription>
                  Updated {new Date(template.updatedAt).toLocaleDateString()}
                </CardDescription>
                {template.isDefault && (
                  <Badge className="mt-2">Default</Badge>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingTemplate(template)}
                  title="Edit template"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePreviewPDF(template)}
                  title="Preview CV"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownloadPDF(template)}
                  title="Download PDF"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleExportTemplate(template)}
                  title="Export template JSON"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputs.current[template.id]?.click()}
                  title="Import JSON into template"
                  disabled={updateTemplate.isPending}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <input
                  ref={(element) => {
                    fileInputs.current[template.id] = element;
                  }}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      await handleImportTemplate(template, file);
                      event.target.value = "";
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(template.id, template.name)}
                  disabled={deleteTemplate.isPending}
                  title="Delete template"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            {template.description && (
              <p className="text-sm text-slate-600">{template.description}</p>
            )}
            <div className="grid grid-cols-3 gap-2 text-sm text-slate-600">
              <div>
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                  Experiences
                </span>
                <span className="font-medium">
                  {Array.isArray(template.selectedExperienceIds)
                    ? template.selectedExperienceIds.length
                    : 0}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                  Education
                </span>
                <span className="font-medium">
                  {Array.isArray(template.selectedEducationIds)
                    ? template.selectedEducationIds.length
                    : 0}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                  Skills
                </span>
                <span className="font-medium">
                  {Array.isArray(template.selectedSkillIds)
                    ? template.selectedSkillIds.length
                    : 0}
                </span>
              </div>
            </div>
            <div className="rounded-md border border-dashed border-slate-200 p-3 text-xs text-slate-500">
              <p>
                Includes profile: <strong>{template.includeProfile ? "Yes" : "No"}</strong>
              </p>
              <p>
                Includes languages: <strong>{template.includeLanguages ? "Yes" : "No"}</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
