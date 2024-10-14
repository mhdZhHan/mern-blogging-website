import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import axios from "axios"
import { Toaster } from "react-hot-toast"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"

// components
import Loader from "../../components/common/Loader"
import NodataMessage from "../../components/common/NodataMessage"
import AnimationWrapper from "../../components/common/AnimationWrapper"

const Reports = () => {
	const [reports, setReports] = useState(null)

	const {
		adminData: { admin_token },
	} = useStateContext()

	const getReports = () => {
		axios
			.get(`/api/v1/admin/get-reports`, {
				headers: {
					Authorization: `Bearer ${admin_token}`,
				},
			})
			.then(async ({ data }) => {
				console.log(data.complaints)
				setReports(data.complaints)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	useEffect(() => {
		getReports()
	}, [])

	return admin_token ? (
		<>
			<h1 className="max-md:hidden">Manage Reports</h1>
			<Toaster />

			<div className="grid grid-cols-1 gap-4 mt-10">
				{reports == null ? (
					<Loader />
				) : reports.length ? (
					<>
						{reports.map((report, index) => (
							<AnimationWrapper
								key={index}
								transition={{ delay: index * 0.04 }}
							>
								<div className="border-b mb-6 max-md:px-4 border-grey pb-6">
									<h4 className="blog-title mb-4">
										{report.report_title}
									</h4>
									<p className="line-clamp-1 mb-4">
										{report.report_message}
									</p>
									<div className="flex justify-between text-sm text-gray-500">
										<span>
											Reported By:{" "}
											<Link
												to={`/user${report.reported_by.personal_info.username}`}
												className="underline"
											>
												{
													report.reported_by
														.personal_info.username
												}
											</Link>
										</span>

										{report.blog ? (
											<span>
												Reported Blog:{" "}
												<Link
													to={`/blog/${report.blog.blog_id}`}
													className="underline"
												>
													{report.blog.title}
												</Link>
											</span>
										) : (
											<span>
												Reported User:{" "}
												<Link
													to={`/user${report.user.personal_info.username}`}
													className="underline"
												>
													{
														report.user
															.personal_info
															.username
													}
												</Link>
											</span>
										)}
									</div>
								</div>
							</AnimationWrapper>
						))}
					</>
				) : (
					<NodataMessage message="No reports found" />
				)}
			</div>
		</>
	) : (
		<Navigate to="/admin/login" />
	)
}

export default Reports
