import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateCvTemplate,
  useCvEducation,
  useCvExperiences,
  useCvSkills,
} from "@/hooks/cv";
import { toast } from "sonner";

interface CVTemplateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CVTemplateForm({ onSuccess, onCancel }: CVTemplateFormProps) {
  const createTemplate = useCreateCvTemplate();
  const experiencesQuery = useCvExperiences();
  const educationQuery = useCvEducation();
  const skillsQuery = useCvSkills();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    includeProfile: true,
    includeLanguages: true,
    selectedExperienceIds: [] as string[],
    selectedEducationIds: [] as string[],
    selectedSkillIds: [] as string[],
  });

  const isLoadingOptions =
    experiencesQuery.isLoading ||
    educationQuery.isLoading ||
    skillsQuery.isLoading;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Template name is required.");
      return;
    }

    try {
      await createTemplate.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        includeProfile: formData.includeProfile,
        includeLanguages: formData.includeLanguages,
        selectedExperienceIds: formData.selectedExperienceIds,
        selectedEducationIds: formData.selectedEducationIds,
        selectedSkillIds: formData.selectedSkillIds,
      });

      toast.success("Template created successfully");
      setFormData({
        name: "",
        description: "",
        includeProfile: true,
        includeLanguages: true,
        selectedExperienceIds: [],
        selectedEducationIds: [],
        selectedSkillIds: [],
      });
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create template");
    }
  };

  const toggleSelection = (key: "selectedExperienceIds" | "selectedEducationIds" | "selectedSkillIds", id: string) => {
    setFormData((prev) => {
      const current = new Set(prev[key]);
      if (current.has(id)) {
        current.delete(id);
      } else {
        current.add(id);
      }
      return { ...prev, [key]: Array.from(current) };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Template Name *</label>
          <Input
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Tech Lead CV"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Include Sections</label>
          <div className="flex flex-col gap-2 rounded-md border border-slate-200 p-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={formData.includeProfile}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, includeProfile: event.target.checked }))
                }
              />
              Include profile information
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={formData.includeLanguages}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, includeLanguages: event.target.checked }))
                }
              />
              Include languages
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <Textarea
          value={formData.description}
          onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Short description for when to use this template"
          rows={3}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
              Experiences
            </h3>
            <button
              type="button"
              className="text-xs text-blue-600 hover:underline"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  selectedExperienceIds:
                    prev.selectedExperienceIds.length ===
                    (experiencesQuery.data?.length ?? 0)
                      ? []
                      : experiencesQuery.data?.map((experience) => experience.id) ?? [],
                }))
              }
            >
              {formData.selectedExperienceIds.length ===
              (experiencesQuery.data?.length ?? 0)
                ? "Clear"
                : "Select All"}
            </button>
          </div>
          <div className="space-y-2 rounded-md border border-slate-200 p-3 max-h-64 overflow-y-auto">
            {isLoadingOptions ? (
              <p className="text-sm text-muted-foreground">Loading experiences...</p>
            ) : experiencesQuery.data && experiencesQuery.data.length > 0 ? (
              experiencesQuery.data.map((experience) => (
                <label
                  key={experience.id}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={formData.selectedExperienceIds.includes(experience.id)}
                    onChange={() => toggleSelection("selectedExperienceIds", experience.id)}
                  />
                  <span>
                    <span className="font-medium">{experience.jobTitle}</span>
                    <span className="block text-xs text-slate-500">
                      {experience.company} · {experience.startDate}
                      {experience.endDate ? ` – ${experience.endDate}` : ""}
                    </span>
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No experiences available</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
              Education
            </h3>
            <button
              type="button"
              className="text-xs text-blue-600 hover:underline"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  selectedEducationIds:
                    prev.selectedEducationIds.length ===
                    (educationQuery.data?.length ?? 0)
                      ? []
                      : educationQuery.data?.map((education) => education.id) ?? [],
                }))
              }
            >
              {formData.selectedEducationIds.length ===
              (educationQuery.data?.length ?? 0)
                ? "Clear"
                : "Select All"}
            </button>
          </div>
          <div className="space-y-2 rounded-md border border-slate-200 p-3 max-h-64 overflow-y-auto">
            {isLoadingOptions ? (
              <p className="text-sm text-muted-foreground">Loading education...</p>
            ) : educationQuery.data && educationQuery.data.length > 0 ? (
              educationQuery.data.map((education) => (
                <label
                  key={education.id}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={formData.selectedEducationIds.includes(education.id)}
                    onChange={() => toggleSelection("selectedEducationIds", education.id)}
                  />
                  <span>
                    <span className="font-medium">{education.school}</span>
                    <span className="block text-xs text-slate-500">
                      {education.degree}
                      {education.field ? ` · ${education.field}` : ""}
                    </span>
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No education records available</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
              Skills
            </h3>
            <button
              type="button"
              className="text-xs text-blue-600 hover:underline"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  selectedSkillIds:
                    prev.selectedSkillIds.length === (skillsQuery.data?.length ?? 0)
                      ? []
                      : skillsQuery.data?.map((skill) => skill.id) ?? [],
                }))
              }
            >
              {formData.selectedSkillIds.length === (skillsQuery.data?.length ?? 0)
                ? "Clear"
                : "Select All"}
            </button>
          </div>
          <div className="space-y-2 rounded-md border border-slate-200 p-3 max-h-64 overflow-y-auto">
            {isLoadingOptions ? (
              <p className="text-sm text-muted-foreground">Loading skills...</p>
            ) : skillsQuery.data && skillsQuery.data.length > 0 ? (
              skillsQuery.data.map((skill) => (
                <label key={skill.id} className="flex items-start gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={formData.selectedSkillIds.includes(skill.id)}
                    onChange={() => toggleSelection("selectedSkillIds", skill.id)}
                  />
                  <span>
                    <span className="font-medium">{skill.skillName}</span>
                    <span className="block text-xs text-slate-500">
                      {skill.category || "General"}
                      {skill.proficiency ? ` · ${skill.proficiency}` : ""}
                    </span>
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills available</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={createTemplate.isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={createTemplate.isPending}>
          {createTemplate.isPending ? "Creating..." : "Create Template"}
        </Button>
      </div>
    </form>
  );
}
