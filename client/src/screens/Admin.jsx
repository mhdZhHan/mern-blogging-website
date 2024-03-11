import { Link, Navigate } from "react-router-dom"

// contexts
import { useStateContext } from "../contexts/GlobalContext"

const Admin = () => {
	const {
		adminData: { admin_token },
	} = useStateContext()

	return admin_token ? <h1>Admin</h1> : <Navigate to="/admin/login" />
}

export default Admin
