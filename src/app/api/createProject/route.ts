import { db } from "@/lib/db";
import { $projects, $logos } from "@/lib/db/schema"; // Assuming $logos is the table/schema for logos
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorised", { status: 401 });
    }
    
    const body = await req.json();
    const { projectName, originalUrl, blackUrl, whiteUrl, color } = body;
    console.log("body ",body)
  
    // First, save the SVG URLs into the logos table
    const insertedLogos = await db
      .insert($logos)
      .values({
        originalLogo: originalUrl,
        blackLogo: blackUrl,
        whiteLogo: whiteUrl
      })
      .returning({
        logoId: $logos.id
      });
    
    const logoId = insertedLogos[0].logoId; // Get the id of the inserted logo
    
    // console.log('project.color',color)
  
    // Now, insert into the projects table with the captured logoId
    const project_ids = await db
      .insert($projects)
      .values({
        projectName,
        userId,
        logoId,
        color, // Assign the logoId here
        // ... other fields if you have them
      })
      .returning({
        insertedId: $projects.id,
      });
  
    const projectId = project_ids[0].insertedId;
  
    return NextResponse.json({
      project_id: projectId,
    });
  }
