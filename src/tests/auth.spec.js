const request = require("supertest");
const app = require("../index");
const db = require("../models/sequelize.models");
const User = db.User;
const Organisation = db.Organisation;

const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "password123",
  phone: "1234567890",
};

const duplicateUser = {
  firstName: "Jane",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "password123",
  phone: "0987654321",
};

beforeAll(async () => {
  await User.destroy({ where: { email: mockUser.email } });
});

describe("Auth Controller Tests", () => {
  it("should register a user successfully with default organisation", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send(mockUser)
      .expect(201);

    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("user");

    const userId = res.body.data.user.userId;
    expect(userId).not.toBeUndefined();

    const user = await User.findByPk(userId, {
      include: Organisation,
    });

    const organisation = user.Organisations[0];
    expect(organisation).not.toBeNull();
    expect(organisation.name).toBe("John's Organisation");
  });

  it("should fail if required fields are missing", async () => {
    const incompleteUser = { ...mockUser };
    delete incompleteUser.firstName;

    const res = await request(app)
      .post("/auth/register")
      .send(incompleteUser)
      .expect(422);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(4);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        { field: "firstName", message: "First name is required" },
        { field: "lastName", message: "Last name is required" },
        { field: "email", message: "Email is required" },
        { field: "password", message: "Password is required" },
      ])
    );
  });

  it("should fail if duplicate email or userID", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send(duplicateUser)
      .expect(422);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        { field: "email", message: "Email already in use" },
      ])
    );
  });

  it("should login a user successfully", async () => {
    const loginCredentials = {
      email: mockUser.email,
      password: mockUser.password,
    };

    const res = await request(app)
      .post("/auth/login")
      .send(loginCredentials)
      .expect(200);

    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("user");
  });

  it("should fail if login credentials are incorrect", async () => {
    const incorrectCredentials = {
      email: mockUser.email,
      password: "wrongpassword",
    };

    const res = await request(app)
      .post("/auth/login")
      .send(incorrectCredentials)
      .expect(401);

    expect(res.body).toHaveProperty("status", "Bad request");
    expect(res.body).toHaveProperty("message", "Authentication failed");
    expect(res.body).toHaveProperty("statusCode", 401);
  });
});

afterAll(async () => {
  await User.destroy({ where: { email: mockUser.email } });
});
