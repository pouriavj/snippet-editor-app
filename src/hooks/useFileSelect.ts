import { useState } from "react";
// custom hook to select files , its defined inside parent and passed to nested child FormGroups
export default function useFileSelect() {
  const [selectedFile, setSelectedFile] = useState(0);
  function setFile(id: number) {
    setSelectedFile(id);
  }

  return { selectedFile, setFile };
}
