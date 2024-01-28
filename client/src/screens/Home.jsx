import { useEffect, useState } from "react"
import axios from "axios"

// functions
import { filterPaginationData } from "../functions"

// components
import AnimationWrapper from "../components/common/AnimationWrapper"
import InPageNavigation, {
    activeTabRef,
} from "../components/common/InPageNavigation"
import Loader from "../components/common/Loader"
import BlogCard from "../components/common/cards/BlogCard"
import MinimalBlogPostCard from "../components/common/cards/MinimalBlogPostCard"
import NodataMessage from "../components/common/NodataMessage"
import LoadMoreBtn from "../components/common/buttons/LoadMoreBtn"

const Home = () => {
    const [blogs, setBlogs] = useState(null)
    const [trendingBlogs, setTrendingBlogs] = useState(null)
    const [pageState, setPageState] = useState("home")

    const categories = [
        "tech",
        "programming",
        "linux",
        "kde plasma",
        "github",
        "new dev",
        "hello",
        "test",
        "card",
    ]

    const fetchLatestBlogs = ({ page = 1 }) => {
        axios
            .post(`${import.meta.env.VITE_API_URL}/blogs/latest`, { page })
            .then(async ({ data }) => {
                // setBlogs(data?.blogs)

                const formattedData = await filterPaginationData({
                    state: blogs,
                    data: data?.blogs,
                    page,
                    countRoute: "latest/total-posts",
                })

                setBlogs(formattedData)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const fetchBlogsByCategory = ({ page = 1 }) => {
        axios
            .post(`${import.meta.env.VITE_API_URL}/blogs/search`, {
                tag: pageState,
                page,
            })
            .then(async ({ data }) => {
                const formattedData = await filterPaginationData({
                    state: blogs,
                    data: data?.blogs,
                    page,
                    countRoute: "search/total-posts",
                    dataToSend: { tag: pageState },
                })

                setBlogs(formattedData)
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
        /**
         * made a virtual click to the `inPageNavigation` tab button
         * for adjusting the width and left
         */
        activeTabRef.current.click()

        if (pageState === "home") {
            fetchLatestBlogs({ page: 1 })
        } else {
            fetchBlogsByCategory({ page: 1 })
        }

        if (!trendingBlogs) {
            fetchTrendingBlogs()
        }
    }, [pageState])

    const handleLoadCategory = (event) => {
        const category = event.target.innerText.toLowerCase()

        setBlogs(null)

        if (pageState === category) {
            setPageState("home")
            return
        }

        setPageState(category)
    }

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* lates blogs */}
                <div className="w-full">
                    <InPageNavigation
                        routes={[pageState, "trending blogs"]}
                        defaultHidden={["trending blogs"]}
                    >
                        {/* latest blogs */}
                        <>
                            {blogs === null ? (
                                <Loader />
                            ) : blogs.results.length ? (
                                blogs.results.map((blog, index) => (
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
                            ) : (
                                <NodataMessage message="No blog published" />
                            )}

                            <LoadMoreBtn
                                state={blogs}
                                fetchDataFunc={
                                    pageState === "home"
                                        ? fetchLatestBlogs
                                        : fetchBlogsByCategory
                                }
                            />
                        </>

                        {/* trending blogs only for md devices */}
                        {trendingBlogs === null ? (
                            <Loader />
                        ) : trendingBlogs.length ? (
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
                        ) : (
                            <NodataMessage message="No trending blogs published" />
                        )}
                    </InPageNavigation>
                </div>

                {/* filters and trending blogs */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-8">
                                Stories from all interests
                            </h1>

                            <div className="flex gap-3 flex-wrap">
                                {categories.map((category, index) => (
                                    <button
                                        key={index}
                                        className={
                                            "tag " +
                                            (pageState === category
                                                ? "bg-black text-white"
                                                : "")
                                        }
                                        onClick={handleLoadCategory}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h1 className="font-medium text-xl mb-8">
                                Trending{" "}
                                <i className="fi fi-rr-arrow-trend-up"></i>
                            </h1>

                            {trendingBlogs === null ? (
                                <Loader />
                            ) : trendingBlogs.length ? (
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
                            ) : (
                                <NodataMessage message="No trending blogs published" />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default Home
