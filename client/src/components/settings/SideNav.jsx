import { useEffect, useRef, useState } from "react"
import { NavLink, Navigate, Outlet } from "react-router-dom"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"

const SideNav = () => {
	const {
		userData: { access_token, new_notification_available },
	} = useStateContext()

	const currentPage = location.pathname.split("/")[2]

	const [page, setPage] = useState(currentPage.replace("-", " "))
	const [isSideNav, setIsSideNav] = useState(false)

	const activeTabLineRef = useRef()
	const sideBarIconTabTef = useRef()
	const pageStateTabRef = useRef()

	const changePageState = (event) => {
		const { offsetWidth, offsetLeft } = event.target

		activeTabLineRef.current.style.width = offsetWidth + "px"
		activeTabLineRef.current.style.left = offsetLeft + "px"

		if (event.target == sideBarIconTabTef.current) {
			setIsSideNav(true)
		} else {
			setIsSideNav(false)
		}
	}

	useEffect(() => {
		setIsSideNav(false)

		pageStateTabRef.current.click()
	}, [page])

	return access_token === null ? (
		<Navigate to="/signin" />
	) : (
		<>
			<section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
				<div className="sticky top-[80px] z-30">
					<div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
						<button
							ref={sideBarIconTabTef}
							onClick={changePageState}
							className="p-5 capitalize"
						>
							<i className="fi fi-rr-bars-staggered pointer-events-none"></i>
						</button>

						<button
							ref={pageStateTabRef}
							onClick={changePageState}
							className="p-5 capitalize"
						>
							{page}
						</button>

						<hr
							ref={activeTabLineRef}
							className="absolute bottom-0 duration-500"
						/>
					</div>

					<div
						className={
							"min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " +
							(!isSideNav
								? "max-md:opacity-0 max-md:pointer-events-none"
								: "opacity-100 pointer-events-auto")
						}
					>
						<h1 className="text-xl text-dark-grey mb-3">
							Dashboard
						</h1>
						<hr className="border-grey -ml-6 mb-8 mr-6" />

						<NavLink
							className="sidebar-link"
							to="/dashboard/blogs"
							onClick={(e) => setPage(e.target.innerText)}
						>
							<i className="fi fi-rr-document"></i>
							Blogs
						</NavLink>
						<NavLink
							className="sidebar-link"
							to="/notifications"
							onClick={(e) => setPage(e.target.innerText)}
						>
							<div className="relative">
								<i className="fi fi-rr-bell"></i>
								{new_notification_available && (
									<span className="bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span>
								)}
							</div>
							Notification
						</NavLink>
						<NavLink
							className="sidebar-link"
							to="/editor"
							onClick={(e) => setPage(e.target.innerText)}
						>
							<i className="fi fi-rr-file-edit"></i>
							Write
						</NavLink>

						<h1 className="text-xl text-dark-grey mt-20 mb-3">
							Settings
						</h1>
						<hr className="border-grey -ml-6 mb-8 mr-6" />

						<NavLink
							className="sidebar-link"
							to="/settings/edit-profile"
							onClick={(e) => setPage(e.target.innerText)}
						>
							<i className="fi fi-rr-user"></i>
							Edit Profile
						</NavLink>
						<NavLink
							className="sidebar-link"
							to="/settings/change-password"
							onClick={(e) => setPage(e.target.innerText)}
						>
							<i className="fi fi-rr-lock"></i>
							Change Password
						</NavLink>
					</div>
				</div>

				<div className="max-md:-mt-8 mt-5 w-full">
					<Outlet />
				</div>
			</section>
		</>
	)
}

export default SideNav
