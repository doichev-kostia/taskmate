import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import dynamic from "next/dynamic";
import type { MDEditorProps } from "@uiw/react-md-editor/src/Editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
export function Editor(props: MDEditorProps) {
	return <MDEditor {...props} />;
}
