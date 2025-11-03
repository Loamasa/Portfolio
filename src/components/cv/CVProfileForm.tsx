import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CvProfile } from "@/types/cv";
import { toast } from "sonner";

interface CVProfileFormProps {
  profile?: CvProfile | null;
}

export default function CVProfileForm({ profile }: CVProfileFormProps) {
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    title: profile?.title || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    dateOfBirth: profile?.dateOfBirth || "",
    nationality: profile?.nationality || "",
    profilePhoto: profile?.profilePhoto || "",
    profileSummary: profile?.profileSummary || "",
    coreStrengths: profile?.coreStrengths ? (typeof profile.coreStrengths === 'string' ? JSON.parse(profile.coreStrengths) : profile.coreStrengths) : [],
    languages: profile?.languages ? (typeof profile.languages === 'string' ? JSON.parse(profile.languages) : profile.languages) : [],
  });

  const upsertMutation = trpc.cv.upsertProfile.useMutation();
  const utils = trpc.useUtils();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        fullName: formData.fullName,
        title: formData.title || null,
        email: formData.email || null,
        phone: formData.phone || null,
        location: formData.location || null,
        dateOfBirth: formData.dateOfBirth || null,
        nationality: formData.nationality || null,
        profilePhoto: formData.profilePhoto || null,
        profileSummary: formData.profileSummary || null,
        coreStrengths: formData.coreStrengths && formData.coreStrengths.length > 0 ? formData.coreStrengths : null,
        languages: formData.languages && formData.languages.length > 0 ? formData.languages : null,
      };
      await upsertMutation.mutateAsync(submitData);
      await utils.cv.getProfile.invalidate();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Name *
          </label>
          <Input
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Professional Title
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Executive Assistant to the CEO"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone
          </label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+46 123 456 789"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Location
        </label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="City, Country"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Professional Summary
        </label>
        <Textarea
          value={formData.profileSummary}
          onChange={(e) => setFormData({ ...formData, profileSummary: e.target.value })}
          placeholder="Write a brief professional summary..."
          rows={4}
        />
      </div>

      <Button
        type="submit"
        disabled={upsertMutation.isPending}
        className="w-full"
      >
        {upsertMutation.isPending ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}

