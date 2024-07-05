const request = require("supertest");
const app = require("../index");
const db = require("../models/sequelize.models");

describe("Organisation Endpoints", () => {
  let token;
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // Register and login a user to get a token
    const registerRes = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "password",
      phone: "1234567890",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "jane@example.com",
      password: "password",
    });

    token = loginRes.body.data.accessToken;
  });

  it("should get all organisations for the logged-in user", async () => {
    const res = await request(app)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.organisations).toBeInstanceOf(Array);
  });

  it("should create an organisation", async () => {
    const res = await request(app)
      .post("/api/organisations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Jane's New Organisation",
        description: "A new organisation",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.name).toBe("Jane's New Organisation");
  });

  it("should add a user to an organisation", async () => {
    // Create a new organisation
    const createOrgRes = await request(app)
      .post("/api/organisations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Another Organisation",
        description: "Another organisation",
      });

    const organisationId = createOrgRes.body.data.orgId;

    // Register a new user
    const registerRes = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Smith",
      email: "johnsmith@example.com",
      password: "password",
      phone: "1234567890",
    });

    const userId = registerRes.body.data.user.userId;

    // Add user to organisation
    const addUserRes = await request(app)
      .post(`/api/organisations/${organisationId}/users`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId,
      });

    expect(addUserRes.statusCode).toEqual(200);
    expect(addUserRes.body.status).toBe("success");
    expect(addUserRes.body.message).toBe(
      "User added to organisation successfully"
    );
  });
});
