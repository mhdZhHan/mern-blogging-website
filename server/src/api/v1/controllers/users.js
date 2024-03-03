import User from "../../../models/User.js"

export const searchUsers = async (req, res) => {
	const { query } = req.body

	User.find({ "personal_info.username": new RegExp(query, "i") })
		.limit(50)
		.select(
			"personal_info.fullName personal_info.username personal_info.profile_img -_id"
		)
		.then((users) => {
			return res.status(200).json({
				status: 6000,
				users,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const userProfile = async (req, res) => {
	const { username } = req.body

	User.findOne({ "personal_info.username": username })
		.select("-personal_info.password -google_auth -updatedAt -blogs")
		.then((user) => {
			res.status(200).json({
				status: 6000,
				user,
			})
		})
		.catch((error) => {
			res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const updateProfileImg = async (req, res) => {
	console.log("Hello")
	const { url } = req.body

	User.findOneAndUpdate(
		{ _id: req.user },
		{ "personal_info.profile_img": url }
	)
		.then(() => {
			res.status(200).json({
				status: 6000,
				profile_img: url,
			})
		})
		.catch((error) => {
			res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

export const updateProfile = async (req, res) => {
	const { username, bio, social_links } = req.body

	const bioLimit = 150

	if (username.length < 3) {
		return res.status(403).json({
			status: 6001,
			message: "Username should be at least 3 letters long",
		})
	}

	if (bio.length > bioLimit) {
		return res.status(403).json({
			status: 6001,
			message: `Bio should not be more than ${bioLimit}`,
		})
	}

	let socialLinksArray = Object.keys(social_links)

	try {
		for (let i = 0; i < socialLinksArray.length; i++) {
			if (social_links[socialLinksArray[i]].length) {
				let hostname = new URL(social_links[socialLinksArray[i]])
					.hostname

				/**
				 * check the social_links are platform provided or not
				 */
				if (
					!hostname.includes(`${socialLinksArray[i].com}`) &&
					socialLinksArray[i] != "website"
				) {
					return res.status(500).json({
						status: 6001,
						message: `${socialLinksArray[i]} link is invalid. You must enter a full link`,
					})
				}
			}
		}
	} catch (error) {
		return res.status(403).json({
			status: 6001,
			message: "You must provide fill social links with http(s) included",
		})
	}

	const userObj = {
		"personal_info.username": username,
		"personal_info.bio": bio,
		social_links,
	}

	/**
	 * `runValidators` will validate the user details before saving to db
	 * the validation is based on mongoose model
	 * it will check the username and email are still unique or not and other stuffs
	 */

	User.findOneAndUpdate({ _id: req.user }, userObj, { runValidators: true })
		.then(() => {
			return res.status(200).json({
				status: 6000,
				username,
			})
		})
		.catch((error) => {
			if (error.code == 11000) {
				return res.status(409).json({
					status: 6001,
					message: "Username is already taken",
				})
			}
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}
