import dotenv from 'dotenv'
import express from 'express'
import authRoutes from "../src/routes/auth.route.js";
import messageRoutes from "../src/routes/message.route.js"
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser";
import cors from 'cors'
import { app,server } from './lib/socket.js';
import path from 'path'


dotenv.config()

const PORT = process.env.PORT;
const __dirname = path.resolve();


app.use(cookieParser())
app.use(express.json({ limit: '10mb' })); // For JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors( {
        origin: "http://localhost:5173",
        credentials: true,
        
    }))


app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}


app.get("/", (req, res) => {
    res.send("Hello Server");
})

server.listen(PORT, () => {
    
    console.log(`Server is running on Port:${PORT}`)
    connectDB()
})

