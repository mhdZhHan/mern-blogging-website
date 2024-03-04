//models
import Notification from "../../../models/Notification.js"

export const newNotification = async (req, res) => {
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
