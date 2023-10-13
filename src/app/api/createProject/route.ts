// /api/createProject.ts

import { db } from "@/lib/db";
import { $projects } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("unauthorised", { status: 401 });
  }
  
  const body = await req.json();
  console.log("body->", body)
  const { projectName, imageUrl } = body; // Destructure other necessary fields

  // Insert into the projects table
  const project_ids = await db
    .insert($projects)
    .values({
      projectName,
      userId,
      imageUrl,
      // ... other fields
    })
    .returning({
      insertedId: $projects.id,
    });

  return NextResponse.json({
    project_id: project_ids[0].insertedId,
  });
}
