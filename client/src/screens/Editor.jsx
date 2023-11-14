import { useState } from "react"
// context
import {
    EditorContextProvider,
} from "../contexts/EditorContext"

// components
import BlogEditor from "../components/editor/BlogEditor"
import PublishForm from "../components/editor/PublishForm"

const Editor = () => {
    const [editorState, setEditorState] = useState("editor")

    return (
        <EditorContextProvider>
            {editorState === "editor" ? (
                <BlogEditor setEditorState={setEditorState} />
            ) : (
                <PublishForm setEditorState={setEditorState} />
            )}
        </EditorContextProvider>
    )
}

export default Editor
