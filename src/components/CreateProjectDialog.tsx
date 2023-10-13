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



type Props = {};

const createProject = async (data: { projectName: string; imageUrl: string }) => {
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

  const createProjectMutation = useMutation(createProject, {
    onSuccess: (data) => {
      console.log("created new project:", data);
      router.push(`/project/${data.project_id}`);
    },
    onError: (error) => {
      console.error('There was a problem with the fetch operation:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      window.alert("Please select a file to upload");
      return;
    }

    
    const fileRef = ref(storage, `images/${file.name}`);
    try {
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      console.log('File available at', url);
      createProjectMutation.mutate({
        projectName: input,
        imageUrl: url,
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
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
            Project Name
          </label>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="My Superfun Project"
          />
          <div className="col-span-full">
            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
              Logo
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
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
            </div>
          </div>
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button type="reset" variant={"secondary"}>
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
