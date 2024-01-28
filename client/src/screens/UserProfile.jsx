import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { useStateContext } from "../contexts/GlobalContext"

// functions
import { filterPaginationData } from "../functions"

// components
import AnimationWrapper from "../components/common/AnimationWrapper"
import Loader from "../components/common/Loader"
import AboutUser from "../components/profile/AboutUser"
import InPageNavigation from "../components/common/InPageNavigation"
import NodataMessage from "../components/common/NodataMessage"
import LoadMoreBtn from "../components/common/buttons/LoadMoreBtn"
import BlogCard from "../components/common/cards/BlogCard"

export const profileDataStructure = {
    personal_info: {
        fullName: "",
        username: "",
        profile_img: "",
        bio: "",
    },
    account_info: {
        total_posts: 0,
        total_reads: 0,
    },
    social_links: {},
    joinedAt: "",
}

const UserProfile = () => {
    const [profile, setProfile] = useState(profileDataStructure)
    const [loading, setLoading] = useState(true)
    const [blogs, setBlogs] = useState(null)

    const { id: profileId } = useParams()
    const {
        userData: { username },
    } = useStateContext()

    const {
        personal_info: { fullName, username: username_, profile_img, bio },
        account_info: { total_posts, total_reads },
        social_links,
        joinedAt,
    } = profile

    const fetchUserProfile = () => {
        axios
            .post(`${import.meta.env.VITE_API_URL}/users/profile`, {
                username: profileId,
            })
            .then(({ data }) => {
                setProfile(data?.user)
                getBlogs({ userId: data?.user?._id })
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
            })
    }

    const getBlogs = ({ page = 1, userId }) => {
        userId = userId === undefined ? blogs.userId : userId

        axios
            .post(`${import.meta.env.VITE_API_URL}/blogs/search`, {
                author: userId,
                page,
            })
            .then(async ({ data }) => {
                const formattedData = await filterPaginationData({
                    state: blogs,
                    data: data?.blogs,
                    page,
                    countRoute: "search/total-posts",
                    dataToSend: { author: userId },
                })

                formattedData.userId = userId
                setBlogs(formattedData)
            })
    }

    useEffect(() => {
        resetStates()
        fetchUserProfile()
    }, [profileId])

    const resetStates = () => {
        setLoading(true)
        setProfile(profileDataStructure)
    }

    return (
        <AnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                    <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
                        <img
                            src={profile_img}
                            alt={username_}
                            className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
                        />
                        <h1 className="text-2xl font-medium">@{username_}</h1>
                        <p className="text-xl capitalize h-6">{fullName}</p>
                        <p>
                            {total_posts.toLocaleString()} Blogs -{" "}
                            {total_reads.toLocaleString()} Reads
                        </p>
                        <div className="flex gap-4 mt-2">
                            {profileId === username ? (
                                <Link
                                    to="settings/edit-profile"
                                    className="btn-light rounded-md"
                                >
                                    Edit Profile
                                </Link>
                            ) : (
                                ""
                            )}
                        </div>

                        <AboutUser
                            bio={bio}
                            social_links={social_links}
                            joinedAt={joinedAt}
                            className="max-md:hidden"
                        />
                    </div>

                    <div className="max-md:mt-12 w-full">
                        <InPageNavigation
                            routes={["Blogs Published", "About"]}
                            defaultHidden={["About"]}
                        >
                            {/* published blogs */}
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
                                                author={
                                                    blog?.author?.personal_info
                                                }
                                            />
                                        </AnimationWrapper>
                                    ))
                                ) : (
                                    <NodataMessage message="No blog published" />
                                )}

                                <LoadMoreBtn
                                    state={blogs}
                                    fetchDataFunc={getBlogs}
                                />
                            </>

                            {/* About user card */}
                            <AboutUser
                                bio={bio}
                                social_links={social_links}
                                joinedAt={joinedAt}
                            />
                        </InPageNavigation>
                    </div>
                </section>
            )}
        </AnimationWrapper>
    )
}

export default UserProfile
