import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = 3000; // Fixed port to match Vite proxy config

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", apiRoutes);

// Simple health check for debugging
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend API server running on http://localhost:${PORT}`);
});