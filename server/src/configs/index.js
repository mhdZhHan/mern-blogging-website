import serviceAccountKey from "../mern-blogging-website-firebase-adminsdk-flubd-106df6339f.json" assert { type: "json" }

import { s3 } from "./aws.js"

const mongoConfig = {
    connectionUrl: process.env.DB_LOCATION,
}

const serverConfig = {
    ip: "127.0.0.1",
    port: process.env.PORT || 9001,
}

const jwtTokenSecret = process.env.SECRET_ACCESS_KEY

export { mongoConfig, serverConfig, jwtTokenSecret, serviceAccountKey, s3 }
