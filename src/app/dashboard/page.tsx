// 'use client';
import CreateNoteDialog from "@/components/CreateNoteDialog";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import Create from "@/components/CreateNoteDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { drizzle } from "drizzle-orm/neon-http";
// import { $projects, $logos, $users, $logo_types, $logo_variants, usersRelations, projectsRelations, logosRelations } from "@/lib/db/schema";
import * as schema from "@/lib/db/schema"
import { UserButton, auth } from "@clerk/nextjs";
import { eq, sql } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/ui/sidebar"
import { PlusIcon } from '@heroicons/react/20/solid'
import React, { useState, useEffect } from 'react';
import Dropdown from "@/components/ui/dropdown"
import { getProjects } from "@/lib/db-query";



type Props = {};

function timeAgo(createdAt: any) {
  const now = new Date().getTime(); // Get time in milliseconds
  const createdDate = new Date(createdAt).getTime(); // Get time in milliseconds
  const diffInSeconds = Math.floor((now - createdDate) / 1000);

  const mins = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  }
}

const DashboardPage = async (props: Props) => {

  const { userId } = auth();
  var logos;

  const projects = await getProjects(userId)
  const projectIds = projects.map(p => p.id);

  if (projectIds.length > 0) {
    const projectIdsString = `{${projectIds.join(',')}}`;
    logos = await db
      .select()
      .from(schema.$logos)
      .where(sql`${schema.$logos.projectId} = ANY(${projectIdsString}::integer[])`);
  } else {
    console.log('No projects found for this user.');
  }

  const whiteMonogramLogos = logos!.filter(logo =>
    logo.logoTypeId === 1 && logo.logoVariantId === 3
  );

  return (
    <div className="bg-gray-950">

      <div className="flex flex-row bg-gray-950  h-screen">
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <Sidebar />
        </div>
        <main className="py-10 lg:pl-72 w-full">

          <div className="px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex end justify-between items-center w-full mb-8 ">
              <h1 className="text-2xl font-bold text-gray-300">My Projects</h1>
              <CreateProjectDialog />
            </div>

            {/* If no projects exist */}
            {projects.length === 0 && (

              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-300">No projects</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                <div className="mt-6">
                  <Link
                    href="#"
                    type="button"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    New Project
                  </Link>
                </div>
              </div>
            )}
            {/* END - If no projects exist */}

            {/* If projects exist */}
            <ul role="list" className="grid gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8 grid-cols-[repeat(auto-fill,minmax(272px,1fr))]">
              {/* 
                Taken From Figma            
                  display: grid;
                  grid-template-columns: repeat(auto-fill,minmax(272px,1fr));
                  grid-gap: 32px 32px; 
              */}
              {projects.map((project, index) => (
                <div>
                  <li key={index} className="relative">
                    <Link href={{
                      pathname: `/project/${project.projectName}`,
                      query: { projectId: project.id, type: "editor" }
                    }}> {/* Example route */}
                      {/* <Link href={`/project/${project.id}`}>  */}
                      <div className="group min-h-[15vh] w-full overflow-hidden flex items-center reverse justify-center p-10 rounded-lg bg-gray-900 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 hover:translate-y-[-5px] transition duration-100 ease-linear cursor-pointer">
                        {whiteMonogramLogos.filter(logo => logo.projectId === project.id).map((logo) => (
                          <img src={logo.url!} alt="logo" key={logo.id} width={50}></img>
                        ))}
                        {/* <img src={project.source} alt="" className="pointer-events-none object-cover group-hover:opacity-75" /> */}
                        <button type="button" className="absolute inset-0 focus:outline-none">
                          <span className="sr-only">View details for {project.projectName}</span>
                        </button>
                      </div>
                    </Link>
                    <div className="flex flex-row justify-between w-full">
                      <div>
                        <p className="pointer-events-none mt-2 block truncate text-sm font-large font-semibold text-gray-300">{project.projectName}</p>
                        <p className="pointer-events-none block text-xs font-medium text-gray-500">Created {timeAgo(project.createdAt)}</p>
                      </div>
                      <div>
                        <Dropdown projectId={project.id}/>
                      </div>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
            {/* END - If projects exist */}

          </div>
        </main>
      </div >
    </div >
  );
};

export default DashboardPage;
