import { useContext } from "react"
import { BlogContext } from "../../screens/Blog"
import axios from "axios"

// components
import CommentField from "./CommentField"
import NoDataMessage from "../common/NodataMessage"
import AnimationWrapper from "../common/AnimationWrapper"
import CommentCard from "./CommentCard"

export const fetchComments = async ({
    skip = 0,
    blog_id,
    setParentCommentCountFunc,
    comments_array = null,
}) => {
    let res

    await axios
        .post(`/api/v1/comments/get`, {
            blog_id,
            skip,
        })
        .then(({ data: { comments } }) => {
            comments.map((comment) => {
                /**
                 * adding additional information to the looped response date (individual comment)
                 * the `childrenLevel' indicate it is a parent comment
                 */
                comment.childrenLevel = 0
            })

            // updating the total parent comments count (it's for the pagination)
            setParentCommentCountFunc((preVal) => preVal + comments.length)

            if (comments_array == null) {
                res = { results: comments }
            } else {
                res = { results: [...comments_array, ...comments] }
            }
        })

    return res
}

const CommentsContainer = () => {
    const {
        blog,
        blog: {
            title,
            _id,
            comments: { results: commentsArray },
            activity: { total_parent_comments },
        },
        setBlog,
        isCommentsWrapper,
        setIsCommentsWrapper,
        totalParentCommentsLoaded,
        setTotalParentCommentsLoaded,
    } = useContext(BlogContext)

    const loadMoreComments = async () => {
        let newCommentArr = await fetchComments({
            skip: totalParentCommentsLoaded,
            blog_id: _id,
            setParentCommentCountFunc: setTotalParentCommentsLoaded,
            comments_array: commentsArray,
        })

        setBlog({ ...blog, comments: newCommentArr })
    }

    return (
        <div
            className={
                "max-sm:w-full fixed " +
                (isCommentsWrapper
                    ? "top-0 sm:right-0"
                    : "top-[100%] sm:right-[-100%]") +
                " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"
            }
        >
            <div className="relative">
                <h1 className="text-xl font-medium">Comments</h1>
                <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
                    {title}
                </p>

                <button
                    className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
                    onClick={() => setIsCommentsWrapper(!isCommentsWrapper)}
                >
                    <i className="fi fi-br-cross text-2xl mt-1"></i>
                </button>

                <hr className="border-grey my-8 w-[120%] -ml-10" />

                <CommentField action="comment" />

                {/* loop comments card */}

                {commentsArray && commentsArray.length ? (
                    commentsArray.map((comment, index) => (
                        <AnimationWrapper key={index}>
                            <CommentCard
                                index={index}
                                leftVal={comment.childrenLevel * 4}
                                commentData={comment}
                            />
                        </AnimationWrapper>
                    ))
                ) : (
                    <NoDataMessage message="No Comments" />
                )}

                {total_parent_comments > totalParentCommentsLoaded ? (
                    <button
                        className="text-dark-grey p-2 x-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
                        onClick={loadMoreComments}
                    >
                        Load More
                    </button>
                ) : (
                    ""
                )}
            </div>
        </div>
    )
}

export default CommentsContainer
