import express from "express";
import connect from "@config/db";
import dotenv from "dotenv";
import {errorHandler} from "@middlewares/error.middleware";
import authRouter from "./routers/auth.router";
import {authenticate} from "@middlewares/auth.middleware";
import sessionRouter from "./routers/session.router";
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connect();

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/session",authenticate,sessionRouter)

app.use(errorHandler)
app.listen(8080,()=>{
    console.log("Server is running on port 8080");
})