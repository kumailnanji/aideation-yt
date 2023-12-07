// 'use client';
import DeleteButton from "@/components/DeleteButton";
import TipTapEditor from "@/components/TipTapEditor";
import { Button } from "@/components/ui/button";
import { clerk } from "@/lib/clerk-server";
import { db } from "@/lib/db";
import { $projects } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { SQLWrapper, and, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { useState } from "react";
import { useQuery } from 'react-query';
import Image from "next/image";
import Showcase from "@/components/showcase";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import DirectoryTreeView from "@/components/ui/treeview";
import ShareButton from "@/components/ui/shareButton";
import ProjectSidebar from "@/components/ui/projectSidebar";


type Props = {
    searchParams: {
        projectId: number;
        type: string;
        t: string; //Viewer User Id
    };
};



const ProjectPage = async ({ searchParams: { projectId, type, t } }: Props) => {
    console.log("projectId", type)

    // const ProjectPage = async ({ params: { projectId } }: Props) => {
    // const [imageSrc, setImageSrc] = useState($projects.imageUrl);
    // const [viewerMode, setViewerMode] = useState(false);
    // let userId:any;
    let viewerMode = false;
    // const viewerType = type;

    // console.log("$projects.imageUrl: ",$projects)

    // if (type === "editor") {
    //     viewerMode = false;
    // } else if (type === "viewer") {
    //     viewerMode = true;
    // }
    let userId;
    let viewerUserId = "user_" + t;
    console.log("viewerUserId: ", viewerUserId)


    console.log("type-> ", type);
    // const projectId = id;
    // console.log(userId)

    if (type === "editor") {
        const id = await auth();
        userId = id.userId
        // userId = await auth();
        // console.log("userId: ", userId)
        if (!userId) {
            return redirect("/dashboard");
            console.log(userId)
        }
    } else {
        viewerMode = true;
    }

    const projects = await db
        .select()
        .from($projects)
        .where(and(eq($projects.id, projectId), eq($projects.userId, userId || viewerUserId)));

    if (projects.length != 1) {
        // return redirect("/dashboard");
        console.log(userId)

    }
    const project = projects[0];

    return (
        <div className="flex flex-col min-h-screen overflow-y-clip ">
            <div className={`flex  ${viewerMode ? "h-0" : "h-[8vh]"}`}>
                {viewerMode ? (
                   ""
                ) :
                    <Header projectName={project.projectName} userId={userId} projectId={projectId} type={"editor"} />

                }
            </div>

            <div className={`relative flex flex-grow sm:flex-row flex-col  ${viewerMode ? "h-[100vh]" : "h-[92vh]"}`}>
                {viewerMode ? (
                    ""
                ) : <div className="max-h-screen flex flex-grow w-fit flex-1">
                    <ProjectSidebar />
                </div>}
                <div className="tree max-h-screen flex-2 sm:w-2/5 w-full sm:overflow-y-auto bg-gray-950">
                    <DirectoryTreeView userId={userId || viewerUserId} projectName={project.projectName} />
                </div>
                <div className={`showcase max-h-screen flex-3 flex-grow overflow-y-scroll ${viewerMode ? "w-full sm:w-3/5" : "w-2/5"}`}>
                    <Showcase projectId={projectId} />
                    {/* <Modal /> */}
                </div>
            </div>
        </div >
    );
};


export default ProjectPage;
