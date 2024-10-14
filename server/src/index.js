import path from "node:path"
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
import usersRouter from "./api/v1/routes/users.js"
import commentsRouter from "./api/v1/routes/comments.js"
import notificationRouter from "./api/v1/routes/notification.js"
import adminRouter from "./api/v1/routes/admin.js"

const __dirname = path.resolve()

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
app.use("/api/v1/users/", usersRouter)
app.use("/api/v1/comments/", commentsRouter)
app.use("/api/v1/notifications/", notificationRouter)
app.use("/api/v1/admin/", adminRouter)

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/dist")))

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
	})
}
