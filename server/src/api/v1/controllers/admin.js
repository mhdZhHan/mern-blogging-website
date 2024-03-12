import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// models
import Blog from "../../../models/Blog.js"
import User from "../../../models/User.js"
import Notification from "../../../models/Notification.js"
import Comment from "../../../models/Comment.js"

// config
import { jwtTokenSecret } from "../../../configs/index.js"

const userData = (user) => {
	const admin_token = jwt.sign({ id: user?._id }, jwtTokenSecret)
	return {
		admin_token,
		username: user?.personal_info?.username,
		fullName: user?.personal_info?.fullName,
		profile_img: user?.personal_info?.profile_img,
	}
}

export const adminLogin = async (req, res) => {
	const { email, password } = req?.body

	User.findOne({ "personal_info.email": email })
		.then((user) => {
			if (!user) {
				return res.status(403).json({
					status: 6001,
					message: "No user found with this email",
				})
			}

			if (!user.admin) {
				return res.status(403).json({
					status: 6001,
					message: "You are not an admin user",
				})
			}

			bcrypt.compare(
				password,
				user.personal_info.password,
				(error, data) => {
					if (error) {
						return res.status(403).json({
							status: 6001,
							message: "Error please try again",
						})
					}
					if (!data) {
						return res.status(403).json({
							status: 6001,
							message: "Password is incorrect",
						})
					} else {
						return res.status(200).json({
							status: 6000,
							message: "Logged in successfully",
							user: userData(user),
						})
					}
				}
			)
		})
		.catch((error) => {
			return res.status(500).json({ status: 6001, error: error?.message })
		})
}

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({ admin: false }).select("personal_info")

		const formattedUsers = users.map((user) => ({
			username: user.personal_info.username,
			fullName: user.personal_info.fullName,
			profile_img: user.personal_info.profile_img,
		}))

		res.status(200).json({
			status: 6000,
			users: formattedUsers,
		})
	} catch (error) {
		res.status(500).json({
			status: 6001,
			message: error.message,
		})
	}
}

export const deleteUser = async (req, res) => {
	const { user_id } = req.body // Assuming you pass the user ID in the URL parameters

	try {
		const user = await User.findById(user_id)

		if (!user) {
			return res.status(404).json({
				status: 6001,
				message: "User not found",
			})
		}

		await user.remove()

		res.status(200).json({
			status: 6000,
			message: "User deleted successfully",
		})
	} catch (error) {
		res.status(500).json({
			status: 6001,
			message: error.message,
		})
	}
}

export const deleteBlog = async (req, res) => {
	const { blog_id, username } = req.body
	const user_id = req.user

	console.log(user_id)

	const user = await User.findById(user_id)

	if (!user) {
		return res.status(404).json({
			status: 6001,
			message: "User not found",
		})
	}

	if (!user.admin) {
		return res.status(403).json({
			status: 6001,
			message: "You are not an admin",
		})
	}

	Blog.findOneAndDelete({ blog_id })
		.then((blog) => {
			/**
			 * deleting all of the notifications and
			 * comments based on the blog
			 */

			Notification.deleteMany({ blog: blog._id }).then((data) =>
				console.log("Notification deleted")
			)

			Comment.deleteMany({ blog_id: blog._id }).then((data) =>
				console.log("Comment deleted")
			)

			User.findOneAndUpdate(
				{ "personal_info.username": username },
				{
					$pull: { blog: blog._id },
					$inc: { "account_info.total_posts": -1 },
				}
			).then(() => {
				console.log("Blog deleted")
			})

			return res.status(200).json({
				status: 6000,
				message: "Deleted",
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}
