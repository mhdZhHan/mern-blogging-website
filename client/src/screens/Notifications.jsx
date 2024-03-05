import React, { useEffect, useState } from "react"
import axios from "axios"

// functions
import { filterPaginationData } from "../functions"

// contexts
import { useStateContext } from "../contexts/GlobalContext"

// components
import Loader from "../components/common/Loader"
import AnimationWrapper from "../components/common/AnimationWrapper"
import NodataMessage from "../components/common/NodataMessage"
import NotificationCard from "../components/dashboard/NotificationCard"
import LoadMoreBtn from "../components/common/buttons/LoadMoreBtn"

const Notifications = () => {
	const [filter, setFilter] = useState("all")
	const [notifications, setNotifications] = useState(null)

	const filters = ["all", "like", "comment", "reply"]

	const {
		userData: { access_token },
	} = useStateContext()

	const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
		axios
			.post(
				`${import.meta.env.VITE_API_URL}/notifications`,
				{ page, filter, deletedDocCount },
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			)
			.then(async ({ data: { notifications: data } }) => {
				let formattedData = await filterPaginationData({
					state: notifications,
					data,
					page,
					countRoute: "notifications/count",
					dataToSend: { filter },
					user: access_token,
				})

				setNotifications(formattedData)
				// console.log(formattedData)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const handleFilter = (event) => {
		const brn = event.target

		setFilter(brn.innerHTML)

		setNotifications(null)
	}

	useEffect(() => {
		if (access_token) {
			fetchNotifications({ page: 1 })
		}
	}, [access_token, filter])

	return (
		<div>
			<h1 className="max-md:hidden">Recent Notifications</h1>

			<div className="my-8 flex gap-6">
				{filters.map((item, index) => (
					<button
						key={index}
						className={
							"py-2 " +
							(item == filter ? "btn-dark" : "btn-light")
						}
						onClick={handleFilter}
					>
						{item}
					</button>
				))}
			</div>

			{notifications == null ? (
				<Loader />
			) : (
				<>
					{notifications.results.length ? (
						notifications.results.map((notification, index) => (
							<AnimationWrapper
								key={index}
								transition={{ delay: index * 0.08 }}
							>
								<NotificationCard
									data={notification}
									index={index}
									notificationState={{
										notifications,
										setNotifications,
									}}
								/>
							</AnimationWrapper>
						))
					) : (
						<NodataMessage message="Nothing available" />
					)}

					<LoadMoreBtn
						state={notifications}
						fetchDataFunc={fetchNotifications}
						additionalParam={{
							deletedDocCount: notifications.deletedDocCount,
						}}
					/>
				</>
			)}
		</div>
	)
}

export default Notifications
