import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { useStateContext } from "../contexts/GlobalContext"

// components
import AnimationWrapper from "../components/common/AnimationWrapper"
import Loader from "../components/common/Loader"
import AboutUser from "../components/profile/AboutUser"

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
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
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
                    <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
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
                </section>
            )}
        </AnimationWrapper>
    )
}

export default UserProfile
