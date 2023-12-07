import { db } from "@/lib/db";
import { $projects, $logos, $logo_types, $logo_variants, $colors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log(req)
  const { projectId } = await req.json();
  console.log(projectId)

  const numProjectId = parseInt(projectId)
  await db.delete($colors).where(eq($colors.projectId, numProjectId));
  await db.delete($logos).where(eq($logos.projectId, numProjectId));
  await db.delete($projects).where(eq($projects.id, numProjectId));

  return new NextResponse("ok", { status: 200 });
}