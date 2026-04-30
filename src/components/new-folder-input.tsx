import { startTransition, useRef, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ClosedFolderIcon from "./icons/closed-folder-icon";

interface NewFolderInputProps {
  submitAction: (formData: FormData) => void;
  cancelFolderInput: () => void;
  isPending: boolean;
  formState: {
    message: string | null;
  };
  parentFolderId?: number | null;
  rootUserId: number | null;
}

// types for the form values
type FormValues = {
  name: string;
};

export default function NewFolderInput({
  submitAction,
  cancelFolderInput,
  isPending,
  formState,
  parentFolderId,
  rootUserId,
}: NewFolderInputProps) {
  // In this app client side errors in the input form is handled with RHF but if some error happens inside server action (like db err)
  // server error in managed with useActionState hook , this hook doesnt have live erros like RHF and also showing and dissappearing
  // errors sent from server that are using server state is tricky and needs many useStates and useEffects , this way by using RHF
  // all client side errors managed with live update and in case of server error its managed with useActionState .
  // this setup needs a trigger method and a ref to the form becuse event.currentTarget in this handleFormSubmit wont work with react rules
  // thats why to be able to work with react rules it needs a direct ref to the form to be able to create FormData.

  // Initialize React Hook Form
  const {
    control,
    trigger, // For manually triggering RHF to bypass form onSubmit method which is used by useActionState
    formState: { errors: rhfErrors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  // Ref for the form element
  const formRef = useRef<HTMLFormElement>(null);

  // This local state is used in pair with useEffect to cancel the input when the form is submitted , becuse cancelFolderInput
  // is a parent function that sets the folder array back to original array, and removes the mock child folder input, and for that
  // it needed to be in the parent , thats why useEffect was necessary here
  // so that when the local state isSubmitted changes , the component also rerenders
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle Submit Click
  const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // Prevent default form submission
    e.preventDefault();

    // Trigger RHF validation
    const isValid = await trigger();

    if (isValid && formRef.current) {
      // If valid, submit the form to the server action using the ref
      const formData = new FormData(formRef.current);
      startTransition(() => {
        submitAction(formData);
        setIsSubmitted(true);
      });
    }
  };

  // Watch for submittion of the form to cancel the mock folder input
  useEffect(() => {
    if (isSubmitted) {
      cancelFolderInput();
      reset();
      setIsSubmitted(false);
    }
  }, [isSubmitted]);

  return (
    <div
      className="folder-title"
      style={{
        marginLeft: parentFolderId ? 44 : 28,
        marginTop: parentFolderId ? 20 : "",
        alignItems: "flex-start",
      }}
      // Stop propagation so clicks inside this div don't trigger the global handler in ClientContainer
      onClick={(e) => e.stopPropagation()}
    >
      <ClosedFolderIcon />
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

          {/* Hidden inputs to send user_id and folder_id to server action*/}
          <input type="hidden" name="folder_id" value={parentFolderId || ""} />
          <input type="hidden" name="user_id" value={rootUserId || ""} />

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
