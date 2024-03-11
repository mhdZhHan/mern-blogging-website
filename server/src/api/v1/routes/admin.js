import express from "express"

// middlewares
import { verifyJWT } from "../../../middlewares/index.js"

import { adminLogin, getAllUsers, deleteUser } from "../controllers/admin.js"

const router = express.Router()

router.post("/login", adminLogin)
router.get("/all-users", verifyJWT, getAllUsers)
router.post("/delete-user", verifyJWT, deleteUser)

export default router
