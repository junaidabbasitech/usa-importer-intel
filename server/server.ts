import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10); // Use PORT from environment (Render sets this)

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", apiRoutes);

// Simple health check for debugging
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Serve static files from the dist folder (production build)
const distPath = path.join(__dirname, "../..");
app.use(express.static(distPath));

// Serve index.html for all non-API routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from ${distPath}`);
});