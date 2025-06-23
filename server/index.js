import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import connectDB from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config({ path: path.resolve(".env") });

console.log("=== ENVIRONMENT VARIABLES ===");
console.log("MONGO_DB_URL:", process.env.MONGO_DB_URL);
console.log("PORT:", process.env.PORT);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("EMAIL_USER:", process.env.EMAIL_USER); // Add this
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS); // Add this
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length); // Add this
console.log("==============================");

connectDB();

const app = express();

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

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
