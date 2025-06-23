import * as authController from "../controllers/auth.controllers.js";
import request from "supertest";
import app from "../index.js"; // Adjust if your Express app is exported differently

describe("authController", () => {
  it("should have a login function", () => {
    expect(typeof authController.login).toBe("function");
  });

  describe("POST /api/auth/signup", () => {
    it("should register a new user with valid data", async () => {
      // TODO: Mock DB, mailer, etc.
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "test@example.com", password: "Test1234!" });
      expect([200, 201]).toContain(res.statusCode);
      // Add more assertions
    });
    it("should fail with invalid data", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "bad", password: "123" });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with correct credentials", async () => {
      // TODO: Seed user, mock DB
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "Test1234!" });
      expect(res.statusCode).toBe(200);
    });
    it("should fail with wrong credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "wrong" });
      expect(res.statusCode).toBe(401);
    });
  });

  // Add more tests for OTP, 2FA, password reset, etc.
});
