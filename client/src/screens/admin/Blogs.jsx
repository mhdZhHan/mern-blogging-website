import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import axios from "axios"
import { Toaster } from "react-hot-toast"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"

// functions
import { filterPaginationData } from "../../functions/paginationData"

// components
import Loader from "../../components/common/Loader"
import NodataMessage from "../../components/common/NodataMessage"
import AnimationWrapper from "../../components/common/AnimationWrapper"
import LoadMoreBtn from "../../components/common/buttons/LoadMoreBtn"
import BlogCard from "../../components/admin/BlogCard"

const Blogs = () => {
	const {
		adminData: { admin_token },
	} = useStateContext()

	const [blogs, setBlogs] = useState(null)
	const [query, setQuery] = useState("")

	const getBlogs = ({ page = 1 }) => {
		axios
			.post(`${import.meta.env.VITE_API_URL}/blogs/latest`, { page })
			.then(async ({ data }) => {
				// setBlogs(data?.blogs)

				const formattedData = await filterPaginationData({
					state: blogs,
					data: data?.blogs,
					page,
					countRoute: "blogs/latest/total-posts",
				})

				setBlogs(formattedData)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const handleChange = (event) => {
		const searchQuery = event.target.value

		setQuery(searchQuery)

		if (event.keyCode == 13 && searchQuery.length) {
			setBlogs(null)
			setDrafts(null)
		}
	}

	const handleSearch = (event) => {
		if (!event.target.value.length) {
			setQuery("")
			setBlogs(null)
			setDrafts(null)
		}
	}

	useEffect(() => {
		getBlogs({ page: 1 })
	}, [])

	return admin_token ? (
		<>
			<h1 className="max-md:hidden">Manage Blogs</h1>
			<Toaster />

			<div className="relative max-md:mt-5 md:mt-8 mb-10">
				<input
					type="search"
					className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
					placeholder="Search blogs"
					onChange={handleChange}
					onKeyDown={handleSearch}
				/>

				<i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
			</div>

			{blogs == null ? (
				<Loader />
			) : blogs.results.length ? (
				<>
					{blogs.results.map((blog, index) => (
						<AnimationWrapper
							key={index}
							transition={{ delay: index * 0.04 }}
						>
							<BlogCard
								blog={blog}
								setBlogs={setBlogs}
								index={index}
							/>
						</AnimationWrapper>
					))}

					<LoadMoreBtn
						state={blogs}
						fetchDataFunc={getBlogs}
						additionalParam={{
							draft: false,
							deletedDocCount: blogs.deletedDocCount,
						}}
					/>
				</>
			) : (
				<NodataMessage message="No published blogs found" />
			)}
		</>
	) : (
		<Navigate to="/admin/login" />
	)
}

export default Blogs
