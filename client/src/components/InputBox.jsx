import { useState } from "react"

const InputBox = ({ name, type, id, value, placeholder, icon, disable = false }) => {
    const [passwordToggle, setPasswordToggle] = useState(false)

    return (
        <div className="relative w-[100%] mb-4">
            <input
                className="input-box"
                disabled={disable}
                type={type === 'password' ? passwordToggle ? "text" : "password" : type}
                name={name}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
            />

            <i className={"fi " + icon + " input-icon"}></i>

            {type === "password" && (
                <i
                    className={"fi fi-rr-eye" + (!passwordToggle ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"}
                    onClick={() => setPasswordToggle((current) => !current)}
                ></i>
            )}
        </div>
    )
}

export default InputBox
