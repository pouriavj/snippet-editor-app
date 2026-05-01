import { useActionState } from "react";
import * as actions from "@/actions";


export default function useFormAction() {
  // create folder
  const [folderFormState, folderSubmitAction, folderIsPending] = useActionState(
    actions.createFolder,
    { message: "" },
  );
  // create file
  const [fileFormState, fileSubmitAction, fileIsPending] = useActionState(
    actions.createFile,
    { message: "" },
  );
  // edit folder
  const [editFolderFormState, editFolderSubmitAction, editFolderIsPending] =
    useActionState(actions.editFolder, { message: "" });
  // edit file
  const [editFileFormState, editFileSubmitAction, editFileIsPending] =
    useActionState(actions.editFile, { message: "" });
  // delete folder
  const [
    deleteFolderFormState,
    deleteFolderSubmitAction,
    deleteFolderIsPending,
  ] = useActionState(actions.deleteFolder, { message: "" });
  // delete file
  const [deleteFileFormState, deleteFileSubmitAction, deleteFileIsPending] =
    useActionState(actions.deleteFile, { message: "" });

  return {
    create: {
      folder: {
        formState: folderFormState,
        submitAction: folderSubmitAction,
        isPending: folderIsPending,
      },
      file: {
        formState: fileFormState,
        submitAction: fileSubmitAction,
        isPending: fileIsPending,
      },
    },
    edit: {
      folder: {
        formState: editFolderFormState,
        submitAction: editFolderSubmitAction,
        isPending: editFolderIsPending,
      },
      file: {
        formState: editFileFormState,
        submitAction: editFileSubmitAction,
        isPending: editFileIsPending,
      },
    },
    delete: {
      folder: {
        formState: deleteFolderFormState,
        submitAction: deleteFolderSubmitAction,
        isPending: deleteFolderIsPending,
      },
      file: {
        formState: deleteFileFormState,
        submitAction: deleteFileSubmitAction,
        isPending: deleteFileIsPending,
      },
    },
  };
}
