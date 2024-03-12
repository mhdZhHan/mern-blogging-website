import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

// utils
import { getFullDay } from "../../utils/getDate"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"

const BlogStats = ({ stats }) => {
	return (
		<div className="flex gap-2 max-lg:mb-6  max-lg:pb-6 border-grey max-lg:border-b">
			{Object.keys(stats).map(
				(key, index) =>
					!key.includes("parent") && (
						<div
							key={index}
							className={
								"flex flex-col items-center w-full h-full justify-center p-4 px-6 " +
								(index != 0 ? "border-grey border-l" : "")
							}
						>
							<h1 className="text-xl lg:text-2xl mb-2">
								{stats[key].toLocaleString()}
							</h1>
							<p className="max-lg:text-dark-grey capitalize">
								{key.split("_")[1]}
							</p>
						</div>
					)
			)}
		</div>
	)
}

const BlogCard = ({ blog, setBlogs, index }) => {
	const {
		banner,
		title,
		blog_id,
		publishedAt,
		activity,
		author: {
			personal_info: { username },
		},
	} = blog

	const [showState, setShowState] = useState(false)

	const {
		adminData: { admin_token },
	} = useStateContext()

	const handleDeleteBlog = (event) => {
		event.target.setAttribute("disabled", true)

		axios
			.post(
				`${import.meta.env.VITE_API_URL}/admin/delete-blog`,
				{ blog_id, username },
				{
					headers: {
						Authorization: `Bearer ${admin_token}`,
					},
				}
			)
			.then(({ data }) => {
				event.target.removeAttribute("disabled")

				setBlogs((preVal) => {
					let { deletedDocCount, totalDocs, results } = preVal

					results.splice(index, 1)

					if (!deletedDocCount) {
						deletedDocCount = 0
					}

					if (!results.length && totalDocs - 1 > 0) {
						return null
					}

					console.log("Hello ", {
						...preVal,
						totalDocs: totalDocs - 1,
						deletedDocCount: deletedDocCount + 1,
					})

					return {
						...preVal,
						totalDocs: totalDocs - 1,
						deletedDocCount: deletedDocCount + 1,
					}
				})
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<>
			<div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
				<img
					className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none object-cover bg-grey"
					src={banner}
					alt={title}
				/>

				<div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
					<div>
						<Link
							className="blog-title mb-4 hover:underline"
							to={`/blog/${blog_id}`}
						>
							{title}
						</Link>
						<p className="line-clamp-1">
							Published on {getFullDay(publishedAt)}
						</p>
					</div>

					<div className="flex gap-6 mt-3">
						<button
							className="lg:hidden pr-4 py-2 underline"
							onClick={() => setShowState((preVal) => !preVal)}
						>
							Stats
						</button>

						<button
							onClick={handleDeleteBlog}
							className="pr-4 py-2 underline text-red"
						>
							Delete
						</button>
					</div>
				</div>

				<div className="max-lg:hidden">
					<BlogStats stats={activity} />
				</div>
			</div>

			{showState && (
				<div className="lg:hidden">
					<BlogStats stats={activity} />
				</div>
			)}
		</>
	)
}

export default BlogCard
