import { createContext, useEffect, useState } from "react"
import axios from "axios"
import { Link, useParams } from "react-router-dom"

// utils
import { getDate } from "../utils/getDate"

// components
import AnimationWrapper from "../components/common/AnimationWrapper"
import Loader from "../components/common/Loader"
import BlogInteraction from "../components/blog/BlogInteraction"
import BlogCard from "../components/common/cards/BlogCard"
import BlogContent from "../components/blog/BlogContent"

export const blogStructure = {
    title: "",
    banner: "",
    content: [],
    author: { personal_info: {} },
    publishedAt: "",
    tags: [],
}

export const BlogContext = createContext({})

const Blog = () => {
    const [blog, setBlog] = useState(blogStructure)
    const [loading, setLoading] = useState(true)
    const [similarBlogs, setSimilarBlogs] = useState(null)

    const { blogId } = useParams()

    const {
        title,
        content,
        banner,
        author: {
            personal_info: { fullName, username: username_, profile_img },
        },
        publishedAt,
        tags,
    } = blog

    const fetchBlog = () => {
        axios
            .post(`${import.meta.env.VITE_API_URL}/blogs/get-blog`, {
                blog_id: blogId,
            })
            .then(({ data }) => {
                setBlog(data?.blog)

                /**
                 * get similar blogs related to first tag
                 *
                 * eliminate_blog => remove the current opened blog from the recommendation
                 */

                axios
                    .post(`${import.meta.env.VITE_API_URL}/blogs/search`, {
                        tag: tags[0],
                        limit: 6,
                        eliminate_blog: blogId,
                    })
                    .then(({ data }) => {
                        setSimilarBlogs(data?.blogs)
                        console.log(data?.blogs)
                    })

                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
            })
    }

    useEffect(() => {
        resetStates()
        fetchBlog()
    }, [blogId])

    const resetStates = () => {
        setBlog(blogStructure)
        setSimilarBlogs(null)
        setLoading(true)
    }

    return (
        <AnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <BlogContext.Provider value={{ blog, setBlog }}>
                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                        <img
                            src={banner}
                            alt={title}
                            className="aspect-square"
                        />

                        <div className="mt-12">
                            <h2>{title}</h2>

                            <div className="flex max-sm:flex-col justify-between my-8">
                                <div className="flex gap-5 items-start">
                                    <img
                                        src={profile_img}
                                        alt={username_}
                                        className="w-12 h-12 rounded-full"
                                    />

                                    <p className="capitalize">
                                        {fullName}
                                        <br />@
                                        <Link
                                            to={`/user/${username_}`}
                                            className="underline"
                                        >
                                            {username_}
                                        </Link>
                                    </p>
                                </div>

                                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                                    Published on {getDate(publishedAt)}
                                </p>
                            </div>
                        </div>

                        <BlogInteraction />

                        <div className="my-12 font-gelasio blog-page-content">
                            {content[0].blocks.map((block, index) => (
                                <div key={index} className="my-4 md:my-8">
                                    <BlogContent block={block} />
                                </div>
                            ))}
                        </div>

                        <BlogInteraction />

                        {similarBlogs !== null && similarBlogs.length ? (
                            <>
                                <h1 className="text-2xl mt-14 mb-10 font-medium">
                                    Similar blogs
                                </h1>

                                {similarBlogs.map((blog, index) => {
                                    const {
                                        author: { personal_info },
                                    } = blog

                                    return (
                                        <AnimationWrapper
                                            key={index}
                                            transition={{
                                                duration: 1,
                                                delay: index * 0.08,
                                            }}
                                        >
                                            <BlogCard
                                                blog={blog}
                                                author={
                                                    blog?.author?.personal_info
                                                }
                                            />
                                        </AnimationWrapper>
                                    )
                                })}
                            </>
                        ) : (
                            ""
                        )}
                    </div>
                </BlogContext.Provider>
            )}
        </AnimationWrapper>
    )
}

export default Blog
