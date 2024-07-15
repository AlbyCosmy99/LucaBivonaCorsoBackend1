import express from 'express'
import bookRouter from './bookRouter.js'

const apiRouter = express.Router()

apiRouter.use("/books", bookRouter)

export default apiRouter