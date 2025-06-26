import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import connectDB from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js";
import logger from "./logger/index.js";
import morganMiddleware from "./logger/morgan.js";

dotenv.config({ path: path.resolve(".env") });

logger.info("=== ENVIRONMENT VARIABLES ===");
logger.info(`MONGO_DB_URL: ${process.env.MONGO_DB_URL}`);
logger.info(`PORT: ${process.env.PORT}`);
logger.info(`JWT_SECRET: ${process.env.JWT_SECRET}`);
logger.info(`EMAIL_USER: ${process.env.EMAIL_USER}`);
logger.info(`EMAIL_PASS exists: ${!!process.env.EMAIL_PASS}`);
logger.info(`EMAIL_PASS length: ${process.env.EMAIL_PASS?.length}`);
logger.info("==============================");

connectDB();

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

// Only start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 7001;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

export default app;
