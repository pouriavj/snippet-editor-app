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
  const { selectedFile, setFile, fileArray, deleteFile } = useFileSelect();
  const selectedSnippet = files.find((file) => {
    return file.id === selectedFile;
  });
 
  
  
  return (
    <div className="main-container">
      <SideBar
        folders={folders}
        files={files}
        selectedFile={selectedFile}
        setFile={setFile}
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
      />
    </div>
  );
}
