import bcrypt from "bcrypt"
import { nanoid } from "nanoid"
import jwt from "jsonwebtoken"
import { getAuth } from "firebase-admin/auth"

// config
import { jwtTokenSecret } from "../../../configs/index.js"
// utils
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../../utils/index.js"
// models
import User from "../../../models/User.js"

const userData = (user) => {
	const access_token = jwt.sign({ id: user?._id }, jwtTokenSecret)
	return {
		access_token,
		username: user?.personal_info?.username,
		fullName: user?.personal_info?.fullName,
		profile_img: user?.personal_info?.profile_img,
	}
}

const generateUsername = async (email) => {
	let username = email.split("@")[0]

	const isUsername = await User.exists({
		"personal_info.username": username,
	}).then((result) => result)

	console.log("isUsername: ", isUsername)

	isUsername ? (username += nanoid().substring(0, 5)) : username

	return username
}

export const signup = async (req, res) => {
	const { fullName, email, password } = req.body

	// validation
	if (!fullName || fullName.length < 3) {
		return res.status(403).json({
			status: 6001,
			message: "Full name must be at least 3 letter long",
		})
	}
	if (!email) {
		return res.status(403).json({ status: 6001, message: "Enter email" })
	}
	if (!EMAIL_REGEX.test(email)) {
		return res
			.status(403)
			.json({ status: 6001, message: "Email is invalid" })
	}
	if (!PASSWORD_REGEX.test(password)) {
		return res.status(403).json({
			status: 6001,
			message:
				"Password should be 6 to 20 characters long with a numeric,1 lowercase and 1 uppercase letters",
		})
	}

	// password hashing
	bcrypt.hash(password, 10, async (error, hashedPassword) => {
		const username = await generateUsername(email)

		// create new user
		const user = new User({
			personal_info: {
				fullName,
				email,
				password: hashedPassword,
				username,
			},
		})

		user.save()
			.then((user) => {
				return res.status(200).json({
					status: 6000,
					message: "User created successfully",
					user: userData(user),
				})
			})
			.catch((error) => {
				if (error.code === 11000) {
					return res
						.status(500)
						.json({ status: 6001, message: "Email already exist" })
				}

				return res.status(500).json({
					status: 6001,
					message: error?.message,
				})
			})
	})
}

export const signin = async (req, res) => {
	const { email, password } = req?.body

	User.findOne({ "personal_info.email": email })
		.then((user) => {
			if (!user) {
				return res.status(403).json({
					status: 6001,
					message: "No user found with this email",
				})
			}

			if (!user.google_auth) {
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
			} else {
				return res.status(403).json({
					status: 6001,
					message:
						"Account was created using google. Try logging with google.",
				})
			}
		})
		.catch((error) => {
			return res.status(500).json({ status: 6001, error: error?.message })
		})
}

export const googleAuth = async (req, res) => {
	const { access_token } = req?.body

	getAuth()
		.verifyIdToken(access_token)
		.then(async (decodedUser) => {
			let { email, name, picture } = decodedUser

			picture = picture.replace("s96-c", "s384-c")

			let user = await User.findOne({
				"personal_info.email": email,
			})
				.select(
					"personal_info.fullName personal_info.username personal_info.profile_img google_auth"
				)
				.then((user) => {
					return user | null
				})
				.catch((error) => {
					return res
						.status(500)
						.json({ status: 6001, message: error?.message })
				})

			if (user) {
				// login
				if (!user.google_auth) {
					return res.status(403).json({
						status: 6001,
						message:
							"This email was signed up without google. Please login with password to access the account",
					})
				}
			} else {
				// signup
				const username = await generateUsername(email)

				user = new User({
					personal_info: {
						fullName: name,
						email,
						profile_img: picture,
						username,
					},
					google_auth: true,
				})

				await user
					.save()
					.then((user) => {
						user = user
					})
					.catch((error) => {
						res.status(500).json({
							status: 6001,
							message: error?.message,
						})
					})
			}

			return res.status(200).json({
				status: 6000,
				message: "Logged in successfully",
				user: userData(user),
			})
		})
		.catch((error) => {
			// console.log(error)
			return res.status(500).json({
				status: 6001,
				message:
					"Failed to authenticate you with this google account. Try with some other google account",
			})
		})
}

export const changePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body

	if (
		!PASSWORD_REGEX.test(currentPassword) ||
		!PASSWORD_REGEX.test(newPassword)
	) {
		return res.status(403).json({
			status: 6001,
			message:
				"Password should be 6 to 20 characters long with a numeric,1 lowercase and 1 uppercase letters",
		})
	}

	User.findOne({ _id: req.user })
		.then((user) => {
			if (user.google_auth) {
				return res.status(403).json({
					status: 6001,
					message:
						"You can't change the password because you logged in through google",
				})
			}

			bcrypt.compare(
				currentPassword,
				user.personal_info.password,
				(error, result) => {
					if (error) {
						return res.status(500).json({
							status: 6001,
							message:
								"Some error occured while changing the password, please try again later",
						})
					}

					if (!result) {
						return res.status(403).json({
							status: 6001,
							message: "Incorrect current password",
						})
					}

					bcrypt.hash(newPassword, 10, (error, hashedPassword) => {
						User.findOneAndUpdate(
							{ _id: req.user },
							{ "personal_info.password": hashedPassword }
						)
							.then((user) => {
								return res.status(200).json({
									status: 6000,
									message: "Password changed",
								})
							})
							.catch((error) => {
								return res.status(500).json({
									status: 6001,
									message:
										"Some error occured while save new password, please try again later",
								})
							})
					})
				}
			)
		})
		.catch((error) => {
			console.log(error)
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}
