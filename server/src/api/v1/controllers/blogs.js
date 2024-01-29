import { nanoid } from "nanoid"

// models
import Blog from "../../../models/Blog.js"
import User from "../../../models/User.js"
import Notification from "../../../models/Notification.js"

// configs
import { s3 } from "../../../configs/index.js"

/**
 * generating a api url for uploading images to aws s3 bucket
 *
 */
const generateUploadUrl = async () => {
    const date = new Date()
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`

    return await s3.getSignedUrlPromise("putObject", {
        Bucket: "mern-blogging-website",
        Key: imageName,
        Expires: 1000,
        ContentType: "image/jpeg",
    })
}

export const getUploadUrl = async (req, res) => {
    generateUploadUrl()
        .then((url) =>
            res.status(200).json({
                status: 6000,
                uploadUrl: url,
            })
        )
        .catch((error) =>
            res.status(500).json({
                status: 6001,
                message: error?.message,
            })
        )
}

export const createBlog = async (req, res) => {
    /**
     * id => blogId from the frontend
     */

    const authorId = req.user

    let { title, content, des, tags, banner, draft, id } = req?.body

    if (!title) {
        return res.status(403).json({
            status: 6001,
            message: "You must provide a title to publish the blog",
        })
    }

    if (!draft) {
        if (!des || des.length > 200) {
            return res.status(403).json({
                status: 6001,
                message:
                    "You must provide blog description under 200 characters",
            })
        }

        if (!banner) {
            return res.status(403).json({
                status: 6001,
                message: "You must provide a banner to publish it",
            })
        }

        if (!content.blocks.length) {
            return res.status(403).json({
                status: 6001,
                message: "There must be some blog content to publish it",
            })
        }

        if (!tags || tags.length > 10) {
            return res.status(403).json({
                status: 6001,
                message:
                    "Provide tags in order to publish the blog, Maximum 10",
            })
        }
    }

    tags = tags && tags.map((tag) => tag.toLowerCase())

    // slugify the title + unique id
    const blog_id =
        id ||
        title
            .replace(/[^a-zA-Z0-9]/g, " ")
            .replace(/\s+/g, "-")
            .trim() + nanoid()

    if (id) {
        Blog.findOneAndUpdate(
            { blog_id },
            { title, des, banner, content, tags, draft: draft ? draft : false }
        )
            .then(() => {
                res.status(200).json({
                    status: 6000,
                    message: "Successfully updated",
                    blogId: blog_id,
                })
            })
            .catch((error) => {
                res.status(500).json({
                    status: 6001,
                    message: error?.message,
                })
            })
    } else {
        const blog = new Blog({
            title,
            des,
            content,
            tags,
            banner,
            author: authorId,
            blog_id,
            draft: Boolean(draft), // the boolean() will helps set correct value
        })

        blog.save()
            .then((blog) => {
                let incrementVal = draft ? 0 : 1

                /**
                 * update the User model to
                 * increment the total_posts count and
                 * push the new blog post int user blogs
                 */
                User.findOneAndUpdate(
                    { _id: authorId },
                    {
                        $inc: { "account_info.total_posts": incrementVal },
                        $push: { blogs: blog._id },
                    }
                )
                    .then((user) => {
                        res.status(200).json({
                            status: 6000,
                            message: "Successfully created",
                            blogId: blog.blog_id,
                        })
                    })
                    .catch((error) => {
                        res.status(500).json({
                            status: 6001,
                            message: "Failed to update the total post count",
                        })
                    })
            })
            .catch((error) => {
                return res.status(500).json({
                    status: 6001,
                    message: error?.message,
                })
            })
    }
}

export const latestBlogs = async (req, res) => {
    const { page } = req.body

    const maxLimit = 5

    Blog.find({ draft: false })
        .populate(
            "author",
            "personal_info.profile_img personal_info.username personal_info.fullName -_id"
        )
        .sort({ publishedAt: -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit) // skip() will skip documents
        .limit(maxLimit)
        .then((blogs) => {
            return res.status(200).json({
                status: 6000,
                blogs,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: 6001,
                message: error?.message,
            })
        })
}

export const latestBlogsCount = async (req, res) => {
    /**
     * countDocuments() will give the total count of document
     * present in the collection
     */
    Blog.countDocuments({ draft: false })
        .then((count) => {
            return res.status(200).json({
                status: 6000,
                totalDocs: count,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: 6001,
                message: error?.message,
            })
        })
}

export const trendingBlogs = async (req, res) => {
    Blog.find({ draft: false })
        .populate(
            "author",
            "personal_info.profile_img personal_info.username personal_info.fullName -_id"
        )
        .sort({
            "activity.total_read": -1,
            "activity.total_likes": -1,
            publishedAt: -1,
        })
        .select("blog_id title publishedAt -_id")
        .limit(5)
        .then((blogs) => {
            return res.status(200).json({
                status: 6000,
                blogs,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: 6001,
                message: error?.message,
            })
        })
}

export const searchBlogs = async (req, res) => {
    /**
     * $ne: `eliminate_blog` => this will find only blog id not equals to `eliminate_blog`
     */
    const { tag, query, author, page, limit, eliminate_blog } = req.body

    let findQuery

    if (tag) {
        findQuery = {
            tags: tag,
            draft: false,
            blog_id: { $ne: eliminate_blog },
        }
    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, "i") }
    } else if (author) {
        findQuery = { author, draft: false }
    }

    const maxLimit = limit ? limit : 2

    Blog.find(findQuery)
        .populate(
            "author",
            "personal_info.profile_img personal_info.username personal_info.fullName -_id"
        )
        .sort({ publishedAt: -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then((blogs) => {
            return res.status(200).json({
                status: 6000,
                blogs,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: 6001,
                message: error?.message,
            })
        })
}

export const searchBlogsCount = async (req, res) => {
    const { tag, author, query } = req.body

    let findQuery

    if (tag) {
        findQuery = { tags: tag, draft: false }
    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, "i") }
    } else if (author) {
        findQuery = { author, draft: false }
    }

    Blog.countDocuments(findQuery)
        .then((count) => {
            return res.status(200).json({
                status: 6000,
                totalDocs: count,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: 6001,
                message: error?.message,
            })
        })
}

export const getBlog = async (req, res) => {
    /**
     * `$inc => incrementing something`
     */

    const { blog_id, draft, mode } = req.body

    const incrementVal = mode !== "edit" ? 1 : 0

    Blog.findOneAndUpdate(
        { blog_id },
        { $inc: { "activity.total_reads": incrementVal } }
    )
        .populate(
            "author",
            "personal_info.fullName personal_info.username personal_info.profile_img"
        )
        .select("title des content banner activity publishedAt blog_id tags")
        .then((blog) => {
            /**
             * updating the `total_reads` count from the author details
             *
             * `findOneAndUpdate` is a promise so should need the catch method.
             */
            User.findOneAndUpdate(
                {
                    "personal_info.username":
                        blog.author.personal_info.username,
                },
                { $inc: { "account_info.total_reads": incrementVal } }
            ).catch((error) => {
                return res.status(500).json({
                    status: 6001,
                    message: error?.message,
                })
            })

            if (blog.draft && !draft) {
                return res.status(500).json({
                    status: 6001,
                    message: "You can not access draft blogs",
                })
            }

            return res.status(200).json({
                status: 6000,
                blog,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: 6001,
                message: error?.message,
            })
        })
}

export const likeBlog = async (req, res) => {
    const user_id = req.user

    const { _id, isUserLiked } = req.body

    const incrementVal = !isUserLiked ? 1 : -1

    Blog.findOneAndUpdate(
        { _id },
        { $inc: { "activity.total_likes": incrementVal } }
    ).then((blog) => {
        if (!isUserLiked) {
            const like = new Notification({
                type: "like",
                blog: _id,
                notification_for: blog.author,
                user: user_id,
            })

            like.save().then((notification) => {
                return res.status(200).json({
                    status: 6000,
                    liked_by_user: true,
                })
            })
        } else {
            Notification.findOneAndDelete({
                user: user_id,
                blog: _id,
                type: "like",
            })
                .then((data) => {
                    return res.status(200).json({
                        status: 6000,
                        liked_by_user: false,
                    })
                })
                .catch((error) => {
                    return res.status(500).json({
                        status: 6001,
                        message: error?.message,
                    })
                })
        }
    })
}

export const isUserLiked = async (req, res) => {
    /**
     * request for sending information about currently logged
     * user is liked the blog post or not
     */

    const user_id = req.user

    const { _id } = req.body

    Notification.exists({ user: user_id, type: "like", blog: _id })
        .then((result) => {
            return res.status(200).json({
                status: 6000,
                result,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: 6001,
                message: error?.message,
            })
        })
}
