import mongoose from "mongoose"
import { mongoConfig, serverConfig } from "./configs/index.js"

export default class Server {
    static startServer = async (app) => {
        const CONNECTION_URL = `${mongoConfig.connectionUrl}`

        await mongoose
            .connect(CONNECTION_URL, {
                autoIndex: true,
            })
            .then(() => {
                console.log("database connection done.")
                // server listen
                app.listen(serverConfig.port, serverConfig.ip, () => {
                    console.log(
                        `Server running on http://${serverConfig.ip}:${serverConfig.port}`
                    )
                })
            })
            .catch((error) => {
                console.log("database connection error: ", error?.message)
            })
    }
}
