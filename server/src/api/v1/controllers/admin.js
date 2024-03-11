import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// models
import User from "../../../models/User.js"
import Blog from "../../../models/Blog.js"

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
	const { blogId } = req.params
	const userId = req.user

	try {
		const blog = await Blog.findById(blogId)

		if (!blog) {
			return res.status(404).json({
				status: 6001,
				message: "Blog not found",
			})
		}

		// Check if the logged-in user is an admin
		const user = await User.findById(userId)

		if (!user || !user.admin) {
			// If user not found or not an admin, return 403 Forbidden
			return res.status(403).json({
				status: 6001,
				message: "You are not authorized to delete this blog",
			})
		}

		await blog.remove()

		res.status(200).json({
			status: 6000,
			message: "Blog deleted successfully",
		})
	} catch (error) {
		res.status(500).json({
			status: 6001,
			message: error.message,
		})
	}
}
