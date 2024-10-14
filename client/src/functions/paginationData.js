import axios from "axios"

export const filterPaginationData = async ({
	createNewArr = false,
	state,
	data,
	page,
	countRoute,
	dataToSend = {},
	user = undefined,
}) => {
	let obj

	let headers = {}

	if (user) {
		headers.headers = {
			Authorization: `Bearer ${user}`,
		}
	}

	if (state !== null && !createNewArr) {
		obj = { ...state, results: [...state.results, ...data], page: page }
	} else {
		await axios
			.post(
				`/api/v1/${countRoute}`,
				dataToSend,
				headers
			)
			.then(({ data: { totalDocs } }) => {
				obj = { results: data, page: 1, totalDocs }
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return obj
}
