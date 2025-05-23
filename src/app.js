
import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { serve,setup } from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
})) //.use is used for all middlewares

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))
app.use(cookieParser())
app.use('/api/v1/api-docs',serve,setup(swaggerSpec))
//routes import 

import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import healthRouter from './routes/healtcheck.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use('/api/v1/healthCheck', healthRouter)
app.use('/api/v1/dashboard',dashboardRouter)
//https://localhost:8000/api/v1/users/register
export { app } 