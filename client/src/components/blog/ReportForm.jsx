import { useContext, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"
import { BlogContext } from "../../screens/Blog"

const ReportForm = () => {
	const [reportTitle, setReportTitle] = useState("")
	const [reportMessage, setReportMessage] = useState("")

	const {
		userData: { access_token },
	} = useStateContext()

	const {
		blog: { _id },
	} = useContext(BlogContext)

	const handleReport = () => {
		if (!access_token) {
			return toast.error("Login first to leave a report")
		}

		if (!reportTitle.length) {
			return toast.error("Report should have a report title")
		}

		if (!reportMessage.length) {
			return toast.error("Report should have a report description")
		}

		axios
			.post(
				`${import.meta.env.VITE_API_URL}/admin/add-report`,
				{
					report_title: reportTitle,
					report_message: reportMessage,
					target_id: _id,
					targetType: "blog",
				},
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			)
			.then(({ data }) => {
				console.log(data, "Done")
				toast.success("Reported ✅")
				setReportTitle("")
				setReportMessage("")
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<>
			<Toaster />

			<input
				value={reportTitle}
				onChange={(event) => setReportTitle(event.target.value)}
				type="text"
				placeholder="Enter issue title"
				className="input-box pl-5 mb-4 placeholder:text-dark-grey"
			/>

			<textarea
				value={reportMessage}
				onChange={(event) => setReportMessage(event.target.value)}
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
