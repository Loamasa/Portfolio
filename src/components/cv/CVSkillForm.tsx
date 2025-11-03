import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateCvSkill, useUpdateCvSkill } from "@/hooks/cv";
import { CvSkill } from "@/types/cv";
import { toast } from "sonner";

interface CVSkillFormProps {
  initialData?: CvSkill;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const createInitialState = (data?: CvSkill) => ({
  skillName: data?.skillName ?? "",
  category: data?.category ?? "",
  proficiency: data?.proficiency ?? "",
});

export default function CVSkillForm({ initialData, onSuccess, onCancel }: CVSkillFormProps) {
  const [formData, setFormData] = useState(createInitialState(initialData));
  const createSkill = useCreateCvSkill();
  const updateSkill = useUpdateCvSkill();
  const isEditing = !!initialData;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.skillName) {
      toast.error("Skill name is required.");
      return;
    }

    try {
      const payload = {
        skillName: formData.skillName,
        category: formData.category || null,
        proficiency: formData.proficiency || null,
      };

      if (isEditing) {
        await updateSkill.mutateAsync({ id: initialData.id, input: payload });
        toast.success("Skill updated successfully");
      } else {
        await createSkill.mutateAsync(payload);
        toast.success("Skill added successfully");
        setFormData(createInitialState());
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(isEditing ? "Failed to update skill" : "Failed to add skill");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Skill Name *
          </label>
          <Input
            value={formData.skillName}
            onChange={(e) => setFormData((prev) => ({ ...prev, skillName: e.target.value }))}
            placeholder="Project Management"
            required
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            placeholder="Leadership"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Proficiency
          </label>
          <Input
            value={formData.proficiency}
            onChange={(e) => setFormData((prev) => ({ ...prev, proficiency: e.target.value }))}
            placeholder="Expert"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={createSkill.isPending || updateSkill.isPending}>
          {createSkill.isPending || updateSkill.isPending ? "Saving..." : isEditing ? "Update Skill" : "Add Skill"}
        </Button>
      </div>
    </form>
  );
}
