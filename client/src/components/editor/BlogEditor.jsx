import { Fragment, useEffect, useContext } from "react"
import axios from "axios"
import { Link, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast"
import Editorjs from "@editorjs/editorjs"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"
import { EditorContext } from "../../screens/Editor"

// components
import AnimationWrapper from "../common/AnimationWrapper"
import { tools } from "./EditorTools"

// functions
import { uploadImage } from "../../functions/aws"

// assets
import { logoDark, logoLight, blogBanner, blogBannerDark } from "../../assets"

const BlogEditor = ({ setEditorState }) => {
	const navigate = useNavigate()

	const {
		blog,
		blog: { title, banner, content },
		setBlog,
		textEditor,
		setTextEditor,
	} = useContext(EditorContext)

	const {
		userData: { access_token },
		theme,
	} = useStateContext()

	const { blogId } = useParams()

	useEffect(() => {
		// setTextEditor state will helps to avoid the multiple editor rendering
		if (!textEditor.isReady) {
			setTextEditor(
				new Editorjs({
					holder: "textEditor",
					data: Array.isArray(content) ? content[0] : content,
					tools: tools,
					placeholder: "Let's write your blog",
				})
			)
		}
	}, [])

	// ANCHOR ======= BANNER IMAGE Handling ========
	const handleBannerUpload = (event) => {
		const img = event?.target?.files[0]

		if (img) {
			const loadingToast = toast.loading("Uploading...")
			uploadImage(img, access_token)
				.then((url) => {
					if (url) {
						toast.dismiss(loadingToast)
						toast.success("Uploaded ✅")

						setBlog({ ...blog, banner: url })
					}
				})
				.catch((error) => {
					toast.dismiss(loadingToast)
					return toast.error(error)
				})
		}
	}

	const handleBannerError = (event) => {
		const img = event.target

		img.src = theme == "light" ? blogBanner : blogBannerDark
	}

	// =======================================

	// ANCHOR ======== TITLE Handling ============
	const handleTitleKeyDown = (event) => {
		// enter key
		if (event.keyCode === 13) {
			event.preventDefault()
		}
	}

	const handleTitleChange = (event) => {
		// avoid scrolling and adjusting height based on the title
		const input = event.target

		input.style.height = "auto"
		input.style.height = input.scrollHeight + "px"

		setBlog({ ...blog, title: input.value })
	}
	// =======================================

	// ANCHOR ======== BLOG PUBLISH Handling ============
	const handleBlogPublish = () => {
		if (!banner.length) {
			return toast.error("Upload a blog banner to publish it")
		}
		if (!title.length) {
			return toast.error("Write blog title to publish it")
		}

		if (textEditor.isReady) {
			textEditor
				.save()
				.then((data) => {
					if (data.blocks.length) {
						setBlog({ ...blog, content: data })
						setEditorState("publish")
					} else {
						return toast.error(
							"Write something in your blog to publish it"
						)
					}
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}
	// =======================================

	// ANCHOR =========== BLOG DRAFTING ===============
	const handleBlogDraft = (event) => {
		// the button have `disable` class the submission is not possible
		if (event.target.className.includes("disable")) return

		if (!title.length) {
			return toast.error("Write a blog title before saving it is a draft")
		}

		const loadingToast = toast.loading("Saving Draft...")

		// the disable class will hide the button to avoid multiple clicking
		event.target.classList.add("disable")

		if (textEditor.isReady) {
			textEditor
				.save()
				.then((content) => {
					const blogDate = {
						title,
						content,
						banner,
						draft: true,
					}

					// send data to server
					axios
						.post(
							`/api/v1/blogs/create`,
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
							toast.success("Saved ✅")

							setTimeout(() => {
								navigate("/dashboard/blogs?tab=draft")
							}, 500)
						})
						.catch(({ response }) => {
							event.target.classList.remove("disable")
							toast.dismiss(loadingToast)

							// the error message from the backend
							return toast.error(response?.data?.message)
						})
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}
	// =======================================

	return (
		<Fragment>
			<Toaster />
			<nav className="navbar">
				<Link to="/" className="flex-none w-10">
					<img
						src={theme == "light" ? logoDark : logoLight}
						alt="logo"
					/>
				</Link>
				<p className="max-md:hidden text-black line-clamp-1 w-full">
					{title.length ? title : "New Blog"}
				</p>

				<div className="flex gap-4 ml-auto">
					<button
						className="btn-dark py-2"
						onClick={handleBlogPublish}
					>
						Publish
					</button>
					<button
						className="btn-light py-2"
						onClick={handleBlogDraft}
					>
						Save Draft
					</button>
				</div>
			</nav>

			<AnimationWrapper>
				<section>
					<div className="mx-auto max-w-[900px] w-full">
						<div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
							<label htmlFor="uploadBanner">
								<img
									src={banner}
									alt="blog-banner"
									onError={handleBannerError}
								/>
								<input
									type="file"
									id="uploadBanner"
									accept=".png, .jpg, .jpeg"
									hidden
									onChange={handleBannerUpload}
								/>
							</label>
						</div>

						<textarea
							placeholder="Blog Title"
							defaultValue={title}
							className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
							onKeyDown={handleTitleKeyDown}
							onChange={handleTitleChange}
						></textarea>

						<hr className="w-full opacity-10 my-5" />

						<div id="textEditor" className="font-gelasio"></div>
					</div>
				</section>
			</AnimationWrapper>
		</Fragment>
	)
}

export default BlogEditor
