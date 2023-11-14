import { Link, Navigate } from "react-router-dom"
import axios from "axios"
import { Toaster, toast } from "react-hot-toast"

import { useStateContext } from "../contexts/GlobalContext"
import { authWithGoogle } from "../configs/firebase"

//utils
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils"

// components
import InputBox from "../components/InputBox"
import AnimationWrapper from "../components/common/AnimationWrapper"

// assets
import { googleIcon } from "../assets"

const AuthForm = ({ type }) => {
    const { userData, updateUserData } = useStateContext()

    const userAuthThroughApi = (apiRoute, formData) => {
        axios
            .post(`${import.meta.env.VITE_API_URL}/auth/${apiRoute}`, formData)
            .then((response) => {
                updateUserData({ type: "LOGIN", payload: response?.data?.user })
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message)
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const apiRoute = type === "sign-in" ? "signin" : "signup"

        // the `idFormElement` is the id of the form (it is an hack instead of using ref.current)
        const form = new FormData(idFormElement)

        const formData = {}

        for (const [key, value] of form.entries()) {
            formData[key] = value
        }

        // form validation

        const { fullName, email, password } = formData

        if (fullName && fullName.length < 3) {
            return toast.error("Full name must be at least 3 letter long")
        }
        if (!email) {
            return toast.error("Enter email")
        }
        if (email && !EMAIL_REGEX.test(email)) {
            return toast.error("Email is invalid")
        }
        if (!PASSWORD_REGEX.test(password)) {
            return toast.error(
                "Password should be 6 to 20 characters long with a numeric,1 lowercase and 1 uppercase letters"
            )
        }

        // authentication
        userAuthThroughApi(apiRoute, formData)
    }

    const handleGoogleAuth = (event) => {
        event.preventDefault()

        authWithGoogle()
            .then((user) => {
                const formData = {
                    access_token: user?.accessToken,
                }

                userAuthThroughApi("/google-auth", formData)
            })
            .catch((error) => {
                toast.error("trouble login through google")
                console.log(error)
            })
    }

    return userData?.access_token ? (
        <Navigate to="/" />
    ) : (
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster />

                <form
                    id="idFormElement"
                    action=""
                    className="w-[80%] max-w-[400px]"
                >
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type === "sign-in" ? "Welcome back" : "Join us today"}
                    </h1>

                    {type !== "sign-in" ? (
                        <InputBox
                            name="fullName"
                            type="text"
                            placeholder="Full name"
                            icon="fi-rr-user"
                        />
                    ) : (
                        ""
                    )}

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
                        {type.replace("-", " ")}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />
                    </div>

                    <button
                        className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                        onClick={handleGoogleAuth}
                    >
                        <img src={googleIcon} alt="google" className="w-5" />
                        continue with google
                    </button>

                    {type == "sign-in" ? (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have an account
                            <Link
                                to="/signup"
                                className="underline text-black text-xl ml-1"
                            >
                                Join as today
                            </Link>
                        </p>
                    ) : (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already a member ?
                            <Link
                                to="/signin"
                                className="underline text-black text-xl ml-1"
                            >
                                Sign in here.
                            </Link>
                        </p>
                    )}
                </form>
            </section>
        </AnimationWrapper>
    )
}

export default AuthForm
