import { useState } from "react";
import { CvExperience } from "@/types/cv";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useDeleteCvExperience } from "@/hooks/cv";
import { toast } from "sonner";
import CVExperienceForm from "./CVExperienceForm";

interface CVExperienceListProps {
  experiences: CvExperience[];
}

export default function CVExperienceList({ experiences }: CVExperienceListProps) {
  const deleteMutation = useDeleteCvExperience();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Experience deleted");
      } catch (error) {
        toast.error("Failed to delete experience");
      }
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  if (!experiences || experiences.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-600 text-center">No experiences added yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {experiences.map((exp) => {
        if (editingId === exp.id) {
          return (
            <Card key={exp.id}>
              <CardContent className="pt-6">
                <CVExperienceForm
                  initialData={exp}
                  onSuccess={handleCancelEdit}
                  onCancel={handleCancelEdit}
                />
              </CardContent>
            </Card>
          );
        }

        return (
          <Card key={exp.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{exp.jobTitle}</CardTitle>
                  <CardDescription className="font-semibold">{exp.company}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(exp.id)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(exp.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{exp.location}</span>
                <span>
                  {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <p className="text-slate-700 whitespace-pre-wrap">{exp.description}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
