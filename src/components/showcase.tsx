import Image from "next/image";
import { $projects, $logos, $logo_types, $logo_variants, $colors } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";
import { GetColorName } from 'hex-color-to-color-name';


interface ShowcaseProps {
    projectId: number | string;
}

export default async function Showcase({ projectId }: ShowcaseProps) {
    console.log("projectId", projectId)

    // Import projects
    const numProjectId = Number(projectId);
    if (isNaN(numProjectId)) {
        throw new Error('Invalid Project ID');
    }

    const projects = await db.select().from($projects).where(eq($projects.id, numProjectId));
    const project = projects[0];

    // const monogramLogos = await db
    // .select()
    // .from($logos)
    // .leftJoin($logo_types, eq($logo_types.id, $logos.logoTypeId))
    // .leftJoin($logo_variants, eq($logo_variants.id, $logos.logoVariantId))
    // .where(
    //     and (
    //         eq($logo_types.name, "Monogram"),
    //         eq($logos.projectId, numProjectId)
    //     )
    // )
    // const whiteMonogram = logos
    //     .filter(logo => logo.logo_variants?.color === "white")
    //     .map(logo => logo.logos.url);

    // const logos = await db
    //     .select()
    //     .from($logos)
    //     .where(
    //         eq($logos.projectId, numProjectId)
    //     )

    const logos = await db
        .select()
        .from($logos)
        .leftJoin($logo_types, eq($logo_types.id, $logos.logoTypeId))
        .leftJoin($logo_variants, eq($logo_variants.id, $logos.logoVariantId))
        .where(eq($logos.projectId, numProjectId))
    // console.log("logos", logos)

    let organizedLogos: { [key: string]: any } = {};
    logos.forEach(entry => {
        let type = entry.logo_types!.name.toLowerCase().split(' ').join('_'); // full_logo, wordmark, monogram
        let color = entry.logo_variants!.color; // white, black, color
        if (!organizedLogos[type]) organizedLogos[type] = {};
        organizedLogos[type][color] = entry.logos.url;
    });

    const colors = await db
    .select()
    .from($colors)
    .where(eq($colors.projectId, numProjectId))

    console.log("colors", colors)

    // Check if the project exists
    if (!logos) {
        throw new Error('Project not found');
    }

    return (
        <div className="w-full relative">
            <div className="header flex h-3/5 justify-center items-center p-20" style={{
                // backgroundImage: `url(${ projectLogo.whiteLogo! })`,
                // backgroundSize: "cover",
                // backgroundPosition: "top",
                backgroundColor: colors.length > 0 && colors[0].hexCode ? colors[0].hexCode : "#000"
            }}>
                <img src={organizedLogos.monogram.white} alt={project.projectName} width={50} height={50} />
            </div>
            <div className="monochrome_logos flex">
                <div className="bg-white w-1/2 flex justify-center items-center p-20">
                    {/* Replace with your black logo from the database */}
                    <img src={organizedLogos.monogram.black} width={50} height={50} alt={project.projectName} />
                </div>
                <div className="bg-black w-1/2 flex justify-center items-center p-20">
                    {/* Replace with your white logo from the database */}
                    <img src={organizedLogos.monogram.white} width={50} height={50} alt={project.projectName} style={{ fill: "#fff" }} />
                </div>
            </div>
            {/* The typography section seems static. If there are dynamic values in your database, they need to be replaced accordingly */}
            <div className="typography flex p-20 gap-8 justify-center items-center">
                <div>
                    <h2 className="text-9xl font-semibold">Aa</h2>
                </div>
                <div>
                    <h3 className="text-4xl font-semibold">Inter</h3>
                    <p>
                        ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
                        abcdefghijklmnopqrstvwxyz<br/>
                        0123456789!”#$%&/()@=?,-
                    </p>
                </div>
            </div>
            {/* Assuming the colors are project-specific and stored in your database */}
            <div className="colors flex w-full justify-evenly px-10 gap-8">
                {colors.map((color) => (
                    <div className="w-full">
                        <div style={{ backgroundColor: `${ color.hexCode || "#000"} ` }} className="h-20 w-full"></div>
                        <div className="flex justify-between w-full">
                            <p>{GetColorName(color.hexCode)}</p>
                            <p>{color.hexCode.toUpperCase()}</p>
                        </div>
                    </div>
                ))}
                {/* <div className="w-full">
                    <div style={{ backgroundColor: `${ project.color } ` }} className="h-20 w-full"></div>
                    <div className="flex justify-between w-full">
                        <p>{project.color}</p>
                        <p>{GetColorName((project.color!.substring(1)))}</p>
                    </div>
                </div> */}
            </div>
            <div className="w-full flex items-center justify-center">
                <img src={organizedLogos.full_logo.color} width={350} height={200} alt={project.projectName} />

            </div>
        </div>
    );
}
