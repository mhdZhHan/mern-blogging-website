const setSession = (key, value) => {
    return sessionStorage.setItem(key, value)
}

const getSession = (key) => {
    return sessionStorage.getItem(key)
}

const removeSession = (key) => {
    return sessionStorage.removeItem(key)
}

const logoutUser = () => {
    return sessionStorage.clear()
}

export { setSession, getSession, removeSession, logoutUser }