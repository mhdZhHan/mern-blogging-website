import express from 'express'

import { searchUsers, userProfile } from "../controllers/users.js"

const router = express.Router()

router.post("/search", searchUsers)
router.post("/profile", userProfile)


export default router
