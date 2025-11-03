import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCvEducation, useUpdateCvEducation } from "@/hooks/cv";
import { CvEducation } from "@/types/cv";
import { toast } from "sonner";

interface CVEducationFormProps {
  initialData?: CvEducation;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const createInitialState = (data?: CvEducation) => ({
  school: data?.school ?? "",
  degree: data?.degree ?? "",
  field: data?.field ?? "",
  location: data?.location ?? "",
  startDate: data?.startDate ?? "",
  endDate: data?.endDate ?? "",
  isOngoing: data?.isOngoing ?? false,
  description: data?.description ?? "",
  website: data?.website ?? "",
});

export default function CVEducationForm({ initialData, onSuccess, onCancel }: CVEducationFormProps) {
  const [formData, setFormData] = useState(createInitialState(initialData));
  const createEducation = useCreateCvEducation();
  const updateEducation = useUpdateCvEducation();
  const isEditing = !!initialData;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.school || !formData.startDate) {
      toast.error("School and start date are required.");
      return;
    }

    try {
      const payload = {
        school: formData.school,
        degree: formData.degree || null,
        field: formData.field || null,
        location: formData.location || null,
        startDate: formData.startDate,
        endDate: formData.isOngoing ? null : formData.endDate || null,
        isOngoing: formData.isOngoing,
        description: formData.description || null,
        website: formData.website || null,
      };

      if (isEditing) {
        await updateEducation.mutateAsync({ id: initialData.id, input: payload });
        toast.success("Education updated successfully");
      } else {
        await createEducation.mutateAsync(payload);
        toast.success("Education added successfully");
        setFormData(createInitialState());
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(isEditing ? "Failed to update education" : "Failed to add education");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            School *
          </label>
          <Input
            value={formData.school}
            onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))}
            placeholder="University of Knowledge"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Degree
          </label>
          <Input
            value={formData.degree}
            onChange={(e) => setFormData((prev) => ({ ...prev, degree: e.target.value }))}
            placeholder="Bachelor of Science"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Field of Study
          </label>
          <Input
            value={formData.field}
            onChange={(e) => setFormData((prev) => ({ ...prev, field: e.target.value }))}
            placeholder="Computer Science"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Location
          </label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="City, Country"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Start Date *
          </label>
          <Input
            type="month"
            value={formData.startDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            End Date
          </label>
          <Input
            type="month"
            value={formData.endDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
            disabled={formData.isOngoing}
          />
          <div className="mt-2 flex items-center gap-2 text-sm">
            <input
              id="isOngoing"
              type="checkbox"
              className="h-4 w-4"
              checked={formData.isOngoing}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isOngoing: e.target.checked, endDate: e.target.checked ? "" : prev.endDate }))
              }
            />
            <label htmlFor="isOngoing" className="text-slate-700">
              I am still studying here
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Website
          </label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Highlight accomplishments, coursework, and awards..."
          rows={4}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={createEducation.isPending || updateEducation.isPending}>
          {createEducation.isPending || updateEducation.isPending ? "Saving..." : isEditing ? "Update Education" : "Add Education"}
        </Button>
      </div>
    </form>
  );
}
