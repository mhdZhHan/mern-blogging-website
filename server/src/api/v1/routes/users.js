import express from 'express'

// middlewares
import { verifyJWT } from "../../../middlewares/index.js"

import { searchUsers, userProfile, updateProfileImg, updateProfile } from "../controllers/users.js"

const router = express.Router()

router.post("/search", searchUsers)
router.post("/profile", userProfile)
router.post("/update-profile-img", verifyJWT, updateProfileImg)
router.post("/update-profile", verifyJWT, updateProfile)


export default router
