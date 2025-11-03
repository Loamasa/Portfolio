import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCvExperience } from "@/hooks/cv";
import { toast } from "sonner";

interface CVExperienceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const createInitialState = () => ({
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  overview: "",
  description: "",
});

export default function CVExperienceForm({ onSuccess, onCancel }: CVExperienceFormProps) {
  const [formData, setFormData] = useState(createInitialState());
  const createExperience = useCreateCvExperience();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.jobTitle || !formData.company || !formData.startDate) {
      toast.error("Job title, company, and start date are required.");
      return;
    }

    try {
      await createExperience.mutateAsync({
        jobTitle: formData.jobTitle,
        company: formData.company,
        location: formData.location || null,
        startDate: formData.startDate,
        endDate: formData.isCurrent ? null : formData.endDate || null,
        isCurrent: formData.isCurrent,
        overview: formData.overview || null,
        description: formData.description || null,
      });

      toast.success("Experience added successfully");
      setFormData(createInitialState());
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add experience");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Job Title *
          </label>
          <Input
            value={formData.jobTitle}
            onChange={(e) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))}
            placeholder="Senior Developer"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company *
          </label>
          <Input
            value={formData.company}
            onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
            placeholder="Tech Corp"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
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
            disabled={formData.isCurrent}
          />
          <div className="mt-2 flex items-center gap-2 text-sm">
            <input
              id="isCurrent"
              type="checkbox"
              className="h-4 w-4"
              checked={formData.isCurrent}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isCurrent: e.target.checked, endDate: e.target.checked ? "" : prev.endDate }))
              }
            />
            <label htmlFor="isCurrent" className="text-slate-700">
              I currently work here
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Overview
        </label>
        <Input
          value={formData.overview}
          onChange={(e) => setFormData((prev) => ({ ...prev, overview: e.target.value }))}
          placeholder="Short description of the role"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your key achievements, responsibilities, and results..."
          rows={4}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={createExperience.isPending}>
          {createExperience.isPending ? "Saving..." : "Add Experience"}
        </Button>
      </div>
    </form>
  );
}
