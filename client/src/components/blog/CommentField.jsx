import { useContext, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"
import { BlogContext } from "../../screens/Blog"

const CommentField = ({
    action,
    index = undefined,
    replyingTo = undefined,
    setIsReplying,
}) => {
    const [comment, setComment] = useState("")

    const {
        userData: { access_token, username, fullName, profile_img },
    } = useStateContext()

    const {
        blog,
        blog: {
            _id,
            author: { _id: blog_author },
            comments,
            comments: { results: commentsArray },
            activity,
            activity: { total_comments, total_parent_comments },
        },
        setBlog,
        setTotalParentCommentsLoaded,
    } = useContext(BlogContext)

    const handleComment = () => {
        if (!access_token) {
            return toast.error("Login first to leave a comment")
        }

        if (!comment.length) {
            return toast.error("Write something to leave a comment...")
        }

        axios
            .post(
                `/api/v1/comments/add`,
                {
                    blog_id: _id,
                    blog_author,
                    comment,
                    replying_to: replyingTo,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            )
            .then(({ data }) => {
                setComment("")

                /**
                 * Adding additional information's to the response data
                 * the additional information is about the commented user
                 * the user details are already in the session storage
                 *
                 * NOTE the `childrenLevel' indicate it is a parent comment
                 */
                data.commented_by = {
                    personal_info: { username, fullName, profile_img },
                }

                let newCommentArr

                if (replyingTo) {
                    commentsArray[index].children.push(data._id)

                    data.childrenLevel = commentsArray[index].childrenLevel + 1
                    data.parentIndex = index

                    commentsArray[index].isReplyLoaded = true

                    commentsArray.splice(index + 1, 0, data)

                    newCommentArr = commentsArray

                    setIsReplying(false)
                } else {
                    data.childrenLevel = 0

                    newCommentArr = [data, ...commentsArray]
                }

                let parentCommentIncrementLevel = replyingTo ? 0 : 1

                /**
                 * updating blog state with new values (comments and it's related data's)
                 */
                setBlog({
                    ...blog,
                    comments: { ...comments, results: newCommentArr },
                    activity: {
                        ...activity,
                        total_comments: total_comments + 1,
                        total_parent_comments:
                            total_parent_comments + parentCommentIncrementLevel,
                    },
                })

                setTotalParentCommentsLoaded(
                    (preVal) => preVal + parentCommentIncrementLevel
                )
            })
            .catch(({ error }) => {
                console.log(error?.message)
            })
    }

    return (
        <>
            <Toaster />

            <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Leave a comment..."
                className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
            ></textarea>

            <button className="btn-dark mt-5 px-10" onClick={handleComment}>
                {action}
            </button>
        </>
    )
}

export default CommentField
