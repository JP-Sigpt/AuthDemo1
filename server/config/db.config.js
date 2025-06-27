import mongoose from "mongoose";

const connectDb = async () => {
  try {
    let mongoUrl = process.env.MONGO_DB_URL;

    console.log("Attempting to connect to MongoDB...");
    console.log("Node.js version:", process.version);
    console.log("Environment:", process.env.NODE_ENV);
    console.log("CI:", process.env.CI);

    // For Node.js 22+, try a simpler connection approach
    const connectionOptions = {
      // Basic connection options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,

      // Remove SSL options that might cause issues
      // ssl: true,
      // sslValidate: true,
      // tls: true,
      // tlsAllowInvalidCertificates: false,

      // Keep essential options
      retryWrites: true,
      w: "majority",

      // Enable buffering for tests, disable for production
      bufferCommands: process.env.NODE_ENV === "test" ? true : false,
    };

    // For local MongoDB in CI, use simpler options
    if (process.env.CI === "true" && mongoUrl.includes("localhost")) {
      console.log("Using local MongoDB configuration for CI");
      connectionOptions.retryWrites = false;
      connectionOptions.w = 1;
    }

    const db = await mongoose.connect(mongoUrl, connectionOptions);

    console.log("Database connected successfully:", db.connection.host);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);

    // Provide troubleshooting steps
    console.error("\n=== TROUBLESHOOTING STEPS ===");
    console.error("1. Check your internet connection");
    console.error("2. Verify MongoDB Atlas cluster is running");
    console.error("3. Check if your IP is whitelisted in MongoDB Atlas");
    console.error("4. Try updating Node.js to a stable version (LTS)");
    console.error("5. Check if the MongoDB URL is correct");
    console.error("6. Verify username and password in the connection string");
    console.error("================================\n");

    throw error;
  }
};

export default connectDb;
