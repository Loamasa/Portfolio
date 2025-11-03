      .input(z.object({
        fullName: z.string(),
        title: z.string().nullable().optional(),
        email: z.string().email().nullable().optional(),
        phone: z.string().nullable().optional(),
        location: z.string().nullable().optional(),
        dateOfBirth: z.string().nullable().optional(),
        nationality: z.string().nullable().optional(),
        profilePhoto: z.string().nullable().optional(),
        profileSummary: z.string().nullable().optional(),
        coreStrengths: z.array(z.string()).nullable().optional(),
        languages: z.array(z.object({
          language: z.string(),
          proficiency: z.string(),
        })).nullable().optional(),
      }))
      .mutation(async ({ ctx, input }) => {