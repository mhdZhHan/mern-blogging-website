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
import UserCard from "../../components/admin/UserCard"

const Blogs = () => {
	const {
		adminData: { admin_token },
	} = useStateContext()

	const [users, setUsers] = useState(null)
	const [query, setQuery] = useState("")

	const getUsers = () => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/admin/all-users`, {
				headers: {
					Authorization: `Bearer ${admin_token}`,
				},
			})
			.then(async ({ data }) => {
				console.log(data.users)
				setUsers(data.users)
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
		getUsers()
	}, [])

	return admin_token ? (
		<>
			<h1 className="max-md:hidden">Manage Users</h1>
			<Toaster />

			<div className="relative max-md:mt-5 md:mt-8 mb-10">
				<input
					type="search"
					className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
					placeholder="Search Users"
					onChange={handleChange}
					onKeyDown={handleSearch}
				/>

				<i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
			</div>

			{users == null ? (
				<Loader />
			) : users.length ? (
				<>
					{users.map((user, index) => (
						<AnimationWrapper
							key={index}
							transition={{ delay: index * 0.04 }}
						>
							<UserCard user={user} />
						</AnimationWrapper>
					))}
				</>
			) : (
				<NodataMessage message="No published users found" />
			)}
		</>
	) : (
		<Navigate to="/admin/login" />
	)
}

export default Blogs
