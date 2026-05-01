"use client";
import { useState } from "react";
import ChevronIcon from "./icons/chevron-icon";
import ClosedFolderIcon from "./icons/closed-folder-icon";
import OpenFolderIcon from "./icons/open-folder-icon";
import FileIcon from "./icons/file-icon";
import NewFolderInput from "./new-folder-input";
import type { ItemToAdd } from "./client-container";
import type { ItemAction } from "./side-bar";

interface FolderGroupProps {
  id: number;
  name: string;
  findChildren: (id: number) => {
    childFolders: {
      id: number;
      name: string;
      user_id: number | null;
      folder_id: number | null;
    }[];
    childFiles: {
      id: number;
      name: string;
      user_id: number | null;
      folder_id: number | null;
      content: string | null;
    }[];
  };
  selectedFile: number;
  setFile: (id: number, name: string) => void;
  count?: number;
  setFolder: (id: number) => void;
  selectedFolder: number;
  formActions: {
    create: ItemAction;
    edit: ItemAction;
    delete: ItemAction;
  };
  rootUserId: number | null;
  cancelInput: (inputType: ItemToAdd) => void;
}
// This is the nested folder group structure that returns itself inside it (tree structure)
export default function FolderGroup({
  id,
  name,
  findChildren,
  selectedFile,
  setFile,
  count = 1,
  setFolder,
  selectedFolder,
  formActions,
  cancelInput,
  rootUserId,
}: FolderGroupProps) {
  const [direction, setDirection] = useState("right");

  const toggleDirection = (id: number) => {
    setDirection((prevDirection) =>
      prevDirection === "right" ? "bottom" : "right",
    );
    setFolder(id);
  };

  const renderChildren = (id: number) => {
    const { childFolders, childFiles } = findChildren(id);
    // count is just for calculating the incremented margin for each nested folder (better Ui)
    count++;
    return (
      <div>
        {childFolders.map((folder) => {
          // this mock folder input only appears as child folder when adding new folder
          if (folder.user_id === -1) {
            return (
              <NewFolderInput
                key={-1}
                submitAction={formActions.create.folder.submitAction}
                cancelInput={cancelInput}
                isPending={formActions.create.folder.isPending}
                formState={formActions.create.folder.formState}
                rootUserId={rootUserId}
                parentFolderId={folder.folder_id}
              />
            );
          }

          return (
            <div className="child-folders" key={folder.id}>
              <FolderGroup
                id={folder.id}
                name={folder.name}
                findChildren={findChildren}
                selectedFile={selectedFile}
                setFile={setFile}
                count={count}
                setFolder={setFolder}
                selectedFolder={selectedFolder}
                formActions={formActions}
                cancelInput={cancelInput}
                
                
                rootUserId={rootUserId}
              />
            </div>
          );
        })}
        {childFiles.map((file) => {
          return (
            <div
              style={{
                backgroundColor: file.id === selectedFile ? "#646362" : "unset",

                marginLeft: `${count * -16}px`,
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
              <div
                className={"child-files file-title"}
                style={{ paddingLeft: `${count * 16}px` }}
              >
                <FileIcon /> {file.name}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div
        className="folder-title"
        onClick={() => toggleDirection(id)}
        style={{
          color: id === selectedFolder ? "#00bcd4" : "",
        }}
      >
        <ChevronIcon direction={direction} />
        {direction === "bottom" ? <OpenFolderIcon /> : <ClosedFolderIcon />}

        {name}
      </div>
      {direction === "bottom" && renderChildren(id)}
    </div>
  );
}
