import Image from "next/image";
import { $notes, $projects, $logos } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { GetColorName } from 'hex-color-to-color-name';


interface ShowcaseProps {
    projectId: number | string;
}

export default async function Showcase({ projectId }: ShowcaseProps) {
    // Import projects
    const numProjectId = Number(projectId);
    if (isNaN(numProjectId)) {
        throw new Error('Invalid Project ID');
    }
    const projects = await db.select().from($projects).where(eq($projects.id, numProjectId));
    const project = projects[0];  // Assuming you're getting one project

    const logoIds = projects.map(p => p.logoId);

    // Import logos
    const logos = await db.select().from($logos);
    const relevantLogos = logos.filter(logo => logoIds.includes(logo.id));

    const projectLogo = relevantLogos[0];  // Assuming each project has one logo

    return (
        <div className="w-full">
            <div className="header flex h-3/5 justify-center items-center p-20" style={{
                // backgroundImage: `url(${projectLogo.whiteLogo!})`,
                // backgroundSize: "cover",
                // backgroundPosition: "top",
                backgroundColor: `${project.color}`
            }}>
                <img src={projectLogo.whiteLogo!} alt={project.projectName} width={50} height={50} />
            </div>
            <div className="monochrome_logos flex">
                <div className="bg-white h-full w-1/2 flex justify-center items-center p-20">
                    {/* Replace with your black logo from the database */}
                    <img src={projectLogo.blackLogo!} width={50} height={50} alt={project.projectName} />
                </div>
                <div className="bg-black w-1/2 flex justify-center items-center p-20">
                    {/* Replace with your white logo from the database */}
                    <img src={projectLogo.whiteLogo!} width={50} height={50} alt={project.projectName} style={{ fill: "#fff" }} />
                </div>
            </div>
            {/* The typography section seems static. If there are dynamic values in your database, they need to be replaced accordingly */}
            <div className="typography flex p-20 gap-8">
                <div>
                    <h2 className="text-9xl font-semibold">Aa</h2>
                </div>
                <div>
                    <h3 className="text-4xl font-semibold">Inter</h3>
                    <p>
                        ABCDEFGHIJKLMNOPQRSTUVWXYZ
                        abcdefghijklmnopqrstvwxyz
                        0123456789!”#$%&/()@=?,-
                    </p>
                </div>
            </div>
            {/* Assuming the colors are project-specific and stored in your database */}
            <div className="colors flex w-full justify-evenly px-10 gap-8">
                {/* {project.colors.map((color) => (
                    <div className="w-full">
                        <div style={{ backgroundColor: `${color.color}` }} className="h-20 w-full"></div>
                        <div className="flex justify-between w-full">
                            <p>{color.name}</p>
                            <p>{color.color}</p>
                        </div>
                    </div>
                ))} */}
                    <div className="w-full">
                        <div style={{ backgroundColor: `${project.color}` }} className="h-20 w-full"></div>
                        <div className="flex justify-between w-full">
                            <p>{project.color}</p>
                            <p>{GetColorName((project.color!.substring(1)))}</p>
                            {/* <p>{color.color}</p> */}
                        </div>
                    </div>
            </div>
        </div>
    );
}
