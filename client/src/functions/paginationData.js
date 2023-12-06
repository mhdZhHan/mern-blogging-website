import axios from "axios"

export const filterPaginationData = async ({
    createNewArr = false,
    state,
    data,
    page,
    countRoute,
    dataToSend = {},
}) => {
    let obj

    if (state !== null && !createNewArr) {
        obj = { ...state, results: [...state.results, ...data], page: page }
    } else {
        await axios
            .post(`${import.meta.env.VITE_API_URL}/blogs/${countRoute}`, dataToSend)
            .then(({ data: { totalDocs } }) => {
                obj = { results: data, page: 1, totalDocs }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return obj
}
