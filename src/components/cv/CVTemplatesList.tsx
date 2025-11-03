import { CvTemplate } from "@/types/cv";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface CVTemplatesListProps {
  templates: CvTemplate[];
}

export default function CVTemplatesList({ templates }: CVTemplatesListProps) {
  const deleteMutation = trpc.cv.deleteTemplate.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        await utils.cv.getTemplates.invalidate();
        toast.success("Template deleted");
      } catch (error) {
        toast.error("Failed to delete template");
      }
    }
  };

  const handleExportTemplate = async (templateId: number) => {
    try {
      const data = await utils.cv.exportJson.fetch({ templateId });
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cv-template-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Template exported");
    } catch (error) {
      toast.error("Failed to export template");
    }
  };

  if (!templates || templates.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-600 text-center">No templates created yet. Create one to save your CV configuration.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{template.name}</CardTitle>
                {template.isDefault === 1 && (
                  <Badge className="mt-2">Default</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExportTemplate(template.id)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {template.description && (
              <p className="text-slate-600">{template.description}</p>
            )}
            <div className="space-y-2 text-sm text-slate-600">
              <div>
                Experiences: {JSON.parse(template.selectedExperienceIds as string || '[]').length}
              </div>
              <div>
                Education: {JSON.parse(template.selectedEducationIds as string || '[]').length}
              </div>
              <div>
                Skills: {JSON.parse(template.selectedSkillIds as string || '[]').length}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

