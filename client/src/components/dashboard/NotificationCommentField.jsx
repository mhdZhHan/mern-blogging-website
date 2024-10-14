import { useContext, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"

const NotificationCommentField = ({
	_id,
	blog_author,
	index = undefined,
	replyingTo = undefined,
	setIsReplying,
	notification_id,
	notificationData,
}) => {
	const [comment, setComment] = useState("")

	const {
		userData: { access_token },
	} = useStateContext()

	const { _id: user_id } = blog_author
	const {
		notifications,
		notifications: { results },
		setNotifications,
	} = notificationData

	const handleComment = () => {
		if (!comment.length) {
			return toast.error("Write something to leave a comment...")
		}

		axios
			.post(
				`/api/v1/comments/add`,
				{
					blog_id: _id,
					blog_author: user_id,
					comment,
					replying_to: replyingTo,
					notification_id,
				},
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			)
			.then(({ data }) => {
				setComment("")
				setIsReplying(false)

				results[index].reply = { comment, _id: data._id }
				setNotifications({ ...notifications, results })
			})
			.catch(({ error }) => {
				console.log(error?.message)
			})
	}

	return (
		<>
			<Toaster />

			<textarea
				value={comment}
				onChange={(event) => setComment(event.target.value)}
				placeholder="Leave a comment..."
				className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
			></textarea>

			<button className="btn-dark mt-5 px-10" onClick={handleComment}>
				Reply
			</button>
		</>
	)
}

export default NotificationCommentField
