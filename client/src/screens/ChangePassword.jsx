import { useRef } from "react"
import { toast, Toaster } from "react-hot-toast"
import axios from "axios"

// contexts
import { useStateContext } from "../contexts/GlobalContext"

// utils
import { PASSWORD_REGEX } from "../utils"

// components
import AnimationWrapper from "../components/common/AnimationWrapper"
import InputBox from "../components/InputBox"

const ChangePassword = () => {
	const changePasswordFormRef = useRef()

	const {
		userData: { access_token },
	} = useStateContext()

	const handleSubmit = (event) => {
		event.preventDefault()

		const form = new FormData(changePasswordFormRef.current)
		let formData = {}

		for (let [key, value] of form.entries()) {
			formData[key] = value
		}

		const { currentPassword, newPassword } = formData

		if (!currentPassword.length || !newPassword.length) {
			return toast.error("Fill all the inputs")
		}

		if (
			!PASSWORD_REGEX.test(currentPassword) ||
			!PASSWORD_REGEX.test(newPassword)
		) {
			return toast.error(
				"Password should be 6 to 20 characters long with a numeric,1 lowercase and 1 uppercase letters"
			)
		}

		event.target.setAttribute("disabled", true)

		const loadingToast = toast.loading("Updating...")

		axios
			.post(
				`${import.meta.env.VITE_API_URL}/auth/change-password`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			)
			.then(() => {
				toast.dismiss(loadingToast)
				event.target.removeAttribute("disabled")

				return toast.success("Password Updated")
			})
			.catch(({ response }) => {
				toast.dismiss(loadingToast)
				event.target.removeAttribute("disabled")

				return toast.error(response.data.message)
			})
	}
	return (
		<AnimationWrapper>
			<Toaster />

			<form ref={changePasswordFormRef}>
				<h1 className="max-md:hidden"></h1>

				<div className="py-10 w-full md:max-w-[400px]">
					<InputBox
						name="currentPassword"
						type="password"
						className="profile-edit-input"
						placeholder="CurrentPassword"
						icon="fi-rr-unlock"
					/>

					<InputBox
						name="newPassword"
						type="password"
						className="profile-edit-input"
						placeholder="NewPassword"
						icon="fi-rr-unlock"
					/>

					<button
						className="btn-dark px-10"
						type="submit"
						onClick={handleSubmit}
					>
						Change Password
					</button>
				</div>
			</form>
		</AnimationWrapper>
	)
}

export default ChangePassword
