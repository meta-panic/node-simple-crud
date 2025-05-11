import request from "supertest";
import { mockDBService } from "../../src/mockedDB/mockDBService.js";
import { App } from "../../src/server.js";
import { UserController } from "../../src/users/controllers/UserController.js";
import { UserService } from "../../src/users/services/UserService.js";
import * as http from "node:http";
import { jest } from "@jest/globals";


const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("Users API E2E Tests", () => {
  let appServer: http.Server;
  let dbServer: http.Server;

  const invalidId = "invalidId";
  const validButNotExistingId = "866bdd53-57a5-4e4e-ba12-e87396dcf8d9";

  beforeAll(async () => {

    dbServer = mockDBService();
    const DB_PORT = "8234";
    const MAIN_PORT = "8000";

    const userService = new UserService(`http://localhost:${DB_PORT}`);
    const userController = new UserController(userService);

    appServer = new App()
      .registerRoutes(userController.routers)
      .setDB(dbServer)
      .startDB(DB_PORT)
      .startServer(MAIN_PORT);
  });

  afterAll(async () => {
    appServer.close();
    dbServer.close();
  });

  describe("GET api/users", () => {
    it("Server should answer with status code 200 and all users records(no records)", async () => {
      const response = await request(appServer)
        .get("/api/users")
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it("Server should answer with status code 200 and all users records(no records)", async () => {
      const dummyUser1 = {
        username: "John Doe",
        age: 30,
        hobbies: ["reading", "gaming"]
      };
      const dummyUser2 = {
        username: "Jean Doe",
        age: 33,
        hobbies: ["books", "fighting with John"]
      };

      const response1 = await request(appServer) // Add user 1
        .post("/api/users")
        .send(dummyUser1);
      const createdUser1Id = response1.body.id;

      const response2 = await request(appServer) // Add user 2
        .post("/api/users")
        .send(dummyUser2);
      const createdUser2Id = response2.body.id;

      const response = await request(appServer)
        .get("/api/users")
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual([{ ...dummyUser1, id: createdUser1Id }, { ...dummyUser2, id: createdUser2Id }]);
    });
  });


  describe("GET api/users/{userId}", () => {
    it("Server should answer with status code 200 and record with id === userId if it exists", async () => {
      const dummyUser = {
        username: "John Doe",
        age: 30,
        hobbies: ["reading", "gaming"]
      };
      const createdUserResponce = await request(appServer)
        .post("/api/users")
        .send(dummyUser);
      const createdUserId = createdUserResponce.body.id;


      const response = await request(appServer)
        .get(`/api/users/${createdUserId}`)
        .expect(200);

      expect(response.body).toEqual({ ...dummyUser, id: createdUserId });
    });
    it("Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)", async () => {
      const response = await request(appServer)
        .get(`/api/users/${invalidId}`)
        .expect(400);

      expect(response.body.message).toEqual("Invalid user ID format. Expected UUID v4");
    });

    it("Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist", async () => {
      const response = await request(appServer)
        .get(`/api/users/${validButNotExistingId}`)
        .expect(404);

      expect(response.body.message).toEqual(`User with id ${validButNotExistingId} not found`);
    });
  });



  describe("POST api/users", () => {
    it("Server should answer with status code 201 and newly created record", async () => {
      const dummyUser = {
        username: "John Doe",
        age: 30,
        hobbies: ["reading", "gaming"]
      };
      const createdUserResponce = await request(appServer)
        .post("/api/users")
        .send(dummyUser)
        .expect(201);
      const createdUserId = createdUserResponce.body.id;

      expect(createdUserResponce.body).toEqual({ ...dummyUser, id: createdUserId });
    });
    it("Server should answer with status code 400 and corresponding message if request body does not contain required fields", async () => {
      const dummyUserMissingFields = {
        username: "John Doe",
        hobbies: ["reading", "gaming"]
      };
      const createdUserResponce = await request(appServer)
        .post("/api/users")
        .send(dummyUserMissingFields)
        .expect(400);

      expect(createdUserResponce.body.message).toEqual("Username, age (number), and hobbies (array) are required.");
    });
  });


  describe("PUT api/users/{userId}", () => {
    it("Server should answer with status code 200 and updated record", async () => {
      const dummyUser = {
        username: "John Doe",
        age: 30,
        hobbies: ["reading", "gaming"]
      };
      const createdUserResponce = await request(appServer)
        .post("/api/users")
        .send(dummyUser);
      const createdUserId = createdUserResponce.body.id;

      const updatedUser = {
        username: "Jean Doe",
        age: 30,
        hobbies: ["reading", "gaming"]
      };
      const updatedUserResponce = await request(appServer)
        .put(`/api/users/${createdUserId}`)
        .send(updatedUser)
        .expect(200);

      // Id stays the same
      expect(updatedUserResponce.body).toEqual({ ...updatedUser, id: createdUserId });
    });
    it("Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)", async () => {
      const updatedUser = {
        username: "Jean Doe",
        age: 30,
        hobbies: ["reading", "gaming"]
      };
      const updatedUserResponce = await request(appServer)
        .put(`/api/users/${invalidId}`)
        .send(updatedUser)
        .expect(400);

      // Id stays the same
      expect(updatedUserResponce.body.message).toEqual("Invalid user ID format. Expected UUID v4");
    });

    it("Server should answer with status code 400 and corresponding message if updated user is invalid (wrong type or missing fields)", async () => {
      const dummyUser = {
        username: "John Doe",
        age: 30,
        hobbies: ["reading", "gaming"]
      };
      const createdUserResponce = await request(appServer)
        .post("/api/users")
        .send(dummyUser);
      const createdUserId = createdUserResponce.body.id;

      const updatedUserInvalid = {
        username: "Jean Doe", // Missing "age" field
        hobbies: ["reading", "gaming"]
      };
      const updatedUserResponce = await request(appServer)
        .put(`/api/users/${createdUserId}`)
        .send(updatedUserInvalid)
        .expect(400);

      // Id stays the same
      expect(updatedUserResponce.body.message).toEqual("Invalid data format for update: username (string), age (number), hobbies (array) are required.");
    });

    it("Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist", async () => {
      const updatedUser = {
        username: "Jean Doe",
        age: 30,
        hobbies: ["reading", "gaming"]
      };
      const updatedUserResponce = await request(appServer)
        .put(`/api/users/${validButNotExistingId}`)
        .send(updatedUser)
        .expect(404);

      // Id stays the same
      expect(updatedUserResponce.body.message).toEqual(`User with id ${validButNotExistingId} not found`);
    });
  });


  describe("DELETE api/users/{userId}", () => {
    it("Server should answer with status code 204 if the record is found and deleted", async () => {
      const dummyUser = {
        username: "John Doe",
        age: 30,
        hobbies: ["reading", "gaming"]
      };
      const createdUserResponce = await request(appServer)
        .post("/api/users")
        .send(dummyUser);
      const createdUserId = createdUserResponce.body.id;

      const deletedUserResponce = await request(appServer)
        .delete(`/api/users/${createdUserId}`)
        .expect(204);

      // Id stays the same
      expect(deletedUserResponce.body).toBe("");
    });
    it("Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)", async () => {
      const deletedUserResponce = await request(appServer)
        .delete(`/api/users/${invalidId}`)
        .expect(400);

      expect(deletedUserResponce.body.message).toBe("Invalid user ID format. Expected UUID v4");
    });

    it("Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist", async () => {
      const deletedUserResponce = await request(appServer)
        .delete(`/api/users/${validButNotExistingId}`)
        .expect(404);

      expect(deletedUserResponce.body.message).toBe(`User with id ${validButNotExistingId} not found`);
    });
  });
});  
