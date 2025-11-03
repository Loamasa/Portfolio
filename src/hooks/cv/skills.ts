import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CvSkill, CvSkillInput } from "@/types/cv";

const SKILLS_QUERY_KEY = ["cv", "skills"] as const;

interface DbCvSkill {
  id: string;
  user_id: string;
  skill_name: string;
  category: string | null;
  proficiency: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

const mapSkillFromDb = (skill: DbCvSkill): CvSkill => ({
  id: skill.id,
  userId: skill.user_id,
  skillName: skill.skill_name,
  category: skill.category,
  proficiency: skill.proficiency,
  order: skill.order,
  createdAt: skill.created_at,
  updatedAt: skill.updated_at,
});

const mapSkillToDb = (
  skill: CvSkillInput & { userId: string }
): Omit<DbCvSkill, "id" | "created_at" | "updated_at"> => ({
  user_id: skill.userId,
  skill_name: skill.skillName,
  category: skill.category ?? null,
  proficiency: skill.proficiency ?? null,
  order: skill.order ?? 0,
});

export function useCvSkills() {
  return useQuery({
    queryKey: SKILLS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cv_skills")
        .select("*")
        .order("order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      return (data as DbCvSkill[]).map(mapSkillFromDb);
    },
  });
}

export function useCreateCvSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CvSkillInput) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        throw new Error("You must be logged in to add skills.");
      }

      const payload = mapSkillToDb({ ...input, userId: user.id });

      const { data, error } = await supabase
        .from("cv_skills")
        .insert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapSkillFromDb(data as DbCvSkill);
    },
    onSuccess: (skill) => {
      queryClient.setQueryData<CvSkill[]>(SKILLS_QUERY_KEY, (prev) =>
        prev ? [skill, ...prev] : [skill]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
    },
  });
}

export function useDeleteCvSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cv_skills")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<CvSkill[]>(SKILLS_QUERY_KEY, (prev) =>
        prev ? prev.filter((skill) => skill.id !== id) : prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
    },
  });
}
