import React from "react"
import { Link } from "react-router-dom"

const UserCard = ({ user }) => {
	const { profile_img, username, fullName } = user
	return (
		<div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
			<Link to={`/user/${username}`} className="flex-none">
				<img
					className="max-md:hidden lg:hidden xl:block w-28 h-28 object-cover bg-gray-300 rounded-md"
					src={profile_img}
					alt={fullName}
				/>
			</Link>

			<div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
				<div>
					<h2 className="text-xl font-bold mb-4">
						<Link
							to={`/user/${username}`}
							className="hover:underline"
						>
							{fullName}
						</Link>
					</h2>
					<p className="line-clamp-1">@{username}</p>
				</div>

				<div className="flex gap-6 mt-3">
					<button
						// onClick={onDelete}
						className="pr-4 py-2 underline text-red"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	)
}

export default UserCard
