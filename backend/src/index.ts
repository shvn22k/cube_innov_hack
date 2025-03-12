import express from "express";
import connect from "@config/db";
import dotenv from "dotenv";
import {errorHandler} from "@middlewares/error.middleware";
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connect();
app.use(errorHandler)
app.listen(8000,()=>{
    console.log("Server is running on port 8080");
})