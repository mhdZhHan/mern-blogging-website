import { Navigate } from "react-router-dom"
import axios from "axios"
import { Toaster, toast } from "react-hot-toast"

// contexts
import { useStateContext } from "../../contexts/GlobalContext"

// components
import InputBox from "../../components/InputBox"
import AnimationWrapper from "../../components/common/AnimationWrapper"

const AdminAuth = () => {
	const { adminData, updateAdminData } = useStateContext()

	const handleSubmit = (event) => {
		event.preventDefault()

		// the `idFormElement` is the id of the form (it is an hack instead of using ref.current)
		const form = new FormData(idFormElement)

		const formData = {}

		for (const [key, value] of form.entries()) {
			formData[key] = value
		}

		axios
			.post(`${import.meta.env.VITE_API_URL}/admin/login`, formData)
			.then((response) => {
				console.log("Hello", response)

				updateAdminData({
					type: "LOGIN",
					payload: response?.data?.user,
				})
			})
			.catch((error) => {
				toast.error(error?.response?.data?.message)
			})
	}
	return adminData?.admin_token ? (
		<Navigate to="/admin/blogs" />
	) : (
		<AnimationWrapper keyValue="admin-login">
			<section className="h-cover flex items-center justify-center">
				<Toaster />

				<form
					id="idFormElement"
					action=""
					className="w-[80%] max-w-[400px]"
				>
					<h1 className="text-4xl font-gelasio capitalize text-center mb-24">
						Login as Admin
					</h1>

					<InputBox
						name="email"
						type="email"
						placeholder="Work email"
						icon="fi-rr-envelope"
					/>

					<InputBox
						name="password"
						type="password"
						placeholder="Password"
						icon="fi-rr-key"
					/>

					<button
						className="btn-dark center mt-14"
						type="submit"
						onClick={handleSubmit}
					>
						Login
					</button>
				</form>
			</section>
		</AnimationWrapper>
	)
}

export default AdminAuth
