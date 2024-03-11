import { Link, Navigate } from "react-router-dom"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"

const Blogs = () => {
	const {
		adminData: { admin_token },
	} = useStateContext()

	return admin_token ? <h1>Admin Blogs</h1> : <Navigate to="/admin/login" />
}

export default Blogs
