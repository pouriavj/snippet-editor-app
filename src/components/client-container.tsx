"use client";

import useFileSelect from "@/hooks/useFileSelect";
import MyEditor from "./my-editor";
import SideBar from "./side-bar";

interface CilentContainerProps {
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
}

export default function ClientContainer({
  folders,
  files,
}: CilentContainerProps) {
  const {
    selectedFile,
    setFile,
    fileArray,
    deleteFile,
    setFolder,
    selectedFolder,
  } = useFileSelect();
  const selectedSnippet = files.find((file) => {
    return file.id === selectedFile;
  });
  const fetchParentFolder = (id: number) => {
    const foundFile = files.find((file) => {
      return file.id === id;
    });
    if (foundFile?.folder_id) {
      return foundFile.folder_id;
    } else {
      return 0
    }
  };

  return (
    <div className="main-container">
      <SideBar
        folders={folders}
        files={files}
        selectedFile={selectedFile}
        setFile={setFile}
        setFolder={setFolder}
        selectedFolder={selectedFolder}
      />
      <MyEditor
        snippet={{
          id: selectedSnippet?.id,
          name: selectedSnippet?.name,
          code: selectedSnippet?.content,
        }}
        fileArray={fileArray}
        setFile={setFile}
        deleteFile={deleteFile}
        setFolder={setFolder}
        fetchParentFolder={fetchParentFolder}
      />
    </div>
  );
}
