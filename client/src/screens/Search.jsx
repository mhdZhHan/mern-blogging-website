import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

// functions
import { filterPaginationData } from "../functions"

// components
import AnimationWrapper from "../components/common/AnimationWrapper"
import InPageNavigation from "../components/common/InPageNavigation"
import Loader from "../components/common/Loader"
import BlogCard from "../components/common/cards/BlogCard"
import NodataMessage from "../components/common/NodataMessage"
import LoadMoreBtn from "../components/common/buttons/LoadMoreBtn"

const Search = () => {
    const [blogs, setBlogs] = useState(null)
    const { query } = useParams()

    const searchBlogs = ({ page = 1, createNewArr = false }) => {
        axios
            .post(`${import.meta.env.VITE_API_URL}/blogs/search`, {
                query,
                page,
            })
            .then(async ({ data }) => {
                const formattedData = await filterPaginationData({
                    state: blogs,
                    data: data?.blogs,
                    page,
                    countRoute: "/search/total-posts",
                    dataToSend: { query },
                    createNewArr,
                })

                setBlogs(formattedData)
            })
    }

    useEffect(() => {
        resetStates()
        searchBlogs({ page: 1, createNewArr: true })
    }, [query])

    const resetStates = () => {
        setBlogs(null)
    }

    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation
                    routes={[
                        `Search Results from "${query}"`,
                        "Accounts Matched",
                    ]}
                    defaultHidden={["Accounts Matched"]}
                >
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
                            fetchDataFunc={searchBlogs}
                        />
                    </>
                </InPageNavigation>
            </div>
        </section>
    )
}

export default Search
