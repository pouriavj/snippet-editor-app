"use client";

import { startTransition, useEffect, useState } from "react";
import EllipsisIcon from "./icons/ellipsis-icon";
import type { ItemAction } from "./side-bar";
import { ItemToAdd } from "./client-container";

interface EllipsisHandlerProps {
  id: number;
  type: ItemToAdd;

  deleteActions: ItemAction;
  cancelInput: (inputType: ItemToAdd) => void;
  deleteFile: (id: number) => void;
  isPopupOpen: boolean; // For canceling popup if clicked outside

  handleEdit: (itemType: ItemToAdd) => void;
  handleToggle: (type: ItemToAdd, id: number) => void;
  toggleState: {
    popupType: ItemToAdd;
    itemId: number;
  };
}

export default function EllipsisHandler({
  id,
  type,

  deleteActions,
  cancelInput,
  deleteFile,
  isPopupOpen,

  handleEdit,
  handleToggle,
  toggleState,
}: EllipsisHandlerProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<ItemToAdd>("none");
  // Handle submit
  const handleDeleteFile = (e: React.SubmitEvent<HTMLFormElement>) => {
    // No async function used
    e.preventDefault();

    setDeleteModalState("file");
  };

  const handleDeleteFolder = (e: React.SubmitEvent<HTMLFormElement>) => {
    // No async function used
    e.preventDefault();

    setDeleteModalState("folder");
  };

  const handleConfirmDelete = () => {
    if (deleteModalState === "folder") {
      const formData = new FormData();
      formData.set("folder_id", `${id}`);
      startTransition(() => {
        deleteActions.folder.submitAction(formData);
        setIsSubmitted(true);
      });
    } else if (deleteModalState === "file") {
      const formData = new FormData();
      formData.set("file_id", `${id}`);
      startTransition(() => {
        deleteActions.file.submitAction(formData);
        setIsSubmitted(true);
      });
    }
  };

  const handleFileEditEventHandler = (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    handleEdit("file");
  };
  const handleFolderEditEventHandler = (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    handleEdit("folder");
  };

  // Becuse deleting file from db is an async server action state doesnt rerender immidietly , so by resetting files state in the container
  // with the side effect of submitting local state , files update dynamicly (no async function in client component)
  useEffect(() => {
    if (type === "file") {
      if (isSubmitted) {
        cancelInput("file");
        setIsSubmitted(false);
        deleteFile(id); // Also delete file from tool-bar in editor
        setDeleteModalState("none");
      }
    } else if (type === "folder") {
      if (isSubmitted) {
        cancelInput("folder");
        setIsSubmitted(false);
        setDeleteModalState("none");
        // deleteFile(id); // Also delete file from tool-bar in editor
      }
    }
  }, [isSubmitted]);

  function renderModal() {
    const title = deleteModalState === "file" ? "Delete file" : "Delete folder";
    const message =
      deleteModalState === "file"
        ? "Are you sure you want to delete this file? This action cannot be undone."
        : "Are you sure you want to delete this folder? This action cannot be undone.";

    return (
      <div
        className="modal-backdrop"
        onClick={(e) => {
          e.stopPropagation();
          setDeleteModalState("none");
        }} // click outside to close, stop propagation to not recognize click as child of folder group and open/close folder in case of click on backdrop
      >
        <div
          className="modal"
          onClick={(e) => e.stopPropagation()} // prevent closing on inner click
        >
          <h2 className="modal-title">{title}</h2>
          <p className="modal-message">{message}</p>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={() => setDeleteModalState("none")}
            >
              Cancel
            </button>
            <button
              type="button"
              className="modal-btn modal-btn-delete"
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderPopup() {
    if (
      toggleState.popupType === "folder" &&
      toggleState.itemId === id &&
      isPopupOpen
    ) {
      return (
        <div className="pop-up">
          <div className="edit-buttons-container">
            <form onSubmit={handleFolderEditEventHandler}>
              <button
                onClick={(e) => e.stopPropagation()} // this added onclick is to prevent global click handler (cancel) when this button is clicked
                type="submit"
                className="rename-button"
              >
                Rename
              </button>
            </form>

            <form onSubmit={handleDeleteFolder}>
              <button
                onClick={(e) => e.stopPropagation()} // this added onclick is to prevent global click handler (cancel) when this button is clicked
                type="submit"
                className="delete-button"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      );
    } else if (
      toggleState.popupType === "file" &&
      toggleState.itemId === id &&
      isPopupOpen
    ) {
      return (
        <div className="pop-up">
          <div className="edit-buttons-container">
            <form onSubmit={handleFileEditEventHandler}>
              <button
                onClick={(e) => e.stopPropagation()} // this added onclick is to prevent global click handler (cancel) when this button is clicked
                type="submit"
                className="rename-button"
              >
                Rename
              </button>
            </form>

            <form onSubmit={handleDeleteFile}>
              <button
                onClick={(e) => e.stopPropagation()} // this added onclick is to prevent global click handler (cancel) when this button is clicked
                type="submit"
                className="delete-button"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      );
    }
  }

  return (
    <div
      className="ellipsis-container"
      style={{ marginRight: type === "file" ? 12 : -4 }}
    >
      <div
        className="ellipsis"
        onClick={(e) => {
          e.stopPropagation();
          handleToggle(type, id);
        }}
      >
        <EllipsisIcon />
      </div>
      {renderPopup()}
      {deleteModalState !== "none" && renderModal()}
    </div>
  );
}
