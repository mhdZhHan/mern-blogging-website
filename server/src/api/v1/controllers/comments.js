// models
import Comment from "../../../models/Comment.js"
import Blog from "../../../models/Blog.js"
import Notification from "../../../models/Notification.js"

export const addComment = (req, res) => {
	const user_id = req.user

	const { blog_id, comment, blog_author, replying_to, notification_id } =
		req.body

	if (!comment.length) {
		return res.status(403).json({
			status: 6001,
			message: "Write something to leave a comment",
		})
	}

	// creating comment document
	const commentObj = {
		blog_id: blog_id,
		blog_author,
		comment,
		commented_by: user_id,
	}

	/**
	 * the `replying_to` is not undefined it should be a replying
	 * so updating the `Comment` schema `parent` key
	 * the `parent` key value is the `id' of the parent comment
	 */
	if (replying_to) {
		commentObj.parent = replying_to
		commentObj.isReply = true
	}

	new Comment(commentObj).save().then(async (commentFile) => {
		const { comment, commentedAt, children } = commentFile

		/**
		 * if it is a replying don't increment `activity.total_parent_comments'
		 * so i'm adding a condition in the `activity.total_parent_comments' increment part
		 */
		Blog.findOneAndUpdate(
			{ _id: blog_id },
			{
				$push: { comments: commentFile._id },
				$inc: {
					"activity.total_comments": 1,
					"activity.total_parent_comments": replying_to ? 0 : 1,
				},
			}
		).then((blog) => {
			console.log("New comment created")
		})

		// creating notification
		/**
		 * if it is a replying the `type` of the notification should be `reply'
		 */
		let notificationObj = {
			type: replying_to ? "reply" : "comment",
			blog: blog_id,
			notification_for: blog_author,
			user: user_id,
			comment: commentFile._id,
		}

		/**
		 * if it is a replying updating the `Notification`
		 * schema `replied_on_comment` with the parent comment `id`
		 *
		 * also add the new comment `id` as the `children` of the `parent comment`
		 */
		if (replying_to) {
			notificationObj.replied_on_comment = replying_to

			console.log("replied_on_comment", replying_to)

			await Comment.findOneAndUpdate(
				{ _id: replying_to },
				{ $push: { children: commentFile._id } }
			)
				.then((replyingToCommentDoc) => {
					notificationObj.notification_for =
						replyingToCommentDoc.commented_by

					console.log(
						"notification_for",
						replyingToCommentDoc.commented_by
					)
				})
				.catch((error) => {
					console.log(error)
				})

			if (notification_id) {
				Notification.findOneAndUpdate(
					{ _id: notification_id },
					{ reply: commentFile._id }
				).then(() => console.log("Notification updated"))
			}
		}

		new Notification(notificationObj)
			.save()
			.then((notification) =>
				console.log("Notification created", notification)
			)

		return res.status(200).json({
			status: 6000,
			comment,
			commentedAt,
			_id: commentFile._id,
			user_id,
			children,
		})
	})
}

export const getComments = async (req, res) => {
	const { blog_id, skip } = req.body

	const maxLimit = 5

	Comment.find({ blog_id, isReply: false })
		.populate(
			"commented_by",
			"personal_info.username personal_info.fullName personal_info.profile_img"
		)
		.skip(skip)
		.limit(maxLimit)
		.sort({ commentedAt: -1 })
		.then((comments) => {
			// console.log(comments, blog_id, skip)

			res.status(200).json({
				status: 6000,
				comments,
			})
		})
		.catch((error) => {
			console.log(error?.message)
			res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const getReplies = async (req, res) => {
	const { _id, skip } = req.body

	const maxLimit = 5

	Comment.findOne({ _id })
		.populate({
			path: "children",
			options: {
				limit: maxLimit,
				skip: skip,
				sort: { commentedAt: -1 },
			},
			populate: {
				path: "commented_by",
				select: "personal_info.username personal_info.fullName personal_info.profile_img",
			},
			select: "-blog_id -updatedAt",
		})
		.select("children")
		.then((doc) => {
			return res.status(200).json({
				status: 6000,
				replies: doc.children,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

function deleteComments(_id) {
	Comment.findOneAndDelete({ _id })
		.then((comment) => {
			if (comment.parent) {
				Comment.findOneAndUpdate(
					{ id: comment.parent },
					{ $pull: { children: _id } }
				)
					.then((data) => console.log("Comment delete from parent"))
					.catch((error) =>
						console.log("Deletion error from the parent", error)
					)
			}

			Notification.findOneAndDelete({ comment: _id }).then(
				(notification) => console.log("Comment notification deleted")
			)

			Notification.findOneAndDelete({ reply: _id }).then((notification) =>
				console.log("Reply notification deleted")
			)

			Blog.findOneAndUpdate(
				{ _id: comment.blog_id },
				{
					$pull: { comments: _id },
					$inc: {
						"activity.total_comments": -1,
						"activity.total_parent_comments": comment.parent
							? 0
							: -1,
					},
				}
			).then((blog) => {
				if (comment.children.length) {
					comment.children.forEach((replies) => {
						deleteComments(replies) // recursion
					})
				}
			})
		})
		.catch((error) => {
			console.log(error?.message)
		})
}

export const deleteComment = (req, res) => {
	const user_id = req.user

	const { _id } = req.body

	Comment.findOne({ _id })
		.then((comment) => {
			if (
				user_id == comment.commented_by ||
				user_id == comment.blog_author
			) {
				deleteComments(_id)

				return res.status(200).json({
					status: 6000,
					message: "Deleted",
				})
			} else {
				return res.status(403).json({
					status: 6001,
					message: "You can't delete the comment",
				})
			}
		})
		.catch((error) => {
			console.log("Comment finding error", error)
		})
}
