import UserActivity from "../models/UserActivity.js";

export const getUserActivityLogs = async (req, res) => {
  const userId = req.user.id;

  try {
    const logs = await UserActivity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ logs });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
