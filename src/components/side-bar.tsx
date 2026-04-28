"use client";

import FolderGroup from "./folder-group";
import AddFileIcon from "./icons/add-file-icon";
import AddFolderIcon from "./icons/add-folder-icon";
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
}

export default function SideBar({
  folders,
  files,
  selectedFile,
  setFile,
  setFolder,
  selectedFolder,
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
        <div className="button">
          <AddFolderIcon />
        </div>
      </div>
      <div onClick={handleParentClick} style={{ height: "100%" }}>
        <div className="explorer">{renderFolders}</div>
      </div>
    </div>
  );
}
