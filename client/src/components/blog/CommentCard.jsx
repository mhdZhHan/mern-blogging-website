import React, { useContext, useState } from "react"
import toast from "react-hot-toast"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"
import { BlogContext } from "../../screens/Blog"

// utils
import { getDate } from "../../utils/getDate"

// components
import CommentField from "./CommentField"
import axios from "axios"

const CommentCard = ({ index, leftVal, commentData }) => {
    // ANCHOR contexts and props
    const {
        blog,
        blog: {
            comments,
            comments: { results: commentsArray },
            author: {
                personal_info: { username: blog_author },
            },
        },
        setBlog,
    } = useContext(BlogContext)

    const {
        commented_by: {
            personal_info: {
                username: commented_by_username,
                fullName,
                profile_img,
            },
        },
        commentedAt,
        comment,
        _id,
        children,
    } = commentData

    const {
        userData: { access_token, username },
    } = useStateContext()

    // ANCHOR states

    const [isReplying, setIsReplying] = useState(false)

    // ANCHOR other functions

    const handleReplyClick = () => {
        if (!access_token) {
            return toast.error("Login first to leave a reply")
        }

        setIsReplying((preVal) => !preVal)
    }

    const removeCommentsCard = (startingPoint) => {
        if (commentsArray[startingPoint]) {
            while (
                commentsArray[startingPoint].childrenLevel >
                commentData.childrenLevel
            ) {
                commentsArray.splice(startingPoint, 1)

                if (!commentsArray[startingPoint]) {
                    break
                }
            }
        }

        setBlog({ ...blog, comments: { results: commentsArray } })
    }

    const deleteComment = (event) => {
        /**
         * the `disabled` attribute will stop multiple clicking on the button
         */
        event.target.setAttribute("disabled", true)
    }

    const hideReplies = () => {
        commentData.isReplyLoaded = false

        removeCommentsCard(index + 1)
    }

    const loadReplies = ({ skip = 0 }) => {
        if (children.length) {
            hideReplies()

            axios
                .post(`${import.meta.env.VITE_API_URL}/comments/get/replies`, {
                    _id,
                    skip,
                })
                .then(({ data: { replies } }) => {
                    commentData.isReplyLoaded = true

                    for (let i = 0; i < replies.length; i++) {
                        replies[i].childrenLevel = commentData.childrenLevel + 1
                        commentsArray.splice(
                            index + 1 + i + skip,
                            0,
                            replies[i]
                        )
                    }

                    setBlog({
                        ...blog,
                        comments: { ...comments, results: commentsArray },
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    return (
        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className="my-5 p-6 rounded-md border border-grey">
                <div className="flex gap-3 items-center mb-8">
                    <img
                        className="w-6 h-6 rounded-full"
                        src={profile_img}
                        alt={commented_by_username}
                    />
                    <p className="line-clamp-1">
                        {fullName} @{commented_by_username}
                    </p>
                    <p className="min-w-fit">{getDate(commentedAt)}</p>
                </div>

                <p className="font-gelasio text-xl ml-3">{comment}</p>

                <div className="flex gap-5 items-center mt-5">
                    {commentData.isReplyLoaded ? (
                        <button
                            className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
                            onClick={hideReplies}
                        >
                            <i className="fi fi-rs-comment-dots"></i>
                            Hide Reply
                        </button>
                    ) : (
                        <button
                            className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
                            onClick={loadReplies}
                        >
                            <i className="fi fi-rs-comment-dots"></i>
                            {children.length} Reply
                        </button>
                    )}
                    <button className="underline" onClick={handleReplyClick}>
                        Reply
                    </button>

                    {username == commented_by_username ||
                    username == blog_author ? (
                        <button
                            className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center"
                            onClick={deleteComment}
                        >
                            <i className="fi fi-rr-trash pointer-events-none"></i>
                        </button>
                    ) : (
                        ""
                    )}
                </div>
                {isReplying && (
                    <div className="mt-8">
                        <CommentField
                            action="Reply"
                            index={index}
                            replyingTo={_id}
                            setIsReplying={setIsReplying}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentCard
