import { useEffect, useState } from "react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

// contexts
import { useStateContext } from "../contexts/GlobalContext"

import { filterPaginationData } from "../functions/paginationData"

import InPageNavigation, {
	activeTabRef,
} from "../components/common/InPageNavigation"
import Loader from "../components/common/Loader"
import NodataMessage from "../components/common/NodataMessage"
import AnimationWrapper from "../components/common/AnimationWrapper"
import {
	ManageBlogCard,
	ManageDraftBlogPost,
} from "../components/dashboard/ManageBlogCards"

const ManageBlogs = () => {
	const [blogs, setBlogs] = useState(null)
	const [drafts, setDrafts] = useState(null)
	const [query, setQuery] = useState("")

	const {
		userData: { access_token },
	} = useStateContext()

	const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
		axios
			.post(
				`${import.meta.env.VITE_API_URL}/users/blogs`,
				{
					page,
					draft,
					query,
					deletedDocCount,
				},
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			)
			.then(async ({ data }) => {
				let formattedData = await filterPaginationData({
					state: draft ? drafts : blogs,
					data: data.blogs,
					page,
					user: access_token,
					countRoute: "users/blogs-count",
					dataToSend: { draft, query },
				})

				if (draft) {
					setDrafts(formattedData)
				} else {
					setBlogs(formattedData)
				}
			})
			.catch((error) => {
				console.log(erroe)
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
		if (access_token) {
			if (blogs == null) {
				getBlogs({ page: 1, draft: false })
			}

			if (drafts == null) {
				getBlogs({ page: 1, draft: true })
			}
		}
	}, [access_token, blogs, drafts, query])

	return (
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

			<InPageNavigation
				routes={["Published Blogs", "Draft"]}
				defaultHidden={[""]}
			>
				{
					// published blogs
					blogs == null ? (
						<Loader />
					) : blogs.results.length ? (
						<>
							{blogs.results.map((blog, index) => (
								<AnimationWrapper
									key={index}
									transition={{ delay: index * 0.04 }}
								>
									<ManageBlogCard
										blog={{
											...blog,
											index,
											setStateFunc: setBlogs,
										}}
									/>
								</AnimationWrapper>
							))}
						</>
					) : (
						<NodataMessage message="No published blogs found" />
					)
				}

				{
					// drafted blogs
					drafts == null ? (
						<Loader />
					) : drafts.results.length ? (
						<>
							{drafts.results.map((blog, index) => (
								<AnimationWrapper
									key={index}
									transition={{ delay: index * 0.04 }}
								>
									<ManageDraftBlogPost
										blog={{
											...blog,
											index,
											setStateFunc: setDrafts,
										}}
									/>
								</AnimationWrapper>
							))}
						</>
					) : (
						<NodataMessage message="No draft blogs" />
					)
				}
			</InPageNavigation>
		</>
	)
}

export default ManageBlogs
