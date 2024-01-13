// require('dotenv').config({path:"./env"})
import dotenv from 'dotenv'
import mongoose from 'mongoose'
// import { DB_NAME } from './constants';
import connectDB from './db/index.js';
import {app} from './app.js'
dotenv.config({
    path:'./.env'
})
connectDB()
.then(()=>{
      app.listen(process.env.PORT|| 8000,()=>{
        console.log(`Listing at PORT ${process.env.PORT}`)
      })
})
.catch((err)=>{
   console.log("Mongo db connection faile !!!",err)
})

















// import express from 'express';
// const app = express()
//     ; (async () => {
//         try {
//             db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//             app.on("error", (error) => {
//                 console.log("ERROR: ", error);
//                 throw error;
//             })
//             app.listen(process.env.PORT, () => {
//                 console.log(`App is listening on port ${process.env.PORt}`)
//             })
//         } catch (error) {
//             console.error("Error: ", error)
//         }
//     })
