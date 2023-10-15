'use client';
import React, { useEffect, useState } from "react";
import { Box, TreeView } from '@primer/react';
import { FileIcon } from 'lucide-react';
import { Button } from './button';
import { storage } from '@/lib/firebase'; // Assuming this is where you've initialized firebase
import { listAll, getStorage, ref } from "firebase/storage";


const fetchFilesFromFirebase = async (folderPath: string) => {
  const folderRef = ref(storage, folderPath);  // Create a reference to the folder

  try {
    const result = await listAll(folderRef);  // List all files in that folder
    return result.items.map(fileRef => fileRef.name);
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}

const DirectoryTreeView = ({ userId, projectName }: { userId: string, projectName: string }) => {
  const [fileNames, setFileNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const files = await fetchFilesFromFirebase(`${userId}/${projectName}`);
      setFileNames(files);
    };
    fetchData();
  }, [userId, projectName]);


  return (
    <div className='p-10'>
      <div className='flex justify-between'>
        <h2 className='text-2xl text-gray-100 font-semibold mb-4'>File Structure</h2>
        <Button type="submit" className="bg-indigo-600">
          Download .zip
        </Button>
      </div>
      <Box sx={{ maxWidth: 400 }} className='text-white'>
        <nav aria-label="Files" >
          <TreeView aria-label="Files">
            <TreeView.Item id="projectName" defaultExpanded={true}>
              <TreeView.LeadingVisual>
                <TreeView.DirectoryIcon />
              </TreeView.LeadingVisual>
              {projectName}
              <TreeView.SubTree>
                <TreeView.Item id="projectName/Monogram" current defaultExpanded={true}>
                  <TreeView.LeadingVisual>
                    <TreeView.DirectoryIcon />
                  </TreeView.LeadingVisual>
                  Monogram
                  <TreeView.SubTree>
                    {fileNames.map((file) => (

                      <TreeView.Item id="src/Monogram/Button.tsx" key={file}>
                        <TreeView.LeadingVisual>
                          <FileIcon />
                        </TreeView.LeadingVisual>
                        {file}
                      </TreeView.Item>
                    ))}
                  </TreeView.SubTree>
                </TreeView.Item>
              </TreeView.SubTree>
            </TreeView.Item>
          </TreeView>
        </nav>
      </Box>
    </div>
  );
}

export default DirectoryTreeView;
