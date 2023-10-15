"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PlusIcon, PhotoIcon } from '@heroicons/react/20/solid'
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generateBWVersions } from '@/lib/svgColorChanger'
import { fileToSVGString } from "@/lib/svgProcessor";
import { clerk } from "@/lib/clerk-server";
import { auth } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
// import generatePNG from "@/lib/sharp"
// const sharp = require('sharp');


type Props = {};

type CreateProjectData = {
  projectName: string;
  originalUrl: string;
  blackUrl: string;
  whiteUrl: string;
  color: any;
};

const createProject = async (data: CreateProjectData) => {
  const response = await fetch('/api/createProject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const CreateProjectDialog: React.FC<Props> = (props: Props) => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [color, setOriginalColor] = useState<any>("");
  const userId = useUser().user?.id


  const createProjectMutation = useMutation(createProject, {
    onSuccess: (data) => {
      console.log("created new project:", data);
      router.push(`/project/${data.project_id}`);
    },
    onError: (error) => {
      console.error('There was a problem with the fetch operation:', error);
    }
  });

  // const addLogosMutation = useMutation(addLogos, {
  //   onSuccess: (data) => {
  //     console.log("Added logos:", data);
  //   },
  //   onError: (error) => {
  //     console.error('There was a problem saving the logos:', error);
  //   }
  // });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    type VersionType = 'original' | 'black' | 'white';
    type FileType = 'svg' | 'pdf' | 'png' | 'jpg';

    e.preventDefault();

    if (!file) {
      window.alert("Please select a file to upload");
      return;
    }

    try {
      const svgString = await fileToSVGString(file);
      console.log(svgString);

      // Generate black and white versions
      const { original, black, white, extractedColor } = await generateBWVersions(svgString);

      // const { userId } = auth();
      setOriginalColor(extractedColor);

      const uploadSVGAndGetURL = async (svgContent: BlobPart, version: VersionType, type: FileType) => {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const storageRef = ref(storage, `${userId}/${input}/${version}_icon.${type}`);
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
      };

      // const uploadPNGandGetURL = async (pngContent: Buffer, version: VersionType, type: FileType) => {
      //   // const blob = new Blob([pngContent], { type: 'image/png' });
      //   const storageRef = ref(storage, `${userId}/${input}/${version}_icon.${type}`);
      //   await uploadBytes(storageRef, pngContent);
      //   return await getDownloadURL(storageRef);
      // };

      // // const orignalPNG = await sharp(Buffer.from(original)).toFile('original.png');
      // const originalPNGBuffer = await sharp(Buffer.from(original)).toBuffer();

      // const originalPngURL = await uploadPNGandGetURL(originalPNGBuffer, 'original', 'png');
      // console.log("originalPngURL: ", originalPngURL);


      // Upload SVGs and get URLs
      const originalUrl = await uploadSVGAndGetURL(original, 'original', 'svg');
      const blackUrl = await uploadSVGAndGetURL(black, 'black', 'svg');
      const whiteUrl = await uploadSVGAndGetURL(white, 'white', 'svg');

      console.log("color ", extractedColor)
      await createProjectMutation.mutateAsync({
        projectName: input,
        originalUrl,  // Include the SVG URLs
        blackUrl,
        whiteUrl,
        color: extractedColor
      });



    } catch (error) {
      console.error('Upload failed:', error);
      window.alert('Failed to upload the image. Please try again.');
    }
  };



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New Project
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-gray-200">New Project</DialogTitle>
          <DialogDescription className="text-gray-500">
            Upload your logos, then sit back and relax
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-300 mb-2">
            Project Name
          </label>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="My Superfun Project"
            className="bg-gray-800 border-gray-900"
          />
          <div className="col-span-full">
            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-300 my-2">
              Logo Icon
            </label>
            {/* <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      onChange={handleFileChange}
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".svg"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">SVG files only</p>
              </div>
            </div> */}
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-500"><span className="font-semibold text-indigo-500">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">SVG files only</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange}
                  name="file-upload"
                  accept=".svg" />
                <p className="text-sm text-gray-400">{file?.name}</p>
              </label>
            </div>
          </div>
          <div className="h-4"></div>
          <div className="flex gap-2">
            <Button type="reset" variant={"ghost"} className="text-gray-500">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600"
            // onSubmit={handleSubmit}
            // Disabled this for now as the mutation isn't fully integrated
            //disabled={createNotebook.isLoading}
            >
              {/* Uncomment this once you integrate the mutation logic */}
              {/* {createNotebook.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )} */}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
