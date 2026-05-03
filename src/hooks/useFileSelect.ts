import { useState } from "react";

// custom hook to select files , its defined inside parent and passed to nested child FormGroups
// this hook does both setting file and setting file array for editor toolbar
// this hook should be called in parent (client-container), its purpuse it to make parent code more readable
// also it makes use of 2 first required arguments in child components and 3rd one only in parent (more readable)

// setFileArray should update with id directly not selected file that depends on previous state

export default function useFileSelect() {
  const [selectedFile, setSelectedFile] = useState<number>(0);
  const [fileArray, setFileArray] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedFolder, setSelectedFolder] = useState<number>(0);
  // Set ui file
  const MAX_FILES = 10;
  function setFile(id: number, name: string) {
    setSelectedFile(id);

    // .some loops into object and if codition matched it return true and stop ,
    // .includes works for simple one values , .some for comples object values
    const isDuplicate = fileArray.some((file) => file.id === id);
    if (!isDuplicate && fileArray.length < MAX_FILES) {
      setFileArray((prevValue) => {
        return [...prevValue, { id, name }];
      });
    }
  }

  // function to rename selected file in the tool-bar of editor
  function renameFile(name: string) {
    const renamedFileArray = fileArray.map((file) => {
      if (file.id === selectedFile) {
        return { id: file.id, name: name };
      } else {
        return file
      }
    });
    setFileArray(renamedFileArray)
  }

  // function to delete file in tool-bar ui
  function deleteFile(id: number) {
    setFileArray(
      fileArray.filter((file) => {
        return file.id !== id;
      }),
    );
  }

  function setFolder(id: number) {
    setSelectedFolder(id);
  }

  return {
    selectedFile,
    setFile,
    fileArray,
    deleteFile,
    setFolder,
    selectedFolder,
    renameFile
  };
}
