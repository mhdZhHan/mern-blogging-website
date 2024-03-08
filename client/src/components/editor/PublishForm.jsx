import { useContext } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"
import { EditorContext } from "../../screens/Editor"

// components
import AnimationWrapper from "../common/AnimationWrapper"
import Tag from "./Tag"

const PublishForm = ({ setEditorState }) => {
    const characterLimit = 200 // short description limit
    const tagLimit = 10

    const navigate = useNavigate()

    const {
        blog,
        blog: { banner, title, content, des, tags, draft },
        setBlog,
    } = useContext(EditorContext)

    const {
        userData: { access_token },
    } = useStateContext()

    const { blogId } = useParams()

    const handleClose = () => {
        setEditorState("editor")
    }

    const handleBlogTitle = (event) => {
        const input = event.target

        setBlog({ ...blog, title: input.value })
    }

    const handleBlogDescription = (event) => {
        const input = event.target

        setBlog({ ...blog, des: input.value })
    }

    const handleTitleKeyDown = (event) => {
        // enter key
        if (event.keyCode === 13) {
            event.preventDefault()
        }
    }

    const handleTagsInputKeyDown = (event) => {
        // enter key
        if (event.keyCode === 13 || event.keyCode === 188) {
            event.preventDefault()

            const tag = event.target.value

            if (tags.length < tagLimit) {
                if (!tags.includes(tag) && tag.length) {
                    setBlog({ ...blog, tags: [...tags, tag] })
                }
            } else {
                toast.error(`You can add max ${tagLimit} tags`)
            }

            event.target.value = ""
        }
    }

    const handleBlogPublish = (event) => {
        // the button have `disable` class the submission is not possible
        if (event.target.className.includes("disable")) return

        if (!title.length) {
            return toast.error("Write a blog title before publishing")
        }

        if (!des.length || des.length > characterLimit) {
            return toast.error(
                "Write a short description about your blog withing 200 characters to publish"
            )
        }

        if (!tags.length) {
            return toast.error("Enter at least 1 tag helps to rank your blog")
        }

        const loadingToast = toast.loading("Publishing...")

        // the disable class will hide the button to avoid multiple clicking
        event.target.classList.add("disable")

        const blogDate = { title, des, tags, content, banner, draft: false }

        // send data to server
        axios
            .post(
                `${import.meta.env.VITE_API_URL}/blogs/create`,
                { ...blogDate, id: blogId },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            )
            .then((response) => {
                event.target.classList.remove("disable")
                toast.dismiss(loadingToast)
                toast.success("Published ✅")

                setTimeout(() => {
                    navigate("/dashboard/blogs")
                }, 500)
            })
            .catch(({ response }) => {
                event.target.classList.remove("disable")
                toast.dismiss(loadingToast)

                // the error message from the backend
                return toast.error(response?.data?.message)
            })
    }

    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />

                <button
                    className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                    onClick={handleClose}
                >
                    <i className="fi fi-br-cross"></i>
                </button>

                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>

                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} alt="banner" />
                    </div>

                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
                        {title}
                    </h1>

                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
                        {des}
                    </p>
                </div>

                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input
                        type="text"
                        placeholder="Blog Title"
                        defaultValue={title}
                        className="input-box pl-4"
                        onChange={handleBlogTitle}
                    />

                    <p className="text-dark-grey mb-2 mt-9">
                        Short description about your blog
                    </p>
                    <textarea
                        maxLength={characterLimit}
                        defaultValue={des}
                        className="h-40 resize-none leading-7 input-box pl-4"
                        onChange={handleBlogDescription}
                        onKeyDown={handleTitleKeyDown}
                    ></textarea>
                    <p className="mt-1 text-dark-grey text-sm text-right">
                        {characterLimit - des.length} Characters left
                    </p>

                    <p className="text-dark-grey mb-2 mt-9">
                        Topics - (Helps is searching and ranking your blog post)
                    </p>
                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input
                            type="text"
                            placeholder="Topic"
                            className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                            onKeyDown={handleTagsInputKeyDown}
                        />
                        {tags.map((tag, index) => (
                            <Tag tag={tag} tagIndex={index} key={index} />
                        ))}
                    </div>
                    <p className="mt-1 mb-4 text-dark-grey text-sm text-right">
                        {tagLimit - tags.length} Tags left
                    </p>

                    <button
                        className="btn-dark px-8"
                        onClick={handleBlogPublish}
                    >
                        Publish
                    </button>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default PublishForm
