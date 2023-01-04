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

  return (
    <div>
      <file-drop onfiledrop={onFileDrop} accept={accept} >
        Drop an image here, and we will tell you if it looks like a button
      </file-drop>
      <TensorFlow url="/model.json" file={file} ref={tensorFlow}></TensorFlow>
    </div>
  );
}
