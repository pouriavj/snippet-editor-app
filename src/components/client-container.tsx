"use client";

import useFileSelect from "@/hooks/useFileSelect";
import MyEditor from "./my-editor";
import SideBar from "./side-bar";
import { useState } from "react";

interface CilentContainerProps {
  folders: {
    id: number;
    name: string;
    user_id: number | null;
    folder_id: number | null;
  }[];
  files: {
    id: number;
    name: string;
    user_id: number | null;
    folder_id: number | null;
    content: string | null;
  }[];
}

export default function ClientContainer({
  folders,
  files,
}: CilentContainerProps) {
  const {
    selectedFile,
    setFile,
    fileArray,
    deleteFile,
    setFolder,
    selectedFolder,
  } = useFileSelect();
  const [isAddingFolder, setIsAddingFolder] = useState(false); // Manage visibility of folder input
  const [newFolderArray, setNewFolderArray] = useState(folders);

  const selectedSnippet = files.find((file) => {
    return file.id === selectedFile;
  });
  const fetchParentFolder = (id: number) => {
    const foundFile = files.find((file) => {
      return file.id === id;
    });
    if (foundFile?.folder_id) {
      return foundFile.folder_id;
    } else {
      return 0;
    }
  };

  const addFolderInput = () => {
    setNewFolderArray((prevValue) => {
      const foldersWithoutInput = prevValue.filter((f) => f.user_id !== -1);
      return [
        ...foldersWithoutInput,
        {
          id: newFolderArray.length + 1,
          name: "input",
          user_id: -1,
          folder_id: selectedFolder === 0 ? null : selectedFolder,
        },
      ];
    });
    setIsAddingFolder(true);
  };

  const cancelFolderInput = () => {
    // Remove the temporary folder object from the state
    setNewFolderArray(folders);
    setIsAddingFolder(false); // Set state to false
  };

  const handleGlobalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the folder input is active AND the click target is NOT inside the input row, cancel.
    // The SideBar's stopPropagation will prevent this if the click IS inside the input.
    if (isAddingFolder) {
      cancelFolderInput();
      setIsAddingFolder(false);
    }
  };

  return (
    <div className="main-container" onClick={handleGlobalClick}>
      <SideBar
        folders={newFolderArray || folders}
        files={files}
        selectedFile={selectedFile}
        setFile={setFile}
        setFolder={setFolder}
        selectedFolder={selectedFolder}
        addFolderInput={addFolderInput}
        isAddingFolder={isAddingFolder}
        cancelFolderInput={cancelFolderInput}
      />
      <MyEditor
        snippet={{
          id: selectedSnippet?.id,
          name: selectedSnippet?.name,
          code: selectedSnippet?.content,
        }}
        fileArray={fileArray}
        setFile={setFile}
        deleteFile={deleteFile}
        setFolder={setFolder}
        fetchParentFolder={fetchParentFolder}
      />
    </div>
  );
}
