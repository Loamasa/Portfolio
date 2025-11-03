import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  useCvTemplates,
  useDeleteCvTemplate,
  useUpdateCvTemplate,
} from "@/hooks/cv";
import {
  CvEducation,
  CvExperience,
  CvProfile,
  CvSkill,
  CvTemplate,
} from "@/types/cv";

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

  const resolveSelectedIds = (ids: string[] | null | undefined) =>
    Array.isArray(ids) ? ids : [];

  const handleExportTemplate = (template: CvTemplate) => {
    try {
      const selectedExperienceIds = resolveSelectedIds(
        template.selectedExperienceIds
      );
      const selectedEducationIds = resolveSelectedIds(
        template.selectedEducationIds
      );
      const selectedSkillIds = resolveSelectedIds(template.selectedSkillIds);

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

      const importedTemplate = data?.template ?? data;
      if (!importedTemplate || typeof importedTemplate !== "object") {
        throw new Error("Invalid template format");
      }

      await updateTemplate.mutateAsync({
        id: template.id,
        input: {
          name: importedTemplate.name ?? template.name,
          description: importedTemplate.description ?? template.description,
          includeProfile:
            importedTemplate.includeProfile ?? template.includeProfile,
          includeLanguages:
            importedTemplate.includeLanguages ?? template.includeLanguages,
          selectedExperienceIds: resolveSelectedIds(
            importedTemplate.selectedExperienceIds
          ).filter((id: string) =>
            experiences.some((experience) => experience.id === id)
          ),
          selectedEducationIds: resolveSelectedIds(
            importedTemplate.selectedEducationIds
          ).filter((id: string) =>
            education.some((item) => item.id === id)
          ),
          selectedSkillIds: resolveSelectedIds(
            importedTemplate.selectedSkillIds
          ).filter((id: string) => skills.some((skill) => skill.id === id)),
        },
      });

      toast.success("Template updated from JSON import");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to import template"
      );
    }
  };

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
                  {resolveSelectedIds(template.selectedExperienceIds).length}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                  Education
                </span>
                <span className="font-medium">
                  {resolveSelectedIds(template.selectedEducationIds).length}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                  Skills
                </span>
                <span className="font-medium">
                  {resolveSelectedIds(template.selectedSkillIds).length}
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
