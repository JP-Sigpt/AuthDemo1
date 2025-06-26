import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully:", db.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error; // Don't use process.exit(1)
  }
};

export default connectDb;
