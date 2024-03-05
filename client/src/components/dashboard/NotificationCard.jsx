import { Link } from "react-router-dom"

// utils
import { getFullDay } from "../../utils/getDate"
import { useState } from "react"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"

// components
import NotificationCommentField from "./NotificationCommentField"

const NotificationCard = ({ data, index, notificationState }) => {
	const [isReplying, setIsReplying] = useState(false)

	const {
		userData: {
			access_token,
			profile_img: author_profile_img,
			username: author_username,
			fullName: author_fullName,
		},
	} = useStateContext()

	const {
		_id: notification_id,
		user,
		user: {
			personal_info: { profile_img, username, fullName },
		},
		blog: { _id, blog_id, title },
		type,
		replied_on_comment,
		comment,
		createdAt,
		reply,
	} = data

	const handleReplyClick = () => {
		setIsReplying((preVal) => !preVal)
	}

	const handleDeleteClick = () => {}

	return (
		<div className="p-6 border-b border-grey border-l-black">
			<div className="flex gap-5 mb-3">
				<img
					className="w-14 h-14 float-none rounded-full"
					src={profile_img}
					alt={username}
				/>

				<div className="w-full">
					<h1 className="font-medium text-xl text-dark-grey">
						<span className="lg:inline-block hidden capitalize">
							{fullName}
						</span>
						<Link
							className="mx-1 text-black underline"
							to={`/user/${username}`}
						>
							@{username}
						</Link>
						<span className="font-normal">
							{type == "like"
								? "liked your blog"
								: type == "comment"
								? "commented on"
								: "replied on"}
						</span>
					</h1>

					{type == "reply" ? (
						<div className="p-4 mt-4 rounded-md bg-grey">
							<p>{replied_on_comment.comment}</p>
						</div>
					) : (
						<Link
							className="font-medium text-dark-grey hover:underline line-clamp-1"
							to={`/blog/${blog_id}`}
						>{`"${title}"`}</Link>
					)}
				</div>
			</div>

			{type != "like" ? (
				<p className="ml-14 pl-5 font-gelasio text-xl my-5">
					{comment.comment}
				</p>
			) : (
				""
			)}

			<div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
				<p>{getFullDay(createdAt)}</p>

				{type != "like" ? (
					<>
						<button
							className="underline hover:text-black"
							onClick={handleReplyClick}
						>
							Reply
						</button>
						<button
							className="underline hover:text-black"
							onClick={handleDeleteClick}
						>
							Delete
						</button>
					</>
				) : (
					""
				)}
			</div>

			{isReplying ? (
				<div className="mt-8">
					<NotificationCommentField
						_id={_id}
						blog_author={user}
						index={index}
						replyingTo={comment._id}
						setIsReplying={setIsReplying}
						notification_id={notification_id}
						notificationData={notificationState}
					/>
				</div>
			) : (
				""
			)}

			{reply && (
				<div className="ml-20 p-5 bg-grey mt-5 rounded-md">
					<div className="flex gap-3 mb-3">
						<img
							className="w-8 h-8 rounded-full"
							src={author_profile_img}
							alt={author_username}
						/>

						<div className="font-medium text-xl text-dark-grey">
							<h1>
								<Link
									className="mx-1 text-black underline"
									to={`/user/${author_username}`}
								>
									@{author_username}
								</Link>

								<span className="font-normal">replied to</span>

								<Link
									className="mx-1 text-black underline"
									to={`/user/${username}`}
								>
									@{username}
								</Link>
							</h1>
						</div>
					</div>

					<p className="ml-14 font-gelasio text-xl my-2">
						{reply.comment}
					</p>
				</div>
			)}
		</div>
	)
}

export default NotificationCard
