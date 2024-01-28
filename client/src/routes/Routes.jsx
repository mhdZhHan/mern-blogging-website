import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import PrivateRoute from "./PrivateRoute"

// components
import Navbar from "../components/Navbar"

// screens
import AuthForm from "../screens/AuthForm"
import Editor from "../screens/Editor"
import Home from "../screens/Home"
import Search from "../screens/Search"
import PageNotFound from "../screens/PageNotFound"
import UserProfile from "../screens/UserProfile"
import Blog from "../screens/Blog"

const Routes_ = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/editor"
                    element={
                        <PrivateRoute>
                            <Editor />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navbar />}>
                    <Route index element={<Home />} />
                    <Route
                        path="signin"
                        element={<AuthForm type="sign-in" />}
                    />
                    <Route
                        path="signup"
                        element={<AuthForm type="sign-up" />}
                    />
                    <Route path="search/:query" element={<Search />} />
                    <Route path="user/:id" element={<UserProfile />} />
                    <Route path="blog/:blogId" element={<Blog />} />
                    <Route path="*" element={<PageNotFound />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default Routes_
