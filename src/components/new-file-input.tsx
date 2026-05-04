import { Controller } from "react-hook-form";

import type { ItemToAdd } from "./client-container";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import FileIcon from "./icons/file-icon";

interface NewFileInputProps {
  submitAction: (formData: FormData) => void;
  cancelInput: (inputType: ItemToAdd) => void;
  isPending: boolean;
  formState: {
    message: string | null;
  };
  parentFolderId?: number | null;
  rootUserId: number | null;
  id?: number; // For reuse as rename input
  renameFile?: (name: string) => void;  // renaming file in editor tool-bar
  defaultValue?: string;
}

export default function NewFileInput({
  submitAction,
  cancelInput,
  isPending,
  formState,
  parentFolderId,
  rootUserId,
  id,
  renameFile,
  defaultValue,
}: NewFileInputProps) {
  // Custom Generic Hook to handle RHF and UAS hooks submission for files and folders and also cancel mock inputs by local state and effect
  const { control, formRef, handleFormSubmit, rhfErrors } = useFormSubmission(
    { name: defaultValue ? defaultValue : "" },
    submitAction,
    cancelInput,
    "file",
    renameFile, // In case of rename reuse , also renames in tool-bar
  );

  return (
    <div
      className="folder-title"
      style={{
        marginLeft: parentFolderId ? 24 : 28,
        marginTop: parentFolderId ? 20 : 8,
        alignItems: "flex-start",
      }}
      // Stop propagation so clicks inside this div don't trigger the global handler in ClientContainer
      onClick={(e) => e.stopPropagation()}
    >
      <FileIcon />
      <div>
        {/* React Hook Form with ref and manual trigger method, onSubmit method uses useActionState hook */}
        <form ref={formRef} onSubmit={handleFormSubmit} className="new-form">
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required",
            }}
            render={({ field }) => (
              <input
                {...field}
                onChange={(e) => {
                  field.onChange(e); // For live error update
                }}
                type="text"
                autoFocus
                autoComplete="off"
                className={rhfErrors.name ? "error-input" : "input"}
              />
            )}
          />

          {/* Hidden inputs to send user_id and folder_id to server action in case of new file*/}
          {/* For generic use of this input, used ternary on id to send just id in case of rename usage*/}
          {id ? (
            <input type="hidden" name="id" value={`${id}`} />
          ) : (
            <>
              <input
                type="hidden"
                name="folder_id"
                value={parentFolderId || ""}
              />
              <input type="hidden" name="user_id" value={rootUserId || ""} />
            </>
          )}

          <button type="submit" disabled={isPending} className="save-button">
            Save
          </button>
        </form>
        {/* Display React Hook Form Errors (Client-side) */}
        {rhfErrors.name && (
          <div className="error-message">{rhfErrors.name.message}</div>
        )}
        {/* Display Server Errors (Backend) */}
        {formState.message?.includes("error") && (
          <div className="error-message">{formState.message}</div>
        )}
      </div>
    </div>
  );
}
