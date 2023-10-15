// 'use client';
import DeleteButton from "@/components/DeleteButton";
import TipTapEditor from "@/components/TipTapEditor";
import { Button } from "@/components/ui/button";
import { clerk } from "@/lib/clerk-server";
import { db } from "@/lib/db";
import { $notes, $projects } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { useQuery } from 'react-query';
import Image from "next/image";
import Showcase from "@/components/showcase";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import DirectoryTreeView from "@/components/ui/treeview";


type Props = {
    params: {
        projectId: string;
    };
};

const ProjectPage = async ({ params: { projectId } }: Props) => {
    // const [imageSrc, setImageSrc] = useState($projects.imageUrl);

    // console.log("$projects.imageUrl: ",$projects)

    const { userId } = await auth();
    if (!userId) {
        return redirect("/dashboard");
    }
    const user = await clerk.users.getUser(userId);
    const projects = await db
        .select()
        .from($projects)
        .where(and(eq($projects.id, parseInt(projectId)), eq($projects.userId, userId)));

    if (projects.length != 1) {
        return redirect("/dashboard");
    }
    const project = projects[0];

    return (
        // <div className="min-h-screen grainy p-8">
        //   <div className="max-w-4xl mx-auto">
        //     <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
        //       <Link href="/dashboard">
        //         <Button className="bg-green-600" size="sm">
        //           Back
        //         </Button>
        //       </Link>
        //       <div className="w-3"></div>
        //       <span className="font-semibold">
        //         {user.firstName} {user.lastName}
        //       </span>
        //       <span className="inline-block mx-1">/</span>
        //       <span className="text-stone-500 font-semibold">{project.projectName}</span>
        //       <img src={project.imageUrl!} alt="logo" className="fill-black"/>

        //       {/* <div className="ml-auto">
        //         <DeleteButton noteId={project.id} />
        //       </div> */}
        //     </div>

        //     <div className="h-4"></div>
        //     {/* <div className="border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full">
        //       <TipTapEditor note={project} />
        //     </div> */}
        //   </div>
        // </div>
        <div className="">
            <Header projectName={project.projectName} />
            <div className="flex overflow-y-hidden">
                <Sidebar/>
                <div className="showcase w-2/5 h-screen bg-gray-950 ">
                    <DirectoryTreeView userId={userId} projectName={project.projectName}/>
                </div>
                <div className="showcase w-2/5">
                    <Showcase projectId={projectId} />
                    {/* <Modal /> */}
                </div>
            </div>
        </div>
    );
};


export default ProjectPage;
