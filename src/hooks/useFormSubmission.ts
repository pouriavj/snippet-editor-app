import { useRef, useEffect, useState, startTransition } from "react";
import { useForm, FieldValues, DefaultValues } from "react-hook-form";
import type { ItemToAdd } from "@/components/client-container";
export function useFormSubmission<T extends FieldValues>(
  defaultValues: DefaultValues<T>,
  submitAction: (formData: FormData) => void,
  cancelAction: (type: ItemToAdd) => void,
  cancelType: ItemToAdd,
  renameFile?: (name: string) => void,   // function to rename file in editor tool-bar (in case of resued for edit)
) {
  // Initialize React Hook Form
  // Trigger For manually triggering RHF to bypass form onSubmit method which is used by useActionState hook
  const {
    control,
    trigger,
    reset,
    formState: { errors: rhfErrors },
  } = useForm<T>({
    defaultValues,
    mode: "onChange",
  });

  // Ref for the form element
  const formRef = useRef<HTMLFormElement>(null);

  // This local state is used in pair with useEffect to cancel the input when the form is submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle Submit Click
  const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // Prevent default form submission
    e.preventDefault();

    // Trigger RHF validation manually (submit)
    const isValid = await trigger();
    // If valid, submit the form to the server action using the ref
    if (isValid && formRef.current) {
      // ****************************************************************************** //
      // ** Using ref instead of manually passing form data as arguments here to work with react special rules around form onSubmit, which can only be of type FormData ** //
      // Becuse using RHF in pair with UAS, FormData event is not of type FormData anymore , becuse it also containts other fields in input (RHF render input)
      // And becuse of that cant use event.currentTarget in constructing formData , so by using Ref, we have direct refrence to current formData.
      const formData = new FormData(formRef.current);
      startTransition(() => {
        submitAction(formData);
        setIsSubmitted(true);
      });
    }
    // ****************************************************************************** //
  };

  // Watch for submittion of the form to cancel the mock folder input

  // useEffect was absolutely necessary here becuse , when save button is pressed it first validates input with RHF then calls server action
  // server action is async function and provides a promise , but here inside a client component we cannot directly use async functions in the body , so
  // the only state we know about server action is [formState, action, isPending], if we try to use formstate or isPending to cancel input when data reached server
  // we have to put this checking inside the function that calls server action after it did , which means putting it inside handleFormSubmit, BUT the key point is that
  // after user clicks save button we cannot await submitAction, and formState or isPending still not changed so the cancel function does not get called.
  // and even if we put cancel function directly after submitAction , again it will be called in sync with action and it will call cancel function which is parent function
  // and it will rerender this child component and resets form . so becuse the only connection to server is formState and it only changes after submittion , after submittion
  // we can only use formState to change a local state and maybe render a message , we cannot call a function (cancel function) after formState changes becuse for that we need
  // async call of a function inside the body of component which is forbidden in client component . so becuse we cant access server async response right after submittion to cancel mock input
  // we need a local state isSubmitted to be called inside onSubmit function and a useEffect to call the cancel function when this state is set . this state only sets when save button is pressed
  // and its sumittion function called successfuly , after that useEffect will cancel mock input and thus rerenders the component and data adds and Ui rerenders.

  useEffect(() => {
    if (isSubmitted) {
      cancelAction(cancelType);
      reset();
      setIsSubmitted(false);
      // In case of rename reuse, fetches formdata to also set editors tool-bar file-array to renamed files
      if (renameFile && formRef.current) {
        const formData = new FormData(formRef.current);
        const newName = formData.get("name") as string;
        if (newName) {
          renameFile(newName);
        }
      }
    }
  }, [isSubmitted]);

  return { control, formRef, handleFormSubmit, rhfErrors, isSubmitted };
}
