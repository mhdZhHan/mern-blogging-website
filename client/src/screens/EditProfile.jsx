import { useEffect, useRef, useState } from "react"
import axios from "axios"

// contexts
import { useStateContext } from "../contexts/GlobalContext"

// functions
import { uploadImage } from "../functions/aws"

import { profileDataStructure } from "../screens/UserProfile"
import AnimationWrapper from "../components/common/AnimationWrapper"
import Loader from "../components/common/Loader"
import toast, { Toaster } from "react-hot-toast"
import InputBox from "../components/InputBox"

const EditProfile = () => {
	const {
		userData,
		updateUserData,
		userData: { access_token },
	} = useStateContext()

	const bioLimit = 150

	const [profile, setProfile] = useState(profileDataStructure)
	const [loading, setLoading] = useState(true)
	const [charactersLeft, setCharactersLeft] = useState(bioLimit)
	const [updatedProfileImg, setUpdatedProfileImg] = useState(null)

	const profileImgRef = useRef()
	const editProfileFormRef = useRef()

	const {
		personal_info: {
			username: profile_username,
			fullName,
			profile_img,
			email,
			bio,
		},
		social_links,
	} = profile

	const handleCharacterChange = (event) => {
		setCharactersLeft(bioLimit - event.target.value.length)
	}

	const handleImagePreview = (event) => {
		const img = event.target.files[0]

		profileImgRef.current.src = URL.createObjectURL(img)
		setUpdatedProfileImg(img)
	}

	const handleImageUpload = (event) => {
		event.preventDefault()

		if (updatedProfileImg) {
			const loadingToast = toast.loading("Uploading...")
			event.target.setAttribute("disabled", true)

			uploadImage(updatedProfileImg, access_token)
				.then((url) => {
					if (url) {
						axios
							.post(
								`${
									import.meta.env.VITE_API_URL
								}/users/update-profile-img`,
								{ url },
								{
									headers: {
										Authorization: `Bearer ${access_token}`,
									},
								}
							)
							.then(({ data }) => {
								let newUserData = {
									...userData,
									profile_img: data.profile_img,
								}

								updateUserData({
									type: "LOGIN",
									payload: newUserData,
								})

								setUpdatedProfileImg(null)
								toast.dismiss(loadingToast)
								event.target.removeAttribute("disabled")
								toast.success("Updated 👍")
							})
							.catch(({ response }) => {
								console.log(error)
								setUpdatedProfileImg(null)
								toast.dismiss(loadingToast)
								event.target.removeAttribute("disabled")
								toast.error(response.data.message)
							})
					}
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	const handleSubmit = (event) => {
		event.preventDefault()

		const form = new FormData(editProfileFormRef.current)
		const formData = {}

		for (let [key, value] of form.entries()) {
			formData[key] = value
		}

		const {
			username,
			bio,
			youtube,
			instagram,
			facebook,
			twitter,
			github,
			website,
		} = formData

		if (username.length < 3) {
			return toast.error("Username should be at least 3 letters long")
		}

		if (bio.length > bioLimit) {
			return toast.error(`Bio should not be more than ${bioLimit}`)
		}

		const loadingToast = toast.loading("Updating...")
		event.target.setAttribute("disabled", true)

		axios
			.post(
				`${import.meta.env.VITE_API_URL}/users/update-profile`,
				{
					username,
					bio,
					social_links: {
						instagram,
						youtube,
						twitter,
						github,
						facebook,
						website,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			)
			.then(({ data }) => {
				if (userData.username !== data.username) {
					let newUserData = {
						...userData,
						username: data.username,
					}

					updateUserData({
						type: "LOGIN",
						payload: newUserData,
					})
				}

				toast.dismiss(loadingToast)
				event.target.removeAttribute("disabled")
				toast.success("Updated 👍")
			})
			.catch(({ response }) => {
				toast.dismiss(loadingToast)
				event.target.removeAttribute("disabled")
				toast.error(response?.data?.message)
			})
	}

	useEffect(() => {
		if (access_token) {
			axios
				.post(`${import.meta.env.VITE_API_URL}/users/profile`, {
					username: userData.username,
				})
				.then(({ data }) => {
					setProfile(data?.user)
					setLoading(false)
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}, [access_token])

	return (
		<AnimationWrapper>
			{loading ? (
				<Loader />
			) : (
				<form ref={editProfileFormRef}>
					<Toaster />

					<h1 className="max-md:hidden">Edit Profile</h1>

					<div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
						<div className="max-lg:center mb-5">
							<label
								htmlFor="idUploadImg"
								id="IdProfileImgLabel"
								className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
							>
								<div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
									Upload Image
								</div>
								<img
									ref={profileImgRef}
									src={profile_img}
									alt={profile_username}
								/>
							</label>

							<input
								type="file"
								id="idUploadImg"
								accept="jpg, jpeg, png"
								hidden
								onChange={handleImagePreview}
							/>

							<button
								onClick={handleImageUpload}
								className="btn-light mt-5 max-lg:center lg:w-full px-10"
							>
								Upload
							</button>
						</div>

						<div className="w-full">
							<div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
								<div>
									<InputBox
										name="fullName"
										value={fullName}
										type="text"
										placeholder="Full Name"
										disable={true}
										icon="fi-rr-user"
									/>
								</div>
								<div>
									<InputBox
										name="email"
										value={email}
										type="email"
										placeholder="Email"
										disable={true}
										icon="fi-rr-envelope"
									/>
								</div>
							</div>

							<InputBox
								name="username"
								value={profile_username}
								type="text"
								placeholder="Username"
								icon="fi-rr-at"
							/>

							<p className="text-dark-grey -mt-3">
								Username will use to search and will be visible
								to all user
							</p>

							<textarea
								name="bio"
								maxLength={bioLimit}
								defaultValue={bio}
								className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
								placeholder="Bio"
								onChange={handleCharacterChange}
							></textarea>

							<p className="text-dark-grey mt-1">
								{charactersLeft} Characters left
							</p>

							<p className="my-6 text-dark-grey">
								Add your social handles below
							</p>

							<div className="md:grid md:grid-cols-2 gap-x-6">
								{Object.keys(social_links).map((key, index) => {
									const link = social_links[key]

									return (
										<InputBox
											key={index}
											name={key}
											type="text"
											value={link}
											placeholder="https://"
											icon={
												"fi " +
												(key != "website"
													? "fi-brands-" + key
													: "fi-rr-globe")
											}
										/>
									)
								})}
							</div>

							<button
								className="btn-dark w-auto px-10"
								type="submit"
								onClick={handleSubmit}
							>
								Update
							</button>
						</div>
					</div>
				</form>
			)}
		</AnimationWrapper>
	)
}

export default EditProfile
