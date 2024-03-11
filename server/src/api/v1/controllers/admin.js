import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// models
import User from "../../../models/User.js"

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
