import { db } from "@/lib/db";
import { $projects, $logos, $logo_types, $logo_variants, $colors } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("unauthorised", { status: 401 });
  }

  const body = await req.json();
  console.log("body ", body);

  // 1. Insert into projects table
  const insertedProject = await db
    .insert($projects)
    .values({
      projectName: body.projectName,
      userId: userId
    })
    .returning({
      projectId: $projects.id
    });

  const projectId = insertedProject[0].projectId;

  for (let logoTypeKey in body.urls) {
    // Extract the logo type and color variant from the key (e.g., "Full Logo_black" -> "Full Logo", "black")
    const [logoType, colorVariant] = logoTypeKey.split("_");

    const logoTypeRows = await db
      .select({ logoTypeId: $logo_types.id })
      .from($logo_types)
      .where(sql`${$logo_types.name} = ${logoType}`)
      .limit(1);

    if (logoTypeRows.length === 0) {
      console.error(`No logo type found for "${logoType}"`);
      continue;
    }

    const { logoTypeId } = logoTypeRows[0];

    const logoVariantRows = await db
      .select({ logoVariantId: $logo_variants.id })
      .from($logo_variants)
      .where(sql`${$logo_variants.color} = ${colorVariant}`)
      .limit(1);

    if (logoVariantRows.length === 0) {
      console.error(`No logo variant found for "${colorVariant}"`);
      continue;
    }

    const { logoVariantId } = logoVariantRows[0];


    await db
      .insert($logos)
      .values({
        url: body.urls[logoTypeKey],
        projectId: projectId,
        logoTypeId: logoTypeId,
        logoVariantId: logoVariantId
      });
  }

  for (let color of body.colors) {
    await db
      .insert($colors)
      .values({
        hexCode: color,
        projectId: projectId
      });
  }



  return NextResponse.json({
    projectName: body.projectName.replace(/ /g, ''),
    projectId: projectId
  });
}
