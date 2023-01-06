import { useState, useRef } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { FileDropEvent } from "https://esm.sh/file-drop-element@1.0.1";
import { TensorFlow } from "../components/TensorFlow.tsx";

if (IS_BROWSER) {
  await import("https://esm.sh/file-drop-element");
}

interface FileDropProps {
  accept: string;
}

export default function FileDrop(props: FileDropProps) {
  const [accept, setAccept] = useState(props.accept);
  const tensorFlow = useRef(null);
  let [file, setFile] = useState("");
  let x: FileDropEvent;

  const onFileDrop: FileDropEvent = (event) => {
    const { files } = event;
    setFile(URL.createObjectURL(files[0]));
  }

  const onFileSelect: Event = (event) => {
    const { files } = event.target;
    setFile(URL.createObjectURL(files[0]));
  }

  return (
    <div>
      <file-drop onfiledrop={onFileDrop} accept={accept}>
        <input
          id="file-picker"
          class="file-picker__input"
          type="file"
          accept="image/*"
          onChange={onFileSelect}
        />
        <label for="file-picker" class="file-picker__label">
          <h1>Drop or select an image and we will tell you if it looks like a button.</h1>
          <svg viewBox="0 0 24 24" class="file-picker__icon">
            <path
              d="M19 7v3h-2V7h-3V5h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5a2 2 0 00-2 2v12c0 1.1.9 2 2 2h12a2 2 0 002-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"
            />
          </svg>
        </label>
      </file-drop>
      <TensorFlow url="/model.json" file={file} ref={tensorFlow}></TensorFlow>
    </div>
  );
}
