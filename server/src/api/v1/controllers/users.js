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
