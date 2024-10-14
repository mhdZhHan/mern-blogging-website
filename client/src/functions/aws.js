import axios from "axios"

export const uploadImage = async (img, access_token) => {
    let imgUrl = null

    const response = await axios.get(
        `/api/v1/blogs/get-upload-url`,
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
