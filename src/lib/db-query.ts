import { $projects } from "./db/schema";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

export async function getProjects(userId: any) {
    return await db
        .select()
        .from($projects)
        .where(eq($projects.userId, userId as string));
}
