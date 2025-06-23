import request from "supertest";
import express from "express";
import authRoutes from "./auth.routes.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
  it("should 404 on unknown route", async () => {
    const res = await request(app).get("/api/auth/unknown");
    expect(res.statusCode).toBe(404);
  });
});
