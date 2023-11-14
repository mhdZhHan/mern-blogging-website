import { createContext, useContext, useState, useEffect } from "react"
import { getSession, setSession, logoutUser } from "../functions/session"

const StateContext = createContext({
    userData: {},
    setUserData: () => {},
    updateUserData: () => {},
})

export const GlobalContext = ({ children }) => {
    const [userData, setUserData] = useState({})

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
        isUserInSession
            ? setUserData(JSON.parse(isUserInSession))
            : setUserData({ access_token: null })
    }, [])

    return (
        <StateContext.Provider value={{ userData, updateUserData }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)
