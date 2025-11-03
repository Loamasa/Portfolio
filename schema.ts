  title: varchar("title", { length: 255 }), // e.g., "Executive Assistant to the CEO"
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 255 }),
  dateOfBirth: varchar("dateOfBirth", { length: 10 }), // YYYY-MM-DD format
  nationality: varchar("nationality", { length: 100 }),
  profilePhoto: varchar("profilePhoto", { length: 500 }), // URL to profile photo
  profileSummary: text("profileSummary"), // Professional summary
  coreStrengths: text("coreStrengths"), // JSON array of strengths
  languages: text("languages"), // JSON array of languages
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CvProfile = typeof cvProfile.$inferSelect;
export type InsertCvProfile = typeof cvProfile.$inferInsert;

/**
 * CV Templates table - stores saved CV configurations
 */