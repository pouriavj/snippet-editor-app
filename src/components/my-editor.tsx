"use client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { startTransition, useEffect, useState } from "react";

import FileIcon from "./icons/file-icon";
import CloseIcon from "./icons/close-icon";
import SaveIcon from "./icons/save-icon";

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
  editFileAction: {
    formState: {
      message: string | null;
    };
    submitAction: (formData: FormData) => void;
    isPending: boolean;
  };
}

export default function MyEditor({
  snippet,
  fileArray,
  setFile,
  deleteFile,
  setFolder,
  fetchParentFolder,
  editFileAction,
}: MyEditorProps) {
  // closeHover state for setting vs-code style hover and close on not-selected files onclick
  const [closeHover, setCloseHover] = useState<number>(0);
  const [code, setCode] = useState(snippet.code || "");

  // To sync editor value when tabs switch
  useEffect(() => {
    setCode(snippet.code || "");
  }, [snippet.id, snippet.code]);

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

  const handleEditorChange = (value: string = "") => {
    setCode(value);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.set("id", `${snippet.id}`);
    formData.set("content", code || "");
    startTransition(() => {
      editFileAction.submitAction(formData);
      // setIsSubmitted(true);
    });
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
            borderTopColor: file.id === snippet.id ? "#0098d4" : "",
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
      <div className="save" onClick={handleSave}>
        <SaveIcon />
      </div>
      <CodeMirror
        value={code}
        height="90vh"
        extensions={[javascript({ jsx: true }), oneDark]}
        onChange={handleEditorChange}
        autoFocus
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
        }}
        theme="dark"
        style={{
          backgroundColor: "#1e1e1e",
          color: "#d4d4d4",
          fontSize: "14px",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      />
    </div>
  );
}
