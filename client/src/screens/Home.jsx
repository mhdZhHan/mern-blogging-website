// components
import { useEffect, useState } from "react"
import axios from "axios"

// components
import AnimationWrapper from "../components/common/AnimationWrapper"
import InPageNavigation from "../components/common/InPageNavigation"
import Loader from "../components/common/Loader"
import BlogCard from "../components/common/cards/BlogCard"
import MinimalBlogPostCard from "../components/common/cards/MinimalBlogPostCard"

const Home = () => {
    const [blogs, setBlogs] = useState(null)
    const [trendingBlogs, setTrendingBlogs] = useState(null)

    const fetchLatestBlogs = () => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/blogs/latest`)
            .then(({ data }) => {
                setBlogs(data?.blogs)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const fetchTrendingBlogs = () => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/blogs/trending`)
            .then(({ data }) => {
                setTrendingBlogs(data?.blogs)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        fetchLatestBlogs()
        fetchTrendingBlogs()
    }, [])

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* lates blogs */}
                <div className="w-full">
                    <InPageNavigation
                        routes={["home", "trending blogs"]}
                        defaultHidden={["trending blogs"]}
                    >
                        {/* latest blogs */}
                        {blogs === null ? (
                            <Loader />
                        ) : (
                            blogs.map((blog, index) => (
                                <AnimationWrapper
                                    key={blog?.blog_id}
                                    transition={{
                                        duration: 1,
                                        delay: index * 0.1,
                                    }}
                                >
                                    <BlogCard
                                        blog={blog}
                                        author={blog?.author?.personal_info}
                                    />
                                </AnimationWrapper>
                            ))
                        )}

                        {/* trending blogs only for md devices */}
                        {trendingBlogs === null ? (
                            <Loader />
                        ) : (
                            trendingBlogs.map((blog, index) => (
                                <AnimationWrapper
                                    key={blog?.blog_id}
                                    transition={{
                                        duration: 1,
                                        delay: index * 0.1,
                                    }}
                                >
                                    <MinimalBlogPostCard
                                        blog={blog}
                                        index={index}
                                    />
                                </AnimationWrapper>
                            ))
                        )}
                    </InPageNavigation>
                </div>

                {/* filters and trending blogs */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        <h1 className="font-medium text-xl mb-8">
                            Stories from all interests
                        </h1>

                        <div className="flex gap-3 flex-wrap">
                            
                        </div>
                    </div>

                    <div>
                        <h1 className="font-medium text-xl mb-8">
                            Trending
                            <i className="fi fi-rr-arrow-trend-up"></i>

                            {trendingBlogs === null ? (
                                <Loader />
                            ) : (
                                trendingBlogs.map((blog, index) => (
                                    <AnimationWrapper
                                        key={blog?.blog_id}
                                        transition={{
                                            duration: 1,
                                            delay: index * 0.1,
                                        }}
                                    >
                                        <MinimalBlogPostCard
                                            blog={blog}
                                            index={index}
                                        />
                                    </AnimationWrapper>
                                ))
                            )}
                        </h1>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default Home
