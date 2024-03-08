import { useEffect, useRef, useState } from "react"

export let activeTabLineRef
export let activeTabRef

const InPageNavigation = ({
	routes,
	defaultHidden = [],
	defaultActiveIndex = 0,
	children,
}) => {
	// const [inPageNavIndex, setInPageNavIndex] = useState(null)
	const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex)
	const [width, setWidth] = useState(window.innerWidth)
	const [isResizeEventAdded, setIsResizeEventAdded] = useState(false)

	activeTabLineRef = useRef()
	activeTabRef = useRef()

	const changePageState = (btn, index) => {
		const { offsetWidth, offsetLeft } = btn

		activeTabLineRef.current.style.width = offsetWidth + "px"
		activeTabLineRef.current.style.left = offsetLeft + "px"

		setInPageNavIndex(index)
	}

	useEffect(() => {
		/**
		 * the function call for setting default active tab
		 * after the component will mounded pass the button and default index to activate the tab
		 */

		if (width > 766 && inPageNavIndex != defaultActiveIndex) {
			changePageState(activeTabRef.current, defaultActiveIndex)
		}

		if (!isResizeEventAdded) {
			window.addEventListener("resize", () => {
				if (!isResizeEventAdded) {
					setIsResizeEventAdded(true)
				}

				setWidth(window.innerWidth)
			})
		}
	}, [width])

	// console.log(width)

	return (
		<>
			<div
				className="relative mb-8 bg-white border-b border-grey flex flex-nowrap 
            overflow-x-auto"
			>
				{routes.map((route, index) => (
					<button
						key={index}
						ref={index === defaultActiveIndex ? activeTabRef : null}
						onClick={(e) => {
							changePageState(e.target, index)
						}}
						className={
							"p-4 px-5 capitalize " +
							(inPageNavIndex === index
								? "text-black "
								: "text-dark-grey ") +
							(defaultHidden.includes(route) ? "md:hidden" : "")
						}
					>
						{route}
					</button>
				))}

				<hr
					ref={activeTabLineRef}
					className="absolute bottom-0 duration-300"
				/>
			</div>
			{
				/**
				 * the `Array.isArray()` method will check the `children` prop is a array or not
				 * if the children has multiple elements it is an array otherwise not.
				 * the children `isArray` so render ony the element based on the `tabIndex`
				 */
				Array.isArray(children) ? children[inPageNavIndex] : children
			}
		</>
	)
}

export default InPageNavigation
