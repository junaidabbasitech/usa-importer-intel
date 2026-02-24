import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import apiRoutes from "./routes.js"; // Use .js for ESM runtime after TS compile
import path from "path";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());

  // API routes
  app.use("/api", apiRoutes);

  if (process.env.NODE_ENV !== "production") {
    // Development mode - use Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode - serve static files from dist
    const distPath = path.resolve("dist");
    app.use(express.static(distPath));

    // SPA catch-all
    app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, '../../index.html'))
});
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => console.error("Failed to start server:", err));