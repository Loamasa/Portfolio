import { useState } from "react";
import { CvSkill } from "@/types/cv";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { useDeleteCvSkill } from "@/hooks/cv";
import { toast } from "sonner";
import CVSkillForm from "./CVSkillForm";

interface CVSkillsListProps {
  skills: CvSkill[];
}

export default function CVSkillsList({ skills }: CVSkillsListProps) {
  const deleteMutation = useDeleteCvSkill();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Skill deleted");
      } catch (error) {
        toast.error("Failed to delete skill");
      }
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  if (!skills || skills.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-600 text-center">No skills added yet</p>
        </CardContent>
      </Card>
    );
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, CvSkill[]>);

  return (
    <div className="space-y-6">
      {editingId && (
        <Card>
          <CardContent className="pt-6">
            <CVSkillForm
              initialData={skills.find((s) => s.id === editingId)}
              onSuccess={handleCancelEdit}
              onCancel={handleCancelEdit}
            />
          </CardContent>
        </Card>
      )}

      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  {skill.skillName}
                  {skill.proficiency && ` (${skill.proficiency})`}
                </Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleEdit(skill.id)}>
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleDelete(skill.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
