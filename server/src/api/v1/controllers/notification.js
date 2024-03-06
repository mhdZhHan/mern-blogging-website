//models
import Notification from "../../../models/Notification.js"

export const newNotifications = async (req, res) => {
	const user_id = req.user

	Notification.exists({
		notification_for: user_id,
		seen: false,
		user: { $ne: user_id },
	})
		.then((result) => {
			if (result) {
				return res.status(200).json({
					status: 6000,
					new_notification_available: true,
				})
			} else {
				return res.status(200).json({
					status: 6000,
					new_notification_available: false,
				})
			}
		})
		.catch((error) => {
			console.log(error)
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const notifications = (req, res) => {
	const user_id = req.user

	const { page, filter, deletedDocCount } = req.body

	const maxLimit = 10

	let findQuery = { notification_for: user_id, user: { $ne: user_id } }

	let skipDocs = (page - 1) * maxLimit

	if (filter != "all") {
		findQuery.type = filter
	}

	if (deletedDocCount) {
		skipDocs -= deletedDocCount
	}

	Notification.find(findQuery)
		.skip(skipDocs)
		.limit(maxLimit)
		.populate("blog", "title blog_id")
		.populate(
			"user",
			"personal_info.fullName personal_info.username personal_info.profile_img"
		)
		.populate("comment", "comment")
		.populate("replied_on_comment", "comment")
		.populate("reply", "comment")
		.sort({ createdAt: -1 })
		.select("createdAt type seen reply")
		.then((notifications) => {
			Notification.updateMany(findQuery, { seen: true })
				.skip(skipDocs)
				.limit(maxLimit)
				.then(() => console.log("notification seen"))

			return res.status(200).json({
				status: 6000,
				notifications,
			})
		})
		.catch((error) => {
			console.log(error)
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const allNotificationsCount = async (req, res) => {
	const user_id = req.user

	const { filter } = req.body

	let findQuery = { notification_for: user_id, user: { $ne: user_id } }

	if (filter != "all") {
		findQuery.type = filter
	}

	Notification.countDocuments(findQuery)
		.then((count) => {
			return res.status(200).json({
				status: 6000,
				totalDocs: count,
			})
		})
		.catch((error) => {
			console.log(error)
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}
