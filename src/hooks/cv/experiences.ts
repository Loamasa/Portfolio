import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CvExperience, CvExperienceInput } from "@/types/cv";

const EXPERIENCES_QUERY_KEY = ["cv", "experiences"] as const;

interface DbCvExperience {
  id: string;
  user_id: string;
  job_title: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  overview: string | null;
  role_categories: Array<{ category: string; items: string[] }> | null;
  description: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

const mapExperienceFromDb = (experience: DbCvExperience): CvExperience => ({
  id: experience.id,
  userId: experience.user_id,
  jobTitle: experience.job_title,
  company: experience.company,
  location: experience.location,
  startDate: experience.start_date,
  endDate: experience.end_date,
  isCurrent: experience.is_current,
  overview: experience.overview,
  roleCategories: experience.role_categories,
  description: experience.description,
  order: experience.order,
  createdAt: experience.created_at,
  updatedAt: experience.updated_at,
});

const mapExperienceToDb = (
  experience: CvExperienceInput & { userId: string }
): Omit<DbCvExperience, "id" | "created_at" | "updated_at"> => ({
  user_id: experience.userId,
  job_title: experience.jobTitle,
  company: experience.company,
  location: experience.location ?? null,
  start_date: experience.startDate,
  end_date: experience.isCurrent ? null : experience.endDate ?? null,
  is_current: experience.isCurrent ?? false,
  overview: experience.overview ?? null,
  role_categories: experience.roleCategories ?? null,
  description: experience.description ?? null,
  order: experience.order ?? 0,
});

export function useCvExperiences() {
  return useQuery({
    queryKey: EXPERIENCES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cv_experiences")
        .select("*")
        .order("order", { ascending: true })
        .order("start_date", { ascending: false });

      if (error) {
        throw error;
      }

      return (data as DbCvExperience[]).map(mapExperienceFromDb);
    },
  });
}

export function useCreateCvExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CvExperienceInput) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        throw new Error("You must be logged in to add an experience.");
      }

      const payload = mapExperienceToDb({ ...input, userId: user.id });

      const { data, error } = await supabase
        .from("cv_experiences")
        .insert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapExperienceFromDb(data as DbCvExperience);
    },
    onSuccess: (experience) => {
      queryClient.setQueryData<CvExperience[]>(EXPERIENCES_QUERY_KEY, (prev) =>
        prev ? [experience, ...prev] : [experience]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY });
    },
  });
}

export function useUpdateCvExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: CvExperienceInput }) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        throw new Error("You must be logged in to update an experience.");
      }

      const payload = mapExperienceToDb({ ...input, userId: user.id });

      const { data, error } = await supabase
        .from("cv_experiences")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapExperienceFromDb(data as DbCvExperience);
    },
    onSuccess: (experience) => {
      queryClient.setQueryData<CvExperience[]>(EXPERIENCES_QUERY_KEY, (prev) =>
        prev ? prev.map((exp) => (exp.id === experience.id ? experience : exp)) : [experience]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY });
    },
  });
}

export function useDeleteCvExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cv_experiences")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<CvExperience[]>(EXPERIENCES_QUERY_KEY, (prev) =>
        prev ? prev.filter((experience) => experience.id !== id) : prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY });
    },
  });
}
