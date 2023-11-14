import express from "express"
import cors from "cors"
import "dotenv/config"
import admin from "firebase-admin"

import Server from "./server.js"

// configs
import { serviceAccountKey } from "./configs/index.js"

// routers
import authRouter from "./api/v1/routes/auth.js"
import blogsRouter from "./api/v1/routes/blogs.js"

const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// start server
Server.startServer(app)

// firebase config
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
})

// routes
app.use("/api/v1/auth/", authRouter)
app.use("/api/v1/blogs/", blogsRouter)
