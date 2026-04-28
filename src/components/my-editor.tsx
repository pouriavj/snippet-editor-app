"use client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import * as actions from "@/actions";
import FileIcon from "./icons/file-icon";
import CloseIcon from "./icons/close-icon";

interface MyEditorProps {
  snippet: {
    id: number | undefined;
    name: string | undefined;
    code: string | undefined | null;
  };
  fileArray: { id: number; name: string }[];
  setFile: (id: number, name: string) => void;
  deleteFile: (id: number) => void;
  setFolder: (id: number) => void;
  fetchParentFolder: (id: number) => number;
}

export default function MyEditor({
  snippet,
  fileArray,
  setFile,
  deleteFile,
  setFolder,
  fetchParentFolder,
}: MyEditorProps) {
  // closeHover state for setting vs-code style hover and close on not-selected files onclick
  const [closeHover, setCloseHover] = useState<number>(0);

  // const [code, setCode] = useState(snippet.code);
  // // Becuse this Editor uses internal useState , we can say value = "" and it will just initiallize its state and later its state will change with onChange
  // const handleEditorChange = (value: string = "") => {
  //   setCode(value);
  // };

  // Calling server action inside client component with .bind method as docs recommend
  // const editSnippetAction = actions.editSnippet.bind(null, snippet.id, code);
  // .....

  // Handle both delete from array and deselect selected file back to the previous index file (or next file for last file)
  // This operation done here instead of parent, becuse snippet ids that come from db might be out of order. this covers all edge cases by using map index
  const handleDelete = (
    id: number,
    prevFileId: number,
    prevFileName: string,
  ) => {
    if (id === snippet.id) {
      setFile(prevFileId, prevFileName);

      // fetch parent folder for folder/file creating ui on delete
      const parent = fetchParentFolder(prevFileId);
      setFolder(parent);
    }
    deleteFile(id);
  };

  const renderToolBar = () => {
    return fileArray.map((file, index) => {
      // Saving previous file id and name with map index to set ui to previous file index or next file for last index
      // Without useEffect or complicated buggy approaches!
      let prevFileId = 0;
      let prevFileName = "";
      if (index > 0) {
        prevFileId = fileArray[index - 1].id;
        prevFileName = fileArray[index - 1].name;
      } else if (index === 0 && fileArray[index + 1]) {
        prevFileId = fileArray[index + 1].id;
        prevFileName = fileArray[index + 1].name;
      }

      return (
        <div
          className="tool-bar-item"
          onClick={() => {
            setFile(file.id, file.name);

            // fetch parent folder for folder/file creating ui
            const parent = fetchParentFolder(file.id);
            setFolder(parent);
          }}
          onMouseOver={() => setCloseHover(file.id)}
          onMouseOut={() => setCloseHover(0)}
          key={file.id}
          style={{
            backgroundColor: file.id === snippet.id ? "#1e1e1e" : "unset",
            color: file.id === snippet.id ? "#e9edf2" : "#CECECE",
            borderTopColor: file.id === snippet.id ? "#00BCD4" : "",
            borderBottomColor: file.id === snippet.id ? "#1e1e1e" : "",
          }}
        >
          <FileIcon size={14} color="currentColor" />
          {file.name}
          {file.id === snippet.id ? (
            <div
              className="close"
              onClick={(e) => {
                e.stopPropagation(); // ** Needed to prevent conflict from outer div onClick with inner div onClick ** //
                handleDelete(file.id, prevFileId, prevFileName);
              }}
            >
              <CloseIcon />
            </div>
          ) : (
            <div
              style={{ height: 8, width: 8 }}
              className="closeHover"
              onClick={(e) => {
                e.stopPropagation(); // ** Needed to prevent conflict from outer div onClick with inner div onClick ** //
                handleDelete(file.id, prevFileId, prevFileName);
              }}
            >
              {closeHover === file.id && <CloseIcon color="#9c9c9c" />}
            </div>
          )}
        </div>
      );
    });
  };
  return (
    <div className="editor">
      <div className="tool-bar">{renderToolBar()}</div>
      <Editor
        height="100vh"
        theme="vs-dark"
        language="javascript"
        value={snippet.code || ""}
        options={{
          padding: { top: 16, bottom: 16 },
        }}
        // onChange={handleEditorChange}
      />

      {/* <form action={editSnippetAction}>
        <button type="submit" className="p-2 border rounded cursor-pointer">
          Save
        </button>
      </form> */}
    </div>
  );
}
