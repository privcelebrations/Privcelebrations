import * as dotenv from "dotenv";
import cors from "cors";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
dotenv.config();


const app = express();

// 1. FIXED CORS CONFIGURATION
// Allow requests from your own domain (now that the frontend is served from the same place)
// Also keep localhost for development and Netlify if you still use it
app.use(cors({
  origin: [
    "http://localhost:3000",         // Local dev

    "http://195.250.21.5",           // Your Ubuntu server IP

    "https://privcelebrations.com"   // Your production domain
  ],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ... your logging middleware ...

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // 2. SERVE STATIC FILES IN PRODUCTION
  // This setup is correct. It calls serveStatic() in production.
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app); // <- This MUST include the SPA fallback route
  }

  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
