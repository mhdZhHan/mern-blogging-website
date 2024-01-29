// import { createContext, useContext, useState } from "react"

// const blogStructure = {
//     title: "",
//     banner: "",
//     content: [],
//     tags: [],
//     des: "",
//     author: { personal_info: {} },
// }

// export const EditorContext = createContext({
//     blog: blogStructure,
//     setBlog: () => {},
//     textEditor: {},
//     setTextEditor: () => {},
// })

// export const EditorContextProvider = ({ children }) => {
//     const [blog, setBlog] = useState(blogStructure)
//     const [textEditor, setTextEditor] = useState({ isReady: false })

//     return (
//         <EditorContext.Provider
//             value={{
//                 blog,
//                 setBlog,
//                 textEditor,
//                 setTextEditor,
//             }}
//         >
//             {children}
//         </EditorContext.Provider>
//     )
// }

// export const useEditorContext = () => useContext(EditorContext)
