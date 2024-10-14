import { useEffect, useState, createContext } from "react"
import { Navigate, useParams, useLocation } from "react-router-dom"

// context
import { useStateContext } from "../contexts/GlobalContext"

// components
import BlogEditor from "../components/editor/BlogEditor"
import PublishForm from "../components/editor/PublishForm"
import Loader from "../components/common/Loader"
import axios from "axios"

const blogStructure = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: { personal_info: {} },
}

export const EditorContext = createContext({
    blog: blogStructure,
    setBlog: () => {},
    textEditor: {},
    setTextEditor: () => {},
})

const Editor = () => {
    const [blog, setBlog] = useState(blogStructure)
    const [textEditor, setTextEditor] = useState({ isReady: false })
    const [editorState, setEditorState] = useState("editor")
    const [loading, setLoading] = useState(true)

    const {
        userData: { access_token },
    } = useStateContext()

    const { blogId } = useParams()
    const location = useLocation()

    useEffect(() => {
        if (!blogId) {
            return setLoading(false)
        }

        axios
            .post(`/api/v1/blogs/get-blog`, {
                blog_id: blogId,
                draft: true,
                mode: "edit",
            })
            .then(({ data }) => {
                setBlog(data?.blog)
                setLoading(false)
            })
            .catch((error) => {
                setBlog(null)
                setLoading(false)
                console.log(error)
            })
    }, [])

    return (
        <EditorContext.Provider
            value={{
                blog,
                setBlog,
                textEditor,
                setTextEditor,
            }}
        >
            {access_token === null ? (
                <Navigate
                    to={{
                        pathname: "/signin",
                        search: `?next=${location.pathname}`,
                    }}
                />
            ) : loading ? (
                <Loader />
            ) : editorState === "editor" ? (
                <BlogEditor setEditorState={setEditorState} />
            ) : (
                <PublishForm setEditorState={setEditorState} />
            )}
        </EditorContext.Provider>
    )
}

export default Editor
