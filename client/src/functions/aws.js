import axios from "axios"

export const uploadImage = async (img, access_token) => {
    let imgUrl = null

    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/blogs/get-upload-url`,
        {
            headers: { "Authorization": `Bearer ${access_token}` }
        }
    )

    const { uploadUrl } = response?.data

    await axios({
        method: "PUT",
        url: uploadUrl,
        headers: { "Content-Type": "multipart/form-data" },
        data: img,
    })

    imgUrl = uploadUrl.split("?")[0]

    return imgUrl
}
