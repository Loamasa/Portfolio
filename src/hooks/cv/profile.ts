import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CvProfile, CvProfileInput } from "@/types/cv";

const PROFILE_QUERY_KEY = ["cv", "profile"] as const;

interface DbCvProfile {
  id: string;
  user_id: string;
  full_name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  profile_photo: string | null;
  profile_summary: string | null;
  core_strengths: string[] | null;
  languages: Array<{ language: string; proficiency: string }> | null;
  created_at: string;
  updated_at: string;
}

const mapProfileFromDb = (profile: DbCvProfile): CvProfile => ({
  id: profile.id,
  userId: profile.user_id,
  fullName: profile.full_name,
  title: profile.title,
  email: profile.email,
  phone: profile.phone,
  location: profile.location,
  dateOfBirth: profile.date_of_birth,
  nationality: profile.nationality,
  profilePhoto: profile.profile_photo,
  profileSummary: profile.profile_summary,
  coreStrengths: profile.core_strengths,
  languages: profile.languages,
  createdAt: profile.created_at,
  updatedAt: profile.updated_at,
});

const mapProfileToDb = (
  input: CvProfileInput & { userId: string }
): Omit<DbCvProfile, "id" | "created_at" | "updated_at"> => ({
  user_id: input.userId,
  full_name: input.fullName,
  title: input.title ?? null,
  email: input.email ?? null,
  phone: input.phone ?? null,
  location: input.location ?? null,
  date_of_birth: input.dateOfBirth ?? null,
  nationality: input.nationality ?? null,
  profile_photo: input.profilePhoto ?? null,
  profile_summary: input.profileSummary ?? null,
  core_strengths: input.coreStrengths ?? null,
  languages: input.languages ?? null,
});

export function useCvProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cv_profiles")
        .select("*")
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data ? mapProfileFromDb(data as DbCvProfile) : null;
    },
  });
}

export function useUpsertCvProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CvProfileInput) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        throw new Error("You must be logged in to update your profile.");
      }

      const payload = mapProfileToDb({ ...input, userId: user.id });

      const { data, error } = await supabase
        .from("cv_profiles")
        .upsert(payload, { onConflict: "user_id" })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapProfileFromDb(data as DbCvProfile);
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}
