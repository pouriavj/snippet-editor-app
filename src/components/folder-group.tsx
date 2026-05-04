"use client";
import { useState } from "react";
import ChevronIcon from "./icons/chevron-icon";
import ClosedFolderIcon from "./icons/closed-folder-icon";
import OpenFolderIcon from "./icons/open-folder-icon";
import FileIcon from "./icons/file-icon";
import NewFolderInput from "./new-folder-input";
import NewFileInput from "./new-file-input";
import type { ItemToAdd } from "./client-container";
import type { ItemAction } from "./side-bar";
import EllipsisHandler from "./ellipsis-handler";

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
  renameFile: (name: string) => void;
  deleteFile: (id: number) => void;
  isPopupOpen: boolean;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEdit: (itemType: ItemToAdd) => void;
  handleToggle: (type: ItemToAdd, id: number) => void;
  toggleState: {
    popupType: ItemToAdd;
    itemId: number;
  };
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
  renameFile,
  deleteFile,
  isPopupOpen,
  setIsPopupOpen,
  handleEdit,
  handleToggle,
  toggleState,
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
          } else if (folder.user_id === -2) {
            return (
              // Mock rename file input (reused new file input with optional props for renaming file in side bar and editor)
              <NewFolderInput
                key={-2}
                submitAction={formActions.edit.folder.submitAction}
                cancelInput={cancelInput}
                isPending={formActions.edit.folder.isPending}
                formState={formActions.edit.folder.formState}
                rootUserId={rootUserId}
                id={selectedFolder}
                parentFolderId={folder.folder_id}
                defaultValue={folder.name}
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
                handleEdit={handleEdit}
                renameFile={renameFile}
                rootUserId={rootUserId}
                isPopupOpen={isPopupOpen}
                setIsPopupOpen={setIsPopupOpen}
                deleteFile={deleteFile}
                handleToggle={handleToggle}
                toggleState={toggleState}
              />
            </div>
          );
        })}
        {childFiles.map((file) => {
          // this mock file input only appears as child file when adding new file
          if (file.user_id === -1) {
            return (
              <NewFileInput
                key={-1}
                submitAction={formActions.create.file.submitAction}
                cancelInput={cancelInput}
                isPending={formActions.create.file.isPending}
                formState={formActions.create.file.formState}
                rootUserId={rootUserId}
                parentFolderId={file.folder_id}
              />
            );
          } else if (file.user_id === -2) {
            return (
              // Mock rename file input (reused new file input with optional props for renaming file in side bar and editor)
              <div
                key={-2}
                style={{ marginLeft: `${count * 6}px`, marginTop: 16 }}
              >
                <NewFileInput
                  submitAction={formActions.edit.file.submitAction}
                  cancelInput={cancelInput}
                  isPending={formActions.edit.file.isPending}
                  formState={formActions.edit.file.formState}
                  rootUserId={rootUserId}
                  renameFile={renameFile}
                  id={selectedFile}
                  parentFolderId={file.folder_id}
                  defaultValue={file.name}
                />
              </div>
            );
          }

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
                {file.id === selectedFile && (
                  <EllipsisHandler
                    id={file.id}
                    type="file"
                    deleteActions={formActions.delete}
                    cancelInput={cancelInput}
                    deleteFile={deleteFile}
                    isPopupOpen={isPopupOpen}
                    handleEdit={handleEdit}
                    handleToggle={handleToggle}
                    toggleState={toggleState}
                  />
                )}
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
        {name}{" "}
        {id === selectedFolder && (
          <EllipsisHandler
            id={id}
            type="folder"
            deleteActions={formActions.delete}
            cancelInput={cancelInput}
            deleteFile={deleteFile}
            isPopupOpen={isPopupOpen}
            handleEdit={handleEdit}
            handleToggle={handleToggle}
            toggleState={toggleState}
          />
        )}
      </div>
      {direction === "bottom" && renderChildren(id)}
    </div>
  );
}
