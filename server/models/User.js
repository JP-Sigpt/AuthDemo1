import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    work: { type: String, required: false }, // not required for mfa users
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isMfaActive: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    permissions: {
      canEdit: { type: Boolean, default: false },
      canView: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Define the model and export
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
