import type { FileDropElement, FileDropEvent } from 'https://esm.sh/file-drop-element@1.0.1';
import "preact";

interface FileDropAttributes extends preact.JSX.HTMLAttributes {
  accept?: string;
  onfiledrop?: ((this: FileDropElement, ev: FileDropEvent) => any) | null;
}

declare module 'preact' {
  namespace createElement.JSX {
    interface IntrinsicElements {
      'file-drop': FileDropAttributes;
    }
  }
}

export { };