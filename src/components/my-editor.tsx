"use client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import * as actions from "@/actions";

interface MyEditorProps {
  snippet: {
    id: number;
    title: string;
    code: string | undefined | null;
  };
}

export default function MyEditor({ snippet }: MyEditorProps) {
  // const [code, setCode] = useState(snippet.code);
  // // Becuse this Editor uses internal useState , we can say value = "" and it will just initiallize its state and later its state will change with onChange
  // const handleEditorChange = (value: string = "") => {
  //   setCode(value);
  // };

  // Calling server action inside client component with .bind method as docs recommend
  // const editSnippetAction = actions.editSnippet.bind(null, snippet.id, code);

  return (
    <div className="editor">
      <div className="tool-bar">hello</div>
      <Editor
        height="100vh"
        theme="vs-dark"
        language="javascript"
        value={snippet.code || ""}
        options={{
          minimap: { enabled: false },
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
