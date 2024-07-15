import express from 'express'
import cors from 'cors'
import apiRouter from './routers/apiRouter.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const username = encodeURIComponent("AlbyCosmy99");
const password = encodeURIComponent("onJ20KTO7cfg6GzO");
const database = "FranchiDB"

const mongoUri = `mongodb+srv://${username}:${password}@cluster0.6fepqnw.mongodb.net/${database}?retryWrites=true&w=majority&ssl=true`

const port = process.env.PORT || 3030
const server = express()

server.use(express.json())
server.use(cors())

server.use('/api', apiRouter)


mongoose.connect(mongoUri)
.then(() => {
    server.listen(port, () => {
        console.log(`Server running on localhost:${port}`)
    })
})
.catch(err => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
});