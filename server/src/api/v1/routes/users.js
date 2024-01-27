import express from 'express'

import { searchUsers } from "../controllers/users.js"

const router = express.Router()

router.post("/search", searchUsers)


export default router
