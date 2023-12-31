import express from "express"

// middlewares
import { verifyJWT } from "../../../middlewares/index.js"
import {
    getUploadUrl,
    createBlog,
    latestBlogs,
    trendingBlogs,
    searchBlog,
    latestBlogsCount,
    searchBlogsCount,
} from "../controllers/blogs.js"

const router = express.Router()

router.get("/get-upload-url", verifyJWT, getUploadUrl)
router.post("/create", verifyJWT, createBlog)

router.post("/search", searchBlog)
router.post("/search/total-posts", searchBlogsCount)


router.post("/latest", latestBlogs)
router.post("/latest/total-posts", latestBlogsCount)

router.get("/trending", trendingBlogs)

export default router
