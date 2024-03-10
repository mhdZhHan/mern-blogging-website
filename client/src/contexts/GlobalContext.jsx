import { createContext, useContext, useState, useEffect } from "react"
import { getSession, setSession, logoutUser } from "../functions/session"

const StateContext = createContext({
	userData: {},
	setUserData: () => {},
	updateUserData: () => {},
})

// const darkThemePreference = () =>
// 	window.matchMedia("(prefers-color-scheme: dark)").matches

export const GlobalContext = ({ children }) => {
	const [userData, setUserData] = useState({})

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

	useEffect(() => {
		const isUserInSession = getSession("user")
		const isThemeInSession = getSession("theme")

		isUserInSession
			? setUserData(JSON.parse(isUserInSession))
			: setUserData({ access_token: null })

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
			value={{ userData, updateUserData, theme, setTheme }}
		>
			{children}
		</StateContext.Provider>
	)
}

export const useStateContext = () => useContext(StateContext)
