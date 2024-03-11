import { createContext, useContext, useState, useEffect } from "react"
import { getSession, setSession, logoutUser } from "../functions/session"

const StateContext = createContext({
	userData: {},
	setUserData: () => {},
	updateUserData: () => {},

	adminData: {},
	updateAdminData: () => {},
})

// const darkThemePreference = () =>
// 	window.matchMedia("(prefers-color-scheme: dark)").matches

export const GlobalContext = ({ children }) => {
	const [userData, setUserData] = useState({})
	const [adminData, setAdminData] = useState({})

	// const [theme, setTheme] = useState(() => {
	// 	darkThemePreference() ? "dark" : "light"
	// })

	const [theme, setTheme] = useState("light")

	const updateUserData = (action) => {
		switch (action?.type) {
			case "LOGOUT":
				setUserData({ access_token: null })
				logoutUser()
				break
			case "LOGIN":
				setSession("user", JSON.stringify(action?.payload))
				setUserData(action?.payload)
				break
			default:
				return
		}
	}

	const updateAdminData = (action) => {
		switch (action?.type) {
			case "LOGOUT":
				setAdminData({ admin_token: null })
				logoutUser()
				break
			case "LOGIN":
				setSession("admin", JSON.stringify(action?.payload))
				setAdminData(action?.payload)
				break
			default:
				return
		}
	}

	useEffect(() => {
		const isUserInSession = getSession("user")
		const isThemeInSession = getSession("theme")
		const isAdminInSession = getSession("admin")

		isUserInSession
			? setUserData(JSON.parse(isUserInSession))
			: setUserData({ access_token: null })

		isAdminInSession
			? setAdminData(JSON.parse(isAdminInSession))
			: setAdminData({ admin_token: null })

		// setting theme
		if (isThemeInSession) {
			setTheme(() => {
				document.body.setAttribute("data-theme", isThemeInSession)

				return isThemeInSession
			})
		} else {
			document.body.setAttribute("data-theme", theme)
		}
	}, [])

	return (
		<StateContext.Provider
			value={{
				userData,
				updateUserData,
				theme,
				setTheme,
				adminData,
				updateAdminData,
			}}
		>
			{children}
		</StateContext.Provider>
	)
}

export const useStateContext = () => useContext(StateContext)
