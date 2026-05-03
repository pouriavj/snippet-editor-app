"use client";

import { startTransition, useEffect, useState } from "react";
import EllipsisIcon from "./icons/ellipsis-icon";
import type { ItemAction } from "./side-bar";
import { ItemToAdd } from "./client-container";

interface EllipsisHandlerProps {
  id: number;
  type: ItemType;
  editActions: ItemAction;
  deleteActions: ItemAction;
  cancelInput: (inputType: ItemToAdd) => void;
  deleteFile: (id: number) => void;
  isPopupOpen: boolean; // For canceling popup if clicked outside
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEdit: (itemType: ItemToAdd) => void;
}
type ItemType = "folder" | "file";
export default function EllipsisHandler({
  id,
  type,
  editActions,
  deleteActions,
  cancelInput,
  deleteFile,
  isPopupOpen,
  setIsPopupOpen,
  handleEdit,
}: EllipsisHandlerProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toggle, setToggle] = useState(false);

  // Handle submit
  const handleDelete = (e: React.SubmitEvent<HTMLFormElement>) => {
    // No async function used
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("file_id", `${id}`);
    startTransition(() => {
      deleteActions.file.submitAction(formData);
      setIsSubmitted(true);
    });
  };

  const handleEditEventHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEdit("file");
  };

  // Becuse deleting file from db is an async server action state doesnt rerender immidietly , so by resetting files state in the container
  // with the side effect of submitting local state , files update dynamicly (no async function in client component)
  useEffect(() => {
    if (isSubmitted) {
      cancelInput("file");
      setIsSubmitted(false);
      deleteFile(id); // Also delete file from tool-bar in editor
    }
  }, [isSubmitted]);

  return (
    <div className="ellipsis-container">
      <div
        className="ellipsis"
        onClick={(e) => {
          e.stopPropagation(); // to prevent cancel
          if (!isPopupOpen) {
            // its for first time that isPopUpopen is false (just opens it)
            setToggle(true);
          } else {
            setToggle((prev) => !prev); // if popup was open then make ellipsis toggle
          }

          setIsPopupOpen(true); // becuse ellipsis stops propagation clicking on it the second time would make it false (this if else is for both making ellipsis toggle and also make click outside popup cancel)
        }}
      >
        <EllipsisIcon />
      </div>
      {toggle && isPopupOpen && (
        <div className="pop-up">
          <div className="edit-buttons-container">
            <form onSubmit={handleEditEventHandler}>
              <button
                onClick={(e) => e.stopPropagation()} // this added onclick is to prevent global click handler (cancel) when this button is clicked
                type="submit"
                className="rename-button"
              >
                Rename
              </button>
            </form>

            <form onSubmit={handleDelete}>
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
      )}
    </div>
  );
}
