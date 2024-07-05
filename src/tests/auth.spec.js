const request = require("supertest");
const app = require("../index");
const db = require("../models/sequelize.models");
const User = db.User;
const Organisation = db.Organisation;

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  it("should register a user successfully", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password",
      phone: "1234567890",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.user).toHaveProperty("userId");
    expect(res.body.data.user.firstName).toBe("John");
    expect(res.body.data.user.email).toBe("john@example.com");

    const organisation = await Organisation.findOne({
      where: { name: "John's Organisation" },
    });
    expect(organisation).not.toBeNull();
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      email: "john@example.com",
      password: "password",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should login a user successfully", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "john@example.com",
      password: "password",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.user).toHaveProperty("userId");
    expect(res.body.data.user.firstName).toBe("John");
  });

  it("should fail if login credentials are incorrect", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "john@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(401);
  });
});
