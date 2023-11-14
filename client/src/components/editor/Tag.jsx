// contexts
import { useEditorContext } from "../../contexts/EditorContext"

const Tag = ({ tag, tagIndex }) => {
    const {
        blog: { tags },
        blog,
        setBlog,
    } = useEditorContext()

    const handleContentEditable = (event) => {
        event.target.setAttribute("contentEditable", true)
        event.target.focus()
    }

    const handleTagDelete = () => {
        const newTags = tags.filter((t) => t != tag)
        setBlog({ ...blog, tags: newTags })
    }

    const handleTagEdit = (event) => {
        if (event.keyCode === 13 || event.keyCode === 188) {
            event.preventDefault()

            const currentTag = event.target.innerText

            tags[tagIndex] = currentTag

            setBlog({ ...blog, tags })

            event.target.setAttribute("contentEditable", false)
        }
    }

    return (
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
            <p className="outline-none" onKeyDown={handleTagEdit} onClick={handleContentEditable}>
                {tag}
            </p>
            <button
                className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
                onClick={handleTagDelete}
            >
                <i className="fi fi-br-cross text-sm pointer-events-none"></i>
            </button>
        </div>
    )
}

export default Tag
