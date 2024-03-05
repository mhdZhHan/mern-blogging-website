import React, { useContext, useState } from "react"
import toast from "react-hot-toast"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"
import { BlogContext } from "../../screens/Blog"

// utils
import { getDate } from "../../utils/getDate"

// components
import CommentField from "./CommentField"
import axios from "axios"

const CommentCard = ({ index, leftVal, commentData }) => {
	// ANCHOR contexts and props
	const {
		blog,
		blog: {
			comments,
			comments: { results: commentsArray },
			activity,
			activity: { total_parent_comments },
			author: {
				personal_info: { username: blog_author },
			},
		},
		setBlog,
		setTotalParentCommentsLoaded,
	} = useContext(BlogContext)

	const {
		commented_by: {
			personal_info: {
				username: commented_by_username,
				fullName,
				profile_img,
			},
		},
		commentedAt,
		comment,
		_id,
		children,
	} = commentData

	const {
		userData: { access_token, username },
	} = useStateContext()

	// ANCHOR states

	const [isReplying, setIsReplying] = useState(false)

	// ANCHOR other functions

	const getParentIndex = () => {
		let startingPoint = index - 1

		try {
			while (
				commentsArray[startingPoint].children >=
				commentData.childrenLevel
			) {
				startingPoint--
			}
		} catch (error) {
			startingPoint = undefined
		}

		return startingPoint
	}

	const handleReplyClick = () => {
		if (!access_token) {
			return toast.error("Login first to leave a reply")
		}

		setIsReplying((preVal) => !preVal)
	}

	const removeCommentsCard = (startingPoint, isDelete = false) => {
		if (commentsArray[startingPoint]) {
			while (
				commentsArray[startingPoint].childrenLevel >
				commentData.childrenLevel
			) {
				commentsArray.splice(startingPoint, 1)

				if (!commentsArray[startingPoint]) {
					break
				}
			}
		}

		if (isDelete) {
			let parentIndex = getParentIndex()

			if (parentIndex != undefined) {
				commentsArray[parentIndex].children = commentsArray[
					parentIndex
				].children.filter((child) => child != _id)

				if (!commentsArray[parentIndex].children.length) {
					commentsArray[parentIndex].isReplyLoaded = false
				}
			}

			commentsArray.splice(index, 1)
		}

		if (commentData.childrenLevel == 0 && isDelete) {
			setTotalParentCommentsLoaded((preVal) => preVal - 1)
		}

		setBlog({
			...blog,
			comments: { results: commentsArray },
			activity: {
				...activity,
				total_parent_comments:
					total_parent_comments - commentData.childrenLevel == 0 &&
					isDelete
						? 1
						: 0,
			},
		})
	}

	const deleteComment = (event) => {
		/**
		 * the `disabled` attribute will stop multiple clicking on the button
		 */
		event.target.setAttribute("disabled", true)

		axios
			.post(
				`${import.meta.env.VITE_API_URL}/comments/delete`,
				{ _id },
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			)
			.then(() => {
				event.target.removeAttribute("disabled", true)
				removeCommentsCard(index + 1, true)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const hideReplies = () => {
		commentData.isReplyLoaded = false

		removeCommentsCard(index + 1)
	}

	const loadReplies = ({ skip = 0, currentIndex = index }) => {
		if (commentsArray[currentIndex].children.length) {
			hideReplies()

			axios
				.post(`${import.meta.env.VITE_API_URL}/comments/get/replies`, {
					_id: commentsArray[currentIndex]._id,
					skip,
				})
				.then(({ data: { replies } }) => {
					console.log("replies", replies)

					commentsArray[currentIndex].isReplyLoaded = true

					for (let i = 0; i < replies.length; i++) {
						replies[i].childrenLevel =
							commentsArray[currentIndex].childrenLevel + 1
						commentsArray.splice(
							currentIndex + 1 + i + skip,
							0,
							replies[i]
						)
					}

					setBlog({
						...blog,
						comments: { ...comments, results: commentsArray },
					})
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	//ANCHOR Other Components

	const LoadMoreRepliesButton = () => {
		let parentIndex = getParentIndex()

		let button = (
			<button
				className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
				onClick={() =>
					loadReplies({
						skip: index - parentIndex,
						currentIndex: parentIndex,
					})
				}
			>
				Load More Replies
			</button>
		)

		if (commentsArray[index + 1]) {
			if (
				commentsArray[index + 1].childrenLevel <
				commentsArray[index].childrenLevel
			) {
				if (
					index - parentIndex <
					commentsArray[parentIndex].children.length
				) {
					return button
				}
			}
		} else {
			if (parentIndex) {
				return button
			}
		}
	}

	return (
		<div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
			<div className="my-5 p-6 rounded-md border border-grey">
				<div className="flex gap-3 items-center mb-8">
					<img
						className="w-6 h-6 rounded-full"
						src={profile_img}
						alt={commented_by_username}
					/>
					<p className="line-clamp-1">
						{fullName} @{commented_by_username}
					</p>
					<p className="min-w-fit">{getDate(commentedAt)}</p>
				</div>

				<p className="font-gelasio text-xl ml-3">{comment}</p>

				<div className="flex gap-5 items-center mt-5">
					{commentData.isReplyLoaded ? (
						<button
							className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
							onClick={hideReplies}
						>
							<i className="fi fi-rs-comment-dots"></i>
							Hide Reply
						</button>
					) : (
						<button
							className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
							onClick={loadReplies}
						>
							<i className="fi fi-rs-comment-dots"></i>
							{children.length} Reply
						</button>
					)}

					<button className="underline" onClick={handleReplyClick}>
						Reply
					</button>

					{username == commented_by_username ||
					username == blog_author ? (
						<button
							className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center"
							onClick={deleteComment}
						>
							<i className="fi fi-rr-trash pointer-events-none"></i>
						</button>
					) : (
						""
					)}
				</div>
				{isReplying && (
					<div className="mt-8">
						<CommentField
							action="Reply"
							index={index}
							replyingTo={_id}
							setIsReplying={setIsReplying}
						/>
					</div>
				)}
			</div>

			<LoadMoreRepliesButton />
		</div>
	)
}

export default CommentCard
