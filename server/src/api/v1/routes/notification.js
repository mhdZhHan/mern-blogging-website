import express from "express"

// middlewares
import { verifyJWT } from "../../../middlewares/index.js"

import { newNotifications, notifications, allNotificationsCount } from "../controllers/notification.js"

const router = express.Router()

router.get("/new", verifyJWT, newNotifications)
router.post("", verifyJWT, notifications)
router.post("/count", verifyJWT, allNotificationsCount)

export default router
