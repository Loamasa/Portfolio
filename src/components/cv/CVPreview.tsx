import { Button } from "@/components/ui/button";
import { Download, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { generateCVPDF } from "@/lib/pdfGenerator";
import { toast } from "sonner";

interface CVPreviewProps {
  cvData: {
    profile: {
      fullName: string;
      title?: string | null;
      email?: string | null;
      phone?: string | null;
      location?: string | null;
      profileSummary?: string | null;
      coreStrengths?: string[] | string | null;
      languages?: Array<{ language: string; proficiency: string }> | string | null;
    } | null;
    experiences: Array<{
      jobTitle: string;
      company: string;
      location?: string | null;
      startDate: string;
      endDate?: string | null;
      isCurrent: boolean | number;
      overview?: string | null;
      roleCategories?: Array<{ name: string; items: string[] }> | string | null;
      description?: string | null;
    }>;
    education: Array<{
      school: string;
      degree?: string | null;
      field?: string | null;
      location?: string | null;
      startDate: string;
      endDate?: string | null;
      isOngoing: boolean | number;
      overview?: string | null;
      educationSections?: Array<{ name: string; items: string[] }> | string | null;
      website?: string | null;
      eqfLevel?: string | null;
      description?: string | null;
    }>;
    skills: Array<{
      skillName: string;
      category?: string | null;
      proficiency?: string | null;
    }>;
  };
}

export default function CVPreview({ cvData }: CVPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await generateCVPDF(cvData, `${cvData.profile?.fullName || 'CV'}-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("CV exported successfully");
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error("Failed to export CV");
    } finally {
      setIsExporting(false);
    }
  };

  const profile = cvData.profile;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          className="flex-1"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Show Preview
            </>
          )}
        </Button>
        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Export PDF"}
        </Button>
      </div>

      {showPreview && (
        <div className="border border-slate-200 rounded-lg p-8 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-3 mb-4">
            <h1 className="text-3xl font-bold text-slate-900">
              {profile?.fullName}
            </h1>
            {profile?.title && (
              <p className="text-sm font-semibold text-blue-600 mt-1">
                {profile.title}
              </p>
            )}
            <div className="text-xs text-slate-600 mt-2">
              {profile?.location && <span>{profile.location}</span>}
              {profile?.phone && <span> | {profile.phone}</span>}
              {profile?.email && <span> | {profile.email}</span>}
            </div>
          </div>

          {/* Profile Summary */}
          {profile?.profileSummary && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                Professional Summary
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {profile.profileSummary}
              </p>
            </div>
          )}

          {/* Core Strengths */}
          {profile?.coreStrengths && (() => {
            const strengths = typeof profile.coreStrengths === 'string' 
              ? JSON.parse(profile.coreStrengths) 
              : (Array.isArray(profile.coreStrengths) ? profile.coreStrengths : []);
            return strengths.length > 0 ? (
              <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                  Core Strengths
                </h2>
                <ul className="text-xs text-slate-700 space-y-1">
                  {strengths.map((strength: string, i: number) => (
                    <li key={i}>• {strength}</li>
                  ))}
                </ul>
              </div>
            ) : null;
          })()}

          {/* Experience */}
          {cvData.experiences.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                Experience
              </h2>
              <div className="space-y-3">
                {cvData.experiences.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {exp.jobTitle}
                      </span>
                      <span className="text-xs text-slate-600">
                        {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      {exp.company}
                      {exp.location && ` | ${exp.location}`}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-700 mt-1 whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cvData.education.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                Education
              </h2>
              <div className="space-y-3">
                {cvData.education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {edu.school}
                      </span>
                      <span className="text-xs text-slate-600">
                        {edu.startDate} - {edu.isOngoing ? "Ongoing" : edu.endDate}
                      </span>
                    </div>
                    {(edu.degree || edu.field) && (
                      <div className="text-xs text-slate-600">
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                        {edu.location && ` | ${edu.location}`}
                      </div>
                    )}
                    {edu.description && (
                      <p className="text-xs text-slate-700 mt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                Skills
              </h2>
              <div className="space-y-2">
                {(() => {
                  const grouped = cvData.skills.reduce((acc, skill) => {
                    const cat = skill.category || "Other";
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(skill);
                    return acc;
                  }, {} as Record<string, typeof cvData.skills>);

                  return Object.entries(grouped).map(([category, skills]) => (
                    <div key={category}>
                      <span className="text-xs font-bold text-slate-900">
                        {category}:
                      </span>
                      <span className="text-xs text-slate-700 ml-1">
                        {skills
                          .map(s =>
                            `${s.skillName}${s.proficiency ? ` (${s.proficiency})` : ""}`
                          )
                          .join(", ")}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Languages */}
          {profile?.languages && (() => {
            const langs = typeof profile.languages === 'string'
              ? JSON.parse(profile.languages)
              : (Array.isArray(profile.languages) ? profile.languages : []);
            return langs.length > 0 ? (
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                  Languages
                </h2>
                <div className="space-y-1">
                  {langs.map((lang: any, i: number) => (
                    <div key={i} className="text-xs text-slate-700">
                      <span className="font-semibold">{lang.language}</span> -{" "}
                      {lang.proficiency}
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}

