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
import UserCard from "../components/common/cards/UserCard"
import NodataMessage from "../components/common/NodataMessage"
import LoadMoreBtn from "../components/common/buttons/LoadMoreBtn"

const Search = () => {
    const [blogs, setBlogs] = useState(null)
    const [users, setUsers] = useState(null)

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
                    countRoute: "search/total-posts",
                    dataToSend: { query },
                    createNewArr,
                })

                setBlogs(formattedData)
            })
    }

    const fetchUsers = () => {
        axios
            .post(`${import.meta.env.VITE_API_URL}/users/search`, { query })
            .then(({ data: { users } }) => {
                setUsers(users)
            })
    }

    const resetStates = () => {
        setBlogs(null)
        setUsers(null)
    }

    useEffect(() => {
        resetStates()
        searchBlogs({ page: 1, createNewArr: true })
        fetchUsers()
    }, [query])

    const UserCardWrapper = () => {
        return (
            <>
                {users == null ? (
                    <Loader />
                ) : users.length ? (
                    users.map((user, index) => {
                        return (
                            <AnimationWrapper
                                key={index}
                                transition={{
                                    duration: 1,
                                    delay: index * 0.08,
                                }}
                            >
                                <UserCard user={user} />
                            </AnimationWrapper>
                        )
                    })
                ) : (
                    <NodataMessage message="No user found" />
                )}
            </>
        )
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

                    <UserCardWrapper />
                </InPageNavigation>
            </div>

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8">
                    User related to search{" "}
                    <i className="fi fi-rr-user mt-1"></i>
                </h1>
                <UserCardWrapper />
            </div>
        </section>
    )
}

export default Search
