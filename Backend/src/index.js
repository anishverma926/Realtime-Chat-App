import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { fileURLToPath } from "url";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// app.use(express.json());

// ✅ Enable CORS first
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Parse JSON with bigger limit (to allow profile pics)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Parse cookies
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  // IMPORTANT: Your folder is "Frontend", capital F (Linux is case-sensitive)
  const distPath = path.join(__dirname, "../Frontend/dist");

  app.use(express.static(distPath));

  // Express 5 catch-all that also matches "/"
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });

}



server.listen(PORT, () => {
  console.log("server is running on PORT : " + PORT);
  connectDB();
});