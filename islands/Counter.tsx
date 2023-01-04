import { useState } from "preact/hooks";
import type { FileDropEvent } from "https://esm.sh/file-drop-element@1.0.1";
import "https://esm.sh/file-drop-element@1.0.1";

interface CounterProps {
  start: number;
}

export default function Counter(props: CounterProps) {
  const [count, setCount] = useState(props.start);
  let x: FileDropEvent;
  return (
    <div>
      <file-drop onfiledrop={this.onFileDrop} id="test"></file-drop>
    </div>
  );
}
