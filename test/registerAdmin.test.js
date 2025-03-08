  const request = require("supertest");
  const app = require("../app");
  const Admin = require("../models/Admin");
  const mongoose = require("mongoose");

  jest.mock("../models/Admin");

  describe("POST /api/admins/register", () => {
    afterAll(async () => {
      await mongoose.connection.close(); // Close MongoDB connection
    });

    it("should return 400 if admin already exists", async () => {
      Admin.findOne.mockResolvedValue({ email: "existing@example.com" });

      const response = await request(app).post("/api/admins/register").send({
        name: "Mian Hamid Ur Rehman",
        email: "mianhamid6426@gmail.com",
        password: "123123",
        role: "admin",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Admin already exists");
    });
  });
