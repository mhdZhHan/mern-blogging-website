import { Navigate, useLocation } from "react-router-dom"
import { useStateContext } from "../contexts/GlobalContext"

const PrivateRoute = ({ children }) => {
    const location = useLocation()

    const {
        userData: { access_token },
    } = useStateContext()

    return access_token ? (
        children
    ) : (
        <Navigate
            to={{ pathname: "/signin", search: `?next=${location.pathname}` }}
        />
    )
}

export default PrivateRoute
