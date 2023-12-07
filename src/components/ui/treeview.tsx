'use client';
import React, { useEffect, useState } from "react";
import { Box, TreeView } from '@primer/react';
import { FileIcon } from 'lucide-react';
import { Button } from './button';
import { storage } from '@/lib/firebase'; // Assuming this is where you've initialized firebase
import { listAll, getStorage, ref, getDownloadURL } from "firebase/storage";

const FileTreeView = ({ category, files, onFileClick }: any) => {
  console.log("Wordmark Files:", files);

  return (
    <TreeView.SubTree>
      <TreeView.Item id={`projectName/${category}`} current defaultExpanded={true}>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        {category}
        <TreeView.SubTree>
          {files.map((file: any) => (
            <TreeView.Item id={`src/${category}/${file}`} key={`${category},${file}`}>
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onFileClick(file.url);
                }}
              >
                {file.name}
              </a>
            </TreeView.Item>
          ))}
        </TreeView.SubTree>
      </TreeView.Item>
    </TreeView.SubTree>
  );
};

const fetchFilesFromFirebase = async (folderPath: string) => {
  const folderRef = ref(storage, folderPath);  // Create a reference to the folder

  try {
    const result = await listAll(folderRef);  // List all files in that folder
    const files = await Promise.all(result.items.map(async fileRef => {
      const url = await getDownloadURL(fileRef);
      return {
        name: fileRef.name,
        url: url
      };
    }));
    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}

const DirectoryTreeView = ({ userId, projectName }: { userId: string, projectName: string }) => {
  // Change useState initialization types to arrays of objects
  const [fullLogoFiles, setFullLogoFiles] = useState<{ name: string, url: string }[]>([]);
  const [monogramFiles, setMonogramFiles] = useState<{ name: string, url: string }[]>([]);
  const [wordmarkFiles, setWordmarkFiles] = useState<{ name: string, url: string }[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      const categories = ["Full Logo", "Monogram", "Wordmark"];

      const allFiles: any = await Promise.all(categories.map(cat => fetchFilesFromFirebase(`${userId}/${projectName}/${cat}/`)));

      // Flatten the array and categorize files
      const fullLogo: any[] = [];
      const monogram: any[] = [];
      const wordmark: any[] = [];

      allFiles.flat().forEach((file: any) => {
        const [version, category] = file.name.split('_');
        if (category.startsWith('full logo')) fullLogo.push(file);
        else if (category.startsWith('monogram')) monogram.push(file);
        else if (category.startsWith('wordmark')) wordmark.push(file);
      });

      setFullLogoFiles(fullLogo);
      setMonogramFiles(monogram);
      setWordmarkFiles(wordmark);
    };

    fetchData();
  }, [userId, projectName]);

  console.log("Full Logo Files:", fullLogoFiles);
  console.log("Monogram Files:", monogramFiles);

  return (
    <div className="h-full bg-gray-950">
      <div className='p-10 h-3/4 overflow-y-scroll'>
        <div className='flex justify-between items-start'>
          <h2 className='text-2xl text-gray-100 font-semibold mb-4'>File Structure</h2>
          <Button type="submit" className="bg-indigo-600">
            Download .zip
          </Button>
        </div>
        <Box sx={{ maxWidth: 400, alignSelf: 'flex-start' }} className='text-white'>
          <nav aria-label="Files" >
            <TreeView aria-label="Files">
              <TreeView.Item id="projectName" defaultExpanded={true}>
                <TreeView.LeadingVisual>
                  <TreeView.DirectoryIcon />
                </TreeView.LeadingVisual>
                {projectName}
                <FileTreeView category="Monogram" files={monogramFiles} onFileClick={setSelectedImageUrl} />
                <FileTreeView category="Full Logo" files={fullLogoFiles} onFileClick={setSelectedImageUrl} />
                <FileTreeView category="Wordmark" files={wordmarkFiles} onFileClick={setSelectedImageUrl} />
              </TreeView.Item>
            </TreeView>
          </nav>
        </Box>
      </div>
      <div className="h-1/4">
        {selectedImageUrl && (
          <div className="flex justify-center items-center w-full h-full pattern-rectangles pattern-gray-100 pattern-bg-white pattern-opacity-100 pattern-size-8 \">
            <img src={selectedImageUrl} alt="Selected file" width={100} style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
      </div>
    </div>
  );
}


export default DirectoryTreeView;


