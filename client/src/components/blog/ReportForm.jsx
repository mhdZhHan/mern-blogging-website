import { useContext, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"
import { BlogContext } from "../../screens/Blog"

const ReportForm = () => {
	const {
		userData: { access_token, username, fullName, profile_img },
	} = useStateContext()

	const {
		blog,
		blog: {
			_id,
			author: { _id: blog_author },
		},
		setBlog,
	} = useContext(BlogContext)

	const handleReport = () => {}

	return (
		<>
			<Toaster />

			<input
				type="text"
				placeholder="Enter issue title"
				className="input-box pl-5 mb-4 placeholder:text-dark-grey"
			/>

			<textarea
				// value={comment}
				// onChange={(event) => setComment(event.target.value)}
				placeholder="Enter issue description"
				className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
			></textarea>

			<button className="btn-dark mt-5 px-10" onClick={handleReport}>
				Report
			</button>
		</>
	)
}

export default ReportForm
