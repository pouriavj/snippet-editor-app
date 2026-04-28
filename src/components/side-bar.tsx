"use client";

import FolderGroup from "./folder-group";
import AddFileIcon from "./icons/add-file-icon";
import AddFolderIcon from "./icons/add-folder-icon";
import ClosedFolderIcon from "./icons/closed-folder-icon";
import Logo from "./icons/logo";
import SearchIcon from "./icons/search-icon";
import UserIcon from "./icons/user-icon";
import * as actions from "@/actions";

interface SideBarProps {
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
  selectedFile: number;
  setFile: (id: number, name: string) => void;
  setFolder: (id: number) => void;
  selectedFolder: number;
  addFolderInput: () => void;
  isAddingFolder: boolean; // To know if the input UI is visible
  cancelFolderInput: () => void; // Function to hide the input UI
}

export default function SideBar({
  folders,
  files,
  selectedFile,
  setFile,
  setFolder,
  selectedFolder,
  addFolderInput,
  isAddingFolder,
  cancelFolderInput,
}: SideBarProps) {
  const folderGroupChildren = (folderId: number | null) => {
    const childFolders = folders.filter((folder) => {
      return folder.folder_id === folderId;
    });
    const childFiles = files.filter((file) => {
      return file.folder_id === folderId;
    });
    return { childFolders, childFiles };
  };

  const renderFolders = folders.map((folder) => {
    // Ui input for adding a folder , catching special folder with user_id = -1
    if (folder.user_id === -1 && folder.folder_id == null) {
      return (
        <div
          key={folder.id}
          className="folder-title"
          style={{ marginLeft: 28 }}
          // Stop propagation so clicks inside this div don't trigger the global handler in ClientContainer
          onClick={(e) => e.stopPropagation()}
        >
          <ClosedFolderIcon />
          <input type="text" autoFocus />
          <button>Save</button>
        </div>
      );
    }

    if (folder.folder_id == null) {
      return (
        <FolderGroup
          key={folder.id}
          id={folder.id}
          name={folder.name}
          findChildren={folderGroupChildren}
          selectedFile={selectedFile}
          setFile={setFile}
          setFolder={setFolder}
          selectedFolder={selectedFolder}
        />
      );
    }
  });

  const handleParentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    // Only runs when the parent itself is clicked, not any child
    if (e.target === e.currentTarget) {
      setFolder(0);
    }
  };

  const handleAddFolder = () => {
    
    addFolderInput();
  };

  return (
    <div className="side-bar">
      <div className="header-container">
        <div className="logo">
          <Logo />
          <UserIcon />
        </div>
        <SearchIcon />
      </div>
      <div className="create-buttons">
        <div className="button">
          <AddFileIcon />
        </div>
        {!isAddingFolder && (
          <div className="button" onClick={handleAddFolder}>
            <AddFolderIcon />
          </div>
        )}
      </div>
      <div
        style={{ height: "100%" }}
        // Add onMouseDown instead of onClick, and ensure it only calls cancel if needed
        onMouseDown={(e) => {
          if (isAddingFolder) {
            cancelFolderInput();
          }

          handleParentClick(e);
        }}
      >
        <div className="explorer">{renderFolders}</div>
      </div>
    </div>
  );
}
