import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CvEducation, CvEducationInput } from "@/types/cv";

const EDUCATION_QUERY_KEY = ["cv", "education"] as const;

interface DbCvEducation {
  id: string;
  user_id: string;
  school: string;
  degree: string | null;
  field: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_ongoing: boolean;
  overview: string | null;
  education_sections: Array<{ title: string; items: string[] }> | null;
  website: string | null;
  eqf_level: string | null;
  description: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

const mapEducationFromDb = (education: DbCvEducation): CvEducation => ({
  id: education.id,
  userId: education.user_id,
  school: education.school,
  degree: education.degree,
  field: education.field,
  location: education.location,
  startDate: education.start_date,
  endDate: education.end_date,
  isOngoing: education.is_ongoing,
  overview: education.overview,
  educationSections: education.education_sections,
  website: education.website,
  eqfLevel: education.eqf_level,
  description: education.description,
  order: education.order,
  createdAt: education.created_at,
  updatedAt: education.updated_at,
});

const mapEducationToDb = (
  education: CvEducationInput & { userId: string }
): Omit<DbCvEducation, "id" | "created_at" | "updated_at"> => ({
  user_id: education.userId,
  school: education.school,
  degree: education.degree ?? null,
  field: education.field ?? null,
  location: education.location ?? null,
  start_date: education.startDate,
  end_date: education.isOngoing ? null : education.endDate ?? null,
  is_ongoing: education.isOngoing ?? false,
  overview: education.overview ?? null,
  education_sections: education.educationSections ?? null,
  website: education.website ?? null,
  eqf_level: education.eqfLevel ?? null,
  description: education.description ?? null,
  order: education.order ?? 0,
});

export function useCvEducation() {
  return useQuery({
    queryKey: EDUCATION_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cv_education")
        .select("*")
        .order("order", { ascending: true })
        .order("start_date", { ascending: false });

      if (error) {
        throw error;
      }

      return (data as DbCvEducation[]).map(mapEducationFromDb);
    },
  });
}

export function useCreateCvEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CvEducationInput) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        throw new Error("You must be logged in to add education.");
      }

      const payload = mapEducationToDb({ ...input, userId: user.id });

      const { data, error } = await supabase
        .from("cv_education")
        .insert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapEducationFromDb(data as DbCvEducation);
    },
    onSuccess: (education) => {
      queryClient.setQueryData<CvEducation[]>(EDUCATION_QUERY_KEY, (prev) =>
        prev ? [education, ...prev] : [education]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY });
    },
  });
}

export function useUpdateCvEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: CvEducationInput }) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        throw new Error("You must be logged in to update education.");
      }

      const payload = mapEducationToDb({ ...input, userId: user.id });

      const { data, error } = await supabase
        .from("cv_education")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapEducationFromDb(data as DbCvEducation);
    },
    onSuccess: (education) => {
      queryClient.setQueryData<CvEducation[]>(EDUCATION_QUERY_KEY, (prev) =>
        prev ? prev.map((edu) => (edu.id === education.id ? education : edu)) : [education]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY });
    },
  });
}

export function useDeleteCvEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cv_education")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<CvEducation[]>(EDUCATION_QUERY_KEY, (prev) =>
        prev ? prev.filter((education) => education.id !== id) : prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY });
    },
  });
}
