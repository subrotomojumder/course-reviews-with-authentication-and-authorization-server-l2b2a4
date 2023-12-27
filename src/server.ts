import mongoose from "mongoose"
import config from "./app/config"
import app from "./app"

async function server() {
  try {
    await mongoose.connect(config.database_url as string)
    console.log('Connected to MongoDB')
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

server().catch((err) => console.log(err))