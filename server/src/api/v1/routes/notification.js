import express from "express"

// middlewares
import { verifyJWT } from "../../../middlewares/index.js"

import { newNotification } from "../controllers/notification.js"

const router = express.Router()

router.get("/new", verifyJWT, newNotification)

export default router
