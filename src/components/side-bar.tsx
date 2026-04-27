"use client";

import FolderGroup from "./folder-group";
import Logo from "./icons/logo";
import SearchIcon from "./icons/search-icon";
import UserIcon from "./icons/user-icon";

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
  setFile: (id: number) => void;
}

export default function SideBar({
  folders,
  files,
  selectedFile,
  setFile,
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
        />
      );
    }
  });

  return (
    <div className="side-bar">
      <div className="header-container">
        <div className="logo">
          <Logo />
          <UserIcon />
        </div>
        <SearchIcon />
      </div>
      <div className="explorer">{renderFolders}</div>
    </div>
  );
}
