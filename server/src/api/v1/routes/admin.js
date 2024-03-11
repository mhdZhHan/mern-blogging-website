import express from "express"

// middlewares
import { verifyJWT } from "../../../middlewares/index.js"

import {
	adminLogin
} from "../controllers/admin.js"

const router = express.Router()

router.post("/login", adminLogin)

export default router
