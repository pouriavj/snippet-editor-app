"use client";

import useFileSelect from "@/hooks/useFileSelect";
import MyEditor from "./my-editor";
import SideBar from "./side-bar";
import { useState } from "react";
import useFormAction from "@/hooks/useFormAction";

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

export type ItemToAdd = "none" | "folder" | "file";

export default function ClientContainer({
  folders,
  files,
}: CilentContainerProps) {
  // useFileSelect custom hook initialize, Select delete edit selected files in editor tool-bar and as active files in side bar (Generic reusable hook)
  const {
    selectedFile,
    setFile,
    fileArray,
    deleteFile,
    setFolder,
    selectedFolder,
    renameFile,
  } = useFileSelect();

  // useFormAction custom hook init
  const formActions = useFormAction();

  const [isAddingItem, setIsAddingItem] = useState<ItemToAdd>("none"); // Manage visibility of folder/file input
  const [newFolderArray, setNewFolderArray] = useState(folders); // Makes new folder array to contains a mock child folder input for better Ui vs-code style
  const [newFileArray, setNewFileArray] = useState(files); // Makes new file array to contains a mock child file input for better Ui vs-code style
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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

  const addMockInput = (itemType: ItemToAdd): void => {
    if (itemType === "folder") {
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
      setIsAddingItem("folder");
    } else if (itemType === "file") {
      setNewFileArray((prevValue) => {
        const filesWithoutInput = prevValue.filter((f) => f.user_id !== -1);
        return [
          ...filesWithoutInput,
          {
            id: newFileArray.length + 1,
            name: "input",
            user_id: -1,
            folder_id: selectedFolder === 0 ? null : selectedFolder,
            content: "",
          },
        ];
      });
      setIsAddingItem("file");
    }
  };

  const addMockRenameInput = (itemType: ItemToAdd): void => {
    if (itemType === "folder") {
      setNewFolderArray((prevValue) => {
        const foldersWithoutInput = prevValue.filter((f) => f.user_id !== -1);
        return foldersWithoutInput.map((folder) => {
          if (folder.id === selectedFolder) {
            return {
              id: folder.id,
              name: folder.name,
              user_id: -2,
              folder_id: folder.folder_id,
            };
          } else {
            return folder;
          }
        });
      });
      setIsAddingItem("folder");
    }
    if (itemType === "file") {
      setNewFileArray((prevValue) => {
        const filesWithoutInput = prevValue.filter((f) => f.user_id !== -1);
        return filesWithoutInput.map((file) => {
          if (file.id === selectedFile) {
            return {
              id: file.id,
              name: file.name,
              user_id: -2,
              folder_id: file.folder_id,
              content: "",
            };
          } else {
            return file;
          }
        });
      });
      setIsAddingItem("file");
    }
  };

  const cancelInput = (inputType: ItemToAdd): void => {
    if (inputType === "folder") {
      // Remove the temporary folder object from the state
      setNewFolderArray(folders);
      setIsAddingItem("none"); // Set state to false
    } else if (inputType === "file") {
      // Remove the temporary file object from the state
      setNewFileArray(files);
      setIsAddingItem("none"); // Set state to false
    }
    setIsPopupOpen(false);
  };

  const handleGlobalClick = () => {
    // If the folder/file input is active AND the click target is NOT inside the input row, cancel.
    // The SideBar's stopPropagation will prevent this if the click IS inside the input.
    if (isAddingItem === "folder") {
      cancelInput("folder");
      setIsAddingItem("none");
    } else if (isAddingItem === "file") {
      cancelInput("file");
      setIsAddingItem("none");
    } else if (isPopupOpen) {
      setIsPopupOpen(false);
    }
  };

  return (
    <div className="main-container" onClick={handleGlobalClick}>
      <SideBar
        folders={newFolderArray || folders}
        files={newFileArray || files}
        selectedFile={selectedFile}
        setFile={setFile}
        setFolder={setFolder}
        selectedFolder={selectedFolder}
        addMockInput={addMockInput}
        isAddingItem={isAddingItem}
        formActions={formActions}
        cancelInput={cancelInput}
        deleteFile={deleteFile}
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        addMockRenameInput={addMockRenameInput}
        renameFile={renameFile}
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
        editFileAction={formActions.edit.file}
      />
    </div>
  );
}
