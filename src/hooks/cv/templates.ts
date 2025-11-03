import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CvTemplate, CvTemplateInput } from "@/types/cv";

const TEMPLATES_QUERY_KEY = ["cv", "templates"] as const;

interface DbCvTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  selected_experience_ids: string[] | null;
  selected_education_ids: string[] | null;
  selected_skill_ids: string[] | null;
  include_profile: boolean;
  include_languages: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

const mapTemplateFromDb = (template: DbCvTemplate): CvTemplate => ({
  id: template.id,
  userId: template.user_id,
  name: template.name,
  description: template.description,
  selectedExperienceIds: template.selected_experience_ids ?? [],
  selectedEducationIds: template.selected_education_ids ?? [],
  selectedSkillIds: template.selected_skill_ids ?? [],
  includeProfile: template.include_profile,
  includeLanguages: template.include_languages,
  isDefault: template.is_default,
  createdAt: template.created_at,
  updatedAt: template.updated_at,
});

const mapTemplateToDb = (
  template: CvTemplateInput & { userId: string }
): Omit<DbCvTemplate, "id" | "created_at" | "updated_at"> => ({
  user_id: template.userId,
  name: template.name,
  description: template.description ?? null,
  selected_experience_ids: template.selectedExperienceIds?.length
    ? template.selectedExperienceIds
    : [],
  selected_education_ids: template.selectedEducationIds?.length
    ? template.selectedEducationIds
    : [],
  selected_skill_ids: template.selectedSkillIds?.length
    ? template.selectedSkillIds
    : [],
  include_profile: template.includeProfile ?? true,
  include_languages: template.includeLanguages ?? true,
  is_default: template.isDefault ?? false,
});

const mapTemplateUpdateToDb = (
  template: Partial<CvTemplateInput>
): Partial<Omit<DbCvTemplate, "id" | "created_at" | "updated_at" | "user_id">> => {
  const payload: Partial<Omit<DbCvTemplate, "id" | "created_at" | "updated_at" | "user_id">> = {};

  if (template.name !== undefined) {
    payload.name = template.name;
  }
  if (template.description !== undefined) {
    payload.description = template.description ?? null;
  }
  if (template.selectedExperienceIds !== undefined) {
    payload.selected_experience_ids = template.selectedExperienceIds?.length
      ? template.selectedExperienceIds
      : [];
  }
  if (template.selectedEducationIds !== undefined) {
    payload.selected_education_ids = template.selectedEducationIds?.length
      ? template.selectedEducationIds
      : [];
  }
  if (template.selectedSkillIds !== undefined) {
    payload.selected_skill_ids = template.selectedSkillIds?.length
      ? template.selectedSkillIds
      : [];
  }
  if (template.includeProfile !== undefined) {
    payload.include_profile = template.includeProfile;
  }
  if (template.includeLanguages !== undefined) {
    payload.include_languages = template.includeLanguages;
  }
  if (template.isDefault !== undefined) {
    payload.is_default = template.isDefault;
  }

  return payload;
};

export function useCvTemplates() {
  return useQuery({
    queryKey: TEMPLATES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cv_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return (data as DbCvTemplate[]).map(mapTemplateFromDb);
    },
  });
}

export function useCreateCvTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CvTemplateInput) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        throw new Error("You must be logged in to create a template.");
      }

      const payload = mapTemplateToDb({ ...input, userId: user.id });

      const { data, error } = await supabase
        .from("cv_templates")
        .insert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapTemplateFromDb(data as DbCvTemplate);
    },
    onSuccess: (template) => {
      queryClient.setQueryData<CvTemplate[]>(TEMPLATES_QUERY_KEY, (prev) =>
        prev ? [template, ...prev] : [template]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
    },
  });
}

export function useUpdateCvTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Partial<CvTemplateInput>;
    }) => {
      const payload = mapTemplateUpdateToDb(input);

      const { data, error } = await supabase
        .from("cv_templates")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapTemplateFromDb(data as DbCvTemplate);
    },
    onSuccess: (template) => {
      queryClient.setQueryData<CvTemplate[]>(TEMPLATES_QUERY_KEY, (prev) =>
        prev
          ? prev.map((item) => (item.id === template.id ? template : item))
          : [template]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
    },
  });
}

export function useDeleteCvTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cv_templates")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<CvTemplate[]>(TEMPLATES_QUERY_KEY, (prev) =>
        prev ? prev.filter((template) => template.id !== id) : prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
    },
  });
}
