"use client";

import FolderGroup from "./folder-group";
import AddFileIcon from "./icons/add-file-icon";
import AddFolderIcon from "./icons/add-folder-icon";
import Logo from "./icons/logo";
import SearchIcon from "./icons/search-icon";
import UserIcon from "./icons/user-icon";
import NewFolderInput from "./new-folder-input";

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
  submitAction: (formData: FormData) => void;
  isPending: boolean;
  formState: {
    message: string | null;
  };
  cancelFolderInput: () => void;
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
  submitAction,
  isPending,
  formState,
  cancelFolderInput,
}: SideBarProps) {
  // Fetch folder group childern on nested child folder call
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
    const rootUserId =
      folders.find((f) => f.folder_id === null && f.user_id !== -1)?.user_id ||
      null;
    // Ui input for adding a folder , catching special folder with user_id = -1
    if (folder.user_id === -1 && folder.folder_id == null) {
      return (
        // Mock folder input
        <NewFolderInput
          key={-1}
          submitAction={submitAction}
          cancelFolderInput={cancelFolderInput}
          isPending={isPending}
          formState={formState}
          rootUserId={rootUserId}
        />
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
          submitAction={submitAction}
          cancelFolderInput={cancelFolderInput}
          isPending={isPending}
          formState={formState}
          rootUserId={rootUserId}
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
        onMouseDown={(e) => {
          handleParentClick(e);
        }}
      >
        <div className="explorer">{renderFolders}</div>
      </div>
    </div>
  );
}
