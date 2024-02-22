import express from "express"

// middlewares
import { verifyJWT } from "../../../middlewares/index.js"

import { addComment, getComments, getReplies } from "../controllers/comments.js"

const router = express.Router()

router.post("/add", verifyJWT, addComment)
router.post("/get", getComments)
router.post("/get/replies", getReplies)

export default router
