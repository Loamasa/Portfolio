import { CvEducation } from "@/types/cv";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useDeleteCvEducation } from "@/hooks/cv";
import { toast } from "sonner";

interface CVEducationListProps {
  education: CvEducation[];
}

export default function CVEducationList({ education }: CVEducationListProps) {
  const deleteMutation = useDeleteCvEducation();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this education entry?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Education entry deleted");
      } catch (error) {
        toast.error("Failed to delete education entry");
      }
    }
  };

  if (!education || education.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-600 text-center">No education entries added yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {education.map((edu) => (
        <Card key={edu.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{edu.school}</CardTitle>
                <CardDescription className="font-semibold">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(edu.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>{edu.location}</span>
              <span>
                {edu.startDate} - {edu.isOngoing ? "Ongoing" : edu.endDate}
              </span>
            </div>
            {edu.description && (
              <p className="text-slate-700 whitespace-pre-wrap">{edu.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
