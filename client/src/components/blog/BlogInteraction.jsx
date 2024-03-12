import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast"
import axios from "axios"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"
import { BlogContext } from "../../screens/Blog"

const BlogInteraction = () => {
	let {
		blog,
		blog: {
			_id,
			blog_id,
			title,
			activity,
			activity: { total_likes, total_comments },
			author: {
				personal_info: { username: username_ },
			},
		},
		setBlog,
		isUserLiked,
		setIsUserLiked,
		setIsCommentsWrapper,
	} = useContext(BlogContext)

	const {
		userData: { username, access_token },
	} = useStateContext()

	useEffect(() => {
		if (access_token) {
			// make request to server to get the information
			axios
				.post(
					`${import.meta.env.VITE_API_URL}/blogs/is-user-liked`,
					{ _id },
					{
						headers: {
							Authorization: `Bearer ${access_token}`,
						},
					}
				)
				.then(({ data }) => {
					/**
					 * if the user will liked it will give an object
					 * otherwise give an empty {} object
					 *
					 * so convert the `data.result` into boolean and `setIsUserLiked()`
					 */
					setIsUserLiked(Boolean(data?.result))
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}, [])

	// ANCHOR like blog post
	const handleLike = () => {
		if (access_token) {
			setIsUserLiked((preVal) => !preVal)

			!isUserLiked ? total_likes++ : total_likes--

			setBlog({ ...blog, activity: { ...activity, total_likes } })

			axios
				.post(
					`${import.meta.env.VITE_API_URL}/blogs/like-blog`,
					{
						_id,
						isUserLiked,
					},
					{
						headers: {
							Authorization: `Bearer ${access_token}`,
						},
					}
				)
				.then(({ data }) => {
					console.log(data)
				})
				.catch((error) => {
					console.log(error)
				})
		} else {
			// not logged in
			toast.error("Please login to like this blog.")
		}
	}
	return (
		<>
			<hr className="border-grey my-2" />

			<div className="flex gap-6 justify-between">
				<div className="flex gap-3 items-center">
					<button
						className={
							"w-10 h-10 rounded-full flex items-center justify-center " +
							(isUserLiked ? "bg-red/20 text-red" : "bg-grey/80")
						}
						onClick={handleLike}
					>
						<i
							className={
								"fi " +
								(isUserLiked ? "fi-sr-heart" : "fi-rr-heart")
							}
						></i>
					</button>
					<p className="text-xl text-dark-grey">{total_likes}</p>

					<button
						className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
						onClick={() =>
							setIsCommentsWrapper((prevVal) => !prevVal)
						}
					>
						<i className="fi fi-rr-comment-dots"></i>
					</button>
					<p className="text-xl text-dark-grey">{total_comments}</p>

					<Link
						to={`/report/${blog_id}`}
						className="flex items-center justify-center ml-2 underline"
					>
						<p className="text-xl text-dark-grey">Report</p>
					</Link>
				</div>

				<div className="flex gap-6 items-center">
					{username === username_ ? (
						<Link
							to={`/editor/${blog_id}`}
							className="underline hover:text-purple"
						>
							Edit
						</Link>
					) : (
						""
					)}

					<Link
						to={`https://x.com/intent/tweet?text=Read ${title}&url=${location.href}`}
					>
						<i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
					</Link>
				</div>
			</div>

			<hr className="border-grey my-2" />
		</>
	)
}

export default BlogInteraction
