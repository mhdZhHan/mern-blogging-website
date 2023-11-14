import express from "express"

// middlewares
import { verifyJWT } from "../../../middlewares/index.js"
import { getUploadUrl, createBlog, latestBlogs, trendingBlogs } from "../controllers/blogs.js"

const router = express.Router()

router.get("/get-upload-url", verifyJWT, getUploadUrl)
router.post("/create", verifyJWT, createBlog)
router.get("/latest", latestBlogs)
router.get("/trending", trendingBlogs)

export default router
