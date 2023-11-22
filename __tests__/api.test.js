import { app } from "../dist/app.js";
import request from "supertest";
import seed from "../dist/config/seed.js";

beforeEach(() => seed());
// afterAll(() => connection.end());

////////Test Template////////
// describe('[REQUEST] [ENDPOINT]' , () => {
//   describe('Successful connection test(s)', () => {
//     test('[STATUS CODE]: [DESCRIPTION]', () => {
//     })
//   })
//   describe('Unsuccessful connection test(s)', () => {
//   })
// })

describe("GET /api/users", () => {
  describe("Successful connection test(s)", () => {
    test("200: Page returns an array of objects", async () => {
      await request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
          body.map((user) => {
            expect(typeof user).toBe("object");
          });
        });
    }),
    test("200: if users > 0, return them with all necessary parameters", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          if (body.length > 0) {
            console.log(body)
            body.map((user) => {
              expect(user).toHaveProperty("_id", expect.any(String));
              expect(user).toHaveProperty("username", expect.any(String));
              expect(user).toHaveProperty("email", expect.any(String));
              expect(user).toHaveProperty("hash", expect.any(String));
              expect(user).toHaveProperty("salt", expect.any(String));
              expect(user).toHaveProperty("admin", expect.any(Boolean));
            });
          }
        });
    });
  }),
  describe("Unsuccessful connection test(s)", () => {
    test("404: Come back with error if route not correct", () => {
      return request(app)
        .get("/api/usernames")
        .expect(404)
        .then(({ body }) => {
          expect(body).toMatchObject({
            message: "Error 404: Page not found",
          });
        });
    });
  });
})

describe("GET /api/users/user_id", () => {
  describe("Successful connection test(s)", () => {
    test("200: userId returns a single object", () => {
      return request(app)
        .get("/api/users/655b51a746341227e519c2dc")
        .expect(200)
        .then(({ body }) => {
          console.log(body)
          expect(typeof body).toBe("object");
          expect(Array.isArray(body)).toBe(false);
        });
    }),
      test("200: Article returns with a users information", () => {
        return request(app)
          .get("/api/users/655b51a746341227e519c2dc")
          .expect(200)
          .then(({ body }) => {
            console.log(body)
            expect(body.username).toEqual("Piccolo123");
            expect(body.email).toEqual("piccolo@namekian.com");
          });
      });
  });
  describe("Unsuccessful connection test(s)", () => {
    test("400: article fails if user_id is not hex value", () => {
      return request(app)
        .get("/api/users/wronguserinput123456789")
        .expect(400)
        .then(({ body }) => {
          expect(body).toMatchObject({
            message: 'Error 400 - Bad Request: User path must be a number'
          });
        });
    }),
    test("404: article fails if user_id hex value not in database", () => {
      return request(app)
        .get("/api/users/111b51a746341227e519c2dc")
        .expect(404)
        .then(({ body }) => {
          expect(body).toMatchObject({
            message: 'Error 404: User ID not found'
          });
        });
    });
  });
});

describe("POST /api/register", () => {
  describe("Successful connection test(s)", () => {
    test("201: Registered user returns message saying that login was successful", async () => {
      const userReg = {
        username: "Gohan123",
        email: "gohan@satancity.com",
        password: "test123",
      };
      await request(app)
        .post("/api/register")
        .send(userReg)
        .expect(201)
        .then(({ body }) => {
          expect(body.message).toBe("login successful");
        });
    });
  });
  describe("Unsuccessful connection test(s)", () => {});
});
