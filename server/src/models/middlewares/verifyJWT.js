import jwt from "jsonwebtoken"

// config
import { jwtTokenSecret } from "../configs/index.js"

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    // authHeader = "Bearer access_toke"
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            status: 6001,
            message: "access token not found",
        })
    }

    jwt.verify(token, jwtTokenSecret, (error, user) => {
        if (error) {
            return res.status(403).json({
                status: 6001,
                message: "Invalid access token",
            })
        }

        // add user to the req
        /** 
         * the user.id from the access token because the token sign time pass the user id
         *  */
        req.user = user.id 
        next() 
    })
}
