  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(cvProfile).where(eq(cvProfile.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertCvProfile(data: InsertCvProfile): Promise<CvProfile> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(cvProfile).values(data).onDuplicateKeyUpdate({ set: data });
  const result = await db.select().from(cvProfile).where(eq(cvProfile.userId, data.userId)).limit(1);
  return result[0];
}

// CV Experiences helpers
export async function getCvExperiences(userId: number): Promise<CvExperience[]> {
  const db = await getDb();