import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import connectDB from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js";
import logger from "./logger/index.js";
import morganMiddleware from "./logger/morgan.js";

// Load environment variables
dotenv.config({ path: path.resolve(".env") });

// Set fallback environment variables if not present
if (!process.env.MONGO_DB_URL) {
  process.env.MONGO_DB_URL =
    "mongodb+srv://jpanimenaruto27:ZppnpHrTycxzBELE@cluster0.xnuvsfk.mongodb.net/mfa-auth-db?retryWrites=true&w=majority";
}

if (!process.env.PORT) {
  process.env.PORT = "7001";
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET =
    "488c3cfd3569cfe4804a99d7331db6fc64fdc782401560795b7548ebbaa9a482";
}

if (!process.env.EMAIL_USER) {
  process.env.EMAIL_USER = "jayaprakash.v@si-gpt.com";
}

logger.info("=== ENVIRONMENT VARIABLES ===");
logger.info(`MONGO_DB_URL: ${process.env.MONGO_DB_URL}`);
logger.info(`PORT: ${process.env.PORT}`);
logger.info(`JWT_SECRET: ${process.env.JWT_SECRET}`);
logger.info(`EMAIL_USER: ${process.env.EMAIL_USER}`);
logger.info(`EMAIL_PASS exists: ${!!process.env.EMAIL_PASS}`);
logger.info(`EMAIL_PASS length: ${process.env.EMAIL_PASS?.length}`);
logger.info("==============================");

// Create Express app
const app = express();

app.use(morganMiddleware);

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/test", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRoutes);

// Connect to database with error handling
const initializeApp = async () => {
  try {
    await connectDB();

    // Only start the server if not in test mode
    if (process.env.NODE_ENV !== "test") {
      const PORT = process.env.PORT || 7001;
      app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
      });
    }

    return app;
  } catch (error) {
    logger.error("Failed to initialize application:", error);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
    throw error;
  }
};

// Initialize the app and export it
let initializedApp = null;

if (process.env.NODE_ENV === "test") {
  // For tests, export a promise that resolves to the initialized app
  initializedApp = initializeApp();
} else {
  // For production/development, initialize immediately
  initializeApp();
}

export default initializedApp || app;
