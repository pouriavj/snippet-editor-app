"use client";

import FolderGroup from "./folder-group";
import AddFileIcon from "./icons/add-file-icon";
import AddFolderIcon from "./icons/add-folder-icon";
import Logo from "./icons/logo";
import SearchIcon from "./icons/search-icon";
import UserIcon from "./icons/user-icon";
import NewFolderInput from "./new-folder-input";
import type { ItemToAdd } from "./client-container";
import FileIcon from "./icons/file-icon";
import NewFileInput from "./new-file-input";
import EllipsisIcon from "./icons/ellipsis-icon";
import EllipsisHandler from "./ellipsis-handler";

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
  addMockInput: (inputType: ItemToAdd) => void;
  isAddingItem: ItemToAdd; // To know if the input UI is visible

  formActions: {
    create: ItemAction;
    edit: ItemAction;
    delete: ItemAction;
  };
  cancelInput: (inputType: ItemToAdd) => void;
}

export type ItemAction = {
  folder: {
    formState: {
      message: string | null;
    };
    submitAction: (formData: FormData) => void;
    isPending: boolean;
  };
  file: {
    formState: {
      message: string | null;
    };
    submitAction: (formData: FormData) => void;
    isPending: boolean;
  };
};

export default function SideBar({
  folders,
  files,
  selectedFile,
  setFile,
  setFolder,
  selectedFolder,
  addMockInput,
  isAddingItem,
  formActions,
  cancelInput,
}: SideBarProps) {
  const rootUserId =
    folders.find((f) => f.folder_id === null && f.user_id !== -1)?.user_id ||
    null;
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
    // Ui input for adding a folder , catching special folder with user_id = -1
    if (folder.user_id === -1 && folder.folder_id == null) {
      return (
        // Mock folder input
        <NewFolderInput
          key={-1}
          submitAction={formActions.create.folder.submitAction}
          cancelInput={cancelInput}
          isPending={formActions.create.folder.isPending}
          formState={formActions.create.folder.formState}
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
          formActions={formActions}
          cancelInput={cancelInput}
          rootUserId={rootUserId}
        />
      );
    }
  });
  const renderFiles = files.map((file) => {
    if (file.user_id === -1 && file.folder_id == null) {
      return (
        // Mock folder input
        <NewFileInput
          key={-1}
          submitAction={formActions.create.file.submitAction}
          cancelInput={cancelInput}
          isPending={formActions.create.file.isPending}
          formState={formActions.create.file.formState}
          rootUserId={rootUserId}
        />
      );
    }
    if (file.folder_id == null) {
      return (
        <div
          className="top-level-files"
          style={{
            backgroundColor: file.id === selectedFile ? "#646362" : "unset",
            paddingTop: 9,
            paddingBottom: 9,
          }}
          onClick={() => {
            setFile(file.id, file.name);
            if (file.folder_id) {
              setFolder(file.folder_id);
            } else {
              setFolder(0);
            }
          }}
          key={file.id}
        >
          <FileIcon /> {file.name}
          {file.id === selectedFile && (
            <EllipsisHandler id={file.id} type="file" />
          )}
        </div>
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

  const handleAdd = (itemType: ItemToAdd): void => {
    if (itemType === "folder") {
      if (isAddingItem === "file") {
        cancelInput("file");
      } else {
        addMockInput("folder");
      }
    } else if (itemType === "file") {
      if (isAddingItem === "folder") {
        cancelInput("folder");
      } else {
        addMockInput("file");
      }
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
        {isAddingItem === "none" && (
          <div className="button" onClick={() => handleAdd("file")}>
            <AddFileIcon />
          </div>
        )}
        {isAddingItem === "none" && (
          <div className="button" onClick={() => handleAdd("folder")}>
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
        <div className="files-explorer">{renderFiles}</div>
      </div>
    </div>
  );
}
