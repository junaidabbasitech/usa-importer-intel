import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Required for ES modules + __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", apiRoutes);

// Health check
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Serve frontend static files
const distPath = path.join(__dirname, "../../dist");
app.use(express.static(distPath));

// SPA fallback (IMPORTANT)
// Express 5 / path-to-regexp v8 no longer accepts the bare "/*" pattern,
// so use a catch-all middleware for unmatched GET routes instead.
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  res.sendFile(path.join(distPath, "index.html"));
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend API server running on port ${PORT}`);
});
