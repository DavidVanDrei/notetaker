import { useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export const NoteEditor = ({
  onSave
}: {
  onSave: (note: { title: string; content: string ,generate:boolean}) => void;
}) => {
  const [code, setCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [generate,setGenerate] = useState<boolean>(false)

  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <input
            type="text"
            placeholder="Note title"
            className="input-primary input input-lg w-full font-bold"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </h2>
        <CodeMirror
          value={code}
          width="500px"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={(value) => setCode(value)}
          className="border border-gray-300"
        />

      </div>
      <div className="card-actions justify-end">
     
      <div className="form-control">
        <label className="label cursor-pointer">
          <div className="label-text">AI Complete</div>
          <input type="checkbox" defaultChecked={generate} onClick={() => {
            setGenerate(!generate)
            console.log("Generated: ",generate)}} 
      />
        </label>
      </div>
        <button
          onClick={() => {
            onSave({
              title,
              content: code,
              generate:generate
            });
            setCode("");
            setTitle("");
          }}
          className="btn-primary btn"
          disabled={title.trim().length === 0 || code.trim().length === 0}
        >
          Save
        </button>
      </div>
    </div>
  );
};
