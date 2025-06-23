import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    action: {
      type: String,
      required: true,
      enum: ["login", "logout"],
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    location: {
      city: { type: String },
      country: { type: String },
    },
    sessionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userActivitySchema.index({ userId: 1, createdAt: -1 });

const UserActivity =
  mongoose.models.UserActivity ||
  mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;
