import * as authController from "../controllers/auth.controllers.js";
import request from "supertest";
import app from "../index.js";
import User from "../models/User.js";

jest.setTimeout(15000);

const testUser = {
  email: "test@example.com",
  password: "Test1234!",
  work: "Test Company",
  username: "testuser",
};

beforeEach(async () => {
  // Clean up test user before each test
  await User.deleteOne({ email: testUser.email });
  // Re-create test user for login tests
  await User.create({
    ...testUser,
    isVerified: true,
  });
});

describe("authController", () => {
  it("should have a login function", () => {
    expect(typeof authController.login).toBe("function");
  });

  describe("POST /api/auth/signup", () => {
    it("should register a new user with valid data", async () => {
      // Clean up in case this user exists
      await User.deleteOne({ email: "newuser@example.com" });

      const res = await request(app).post("/api/auth/signup").send({
        email: "newuser@example.com",
        password: "NewUser123!",
        work: "Test Corp",
        username: "newuser",
      });

      // Accept 200 or 201 as success
      expect([200, 201]).toContain(res.statusCode);
      // Optionally, check for a user object or token in the response
      // expect(res.body).toHaveProperty("user");
    });

    it("should fail with invalid data", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "bad", password: "123" });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password });

      expect(res.statusCode).toBe(200);
      // Optionally, check for a token or user object
      // expect(res.body).toHaveProperty("token");
    });

    it("should fail with wrong credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: "wrongpassword" });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toMatch(/invalid email or password/i);
      expect(res.body).toHaveProperty("success", false);
    });
  });
});
