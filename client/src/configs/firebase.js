import { initializeApp } from "firebase/app"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDPFyS9cMVHoSXEcLRzx3pLvm2NePMhiIQ",
    authDomain: "mern-blogging-website.firebaseapp.com",
    projectId: "mern-blogging-website",
    storageBucket: "mern-blogging-website.appspot.com",
    messagingSenderId: "630098153768",
    appId: "1:630098153768:web:058ed27476c179bbec801d",
}

const app = initializeApp(firebaseConfig)

// google auth
const provider = new GoogleAuthProvider()

const auth = getAuth()

export const authWithGoogle = async () => {
    let user = null

    await signInWithPopup(auth, provider)
        .then((response) => {
            user = response?.user
        })
        .catch((error) => {
            console.log(error)
        })

    return user
}
