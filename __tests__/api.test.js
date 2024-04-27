import { app } from "../dist/app.js";
import request from "supertest";
import session from "supertest-session";
import "jest-matcher-one-of";
import seed from "../dist/config/seed.js";
import { sessionInfo, passportInfo } from "../dist/app.js";
import { genPassword } from "../dist/utils/passwordUtils.js";

var testSession = null;

beforeEach(() => {
  testSession = session(app);
  return seed();
});

(function () {
  console.clear();
})();

////////Test Template////////
// describe("[REQUEST] [ENDPOINT]" , () => {
//   describe("Successful connection test(s)", () => {
//     test("[STATUS CODE]: [DESCRIPTION]", () => {
//     })
//   })
//   describe("Unsuccessful connection test(s)", () => {
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
});

describe("GET /api/users/:user_id", () => {
  describe("Successful connection test(s)", () => {
    test("200: userId returns a single object", () => {
      return request(app)
        .get("/api/users/655b51a746341227e519c2dc")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe("object");
          expect(Array.isArray(body)).toBe(false);
        });
    }),
      test("200: Article returns with a users information", () => {
        return request(app)
          .get("/api/users/655b51a746341227e519c2dc")
          .expect(200)
          .then(({ body }) => {
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
            message: "Error 400 - Bad Request: User path must be a number",
          });
        });
    }),
      test("404: article fails if user_id hex value not in database", () => {
        return request(app)
          .get("/api/users/111b51a746341227e519c2dc")
          .expect(404)
          .then(({ body }) => {
            expect(body).toMatchObject({
              message: "Error 404: User ID not found",
            });
          });
      });
  });
});

describe("POST /api/register", () => {
  describe("Successful connection test(s)", () => {
    test("201: Registered user returns message saying that login was successful and user is stored in database", async () => {
      const userReg = {
        username: "Gohan123",
        email: "gohan@satancity.com",
        password: "test123",
      };
      await request(app)
        .post("/api/register")
        .send(userReg)
        .expect(201)
        .then((result) => {
          expect(result.body.message).toBe("Registration Successful");
        });

      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const userReturn = body[body.length - 1];
          expect(userReturn.username).toBe("Gohan123");
          expect(userReturn.email).toBe("gohan@satancity.com");
          expect(typeof userReturn.hash).toBe("string");
          expect(typeof userReturn._id).toBe("string");
          expect(typeof userReturn.salt).toBe("string");
          for (let prop in userReturn) {
            expect(userReturn[prop]).not.toEqual("test123");
          }
        });
    });
  });
  describe("Unsuccessful connection test(s)", () => {
    test("409: username should not match existing username", () => {
      const userRegBad1 = {
        username: "Vegeta123",
        email: "vegeta@planetvegeta.com",
        password: "test",
      };
      return request(app)
        .post("/api/register")
        .send(userRegBad1)
        .expect(409)
        .then(({ body }) => {
          expect(body).toMatchObject({
            message: "Error 409: Username already exists",
          });
        });
    });
    test("409: email should not match existing email", () => {
      const userRegBad1 = {
        username: "Goten123",
        email: "goku@kamehouse.com",
        password: "test",
      };
      return request(app)
        .post("/api/register")
        .send(userRegBad1)
        .expect(409)
        .then(({ body }) => {
          expect(body).toMatchObject({
            message: "Error 409: Email already exists",
          });
        });
    });
  });
});

describe("POST /api/login", () => {
  describe("Successful connection test(s)", () => {
    test("201: Allow user to log in", async () => {
      const userLogin1 = {
        username: "Goku123",
        password: "test",
      };
      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession
        .get(redirectedUrl)
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject({
            message: "Login successful",
          });
        });

      return testSession
        .post("/api/logout")
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject({
            message: "Logout successful",
          });
        });
    });
    test("201: Passport and Session tokens should be present after login", async () => {
      const userId1 = "655b5158c6965d869180e906";
      const userLogin1 = {
        username: "Vegeta123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      return testSession
        .get(redirectedUrl)
        .expect(201)
        .then((response) => {
          expect(sessionInfo.passport.user).toBe(userId1);
          expect(passportInfo.username).toBe(userLogin1.username);
          expect(passportInfo.password).not.toBe(userLogin1.password);
        });
    });
  });
  describe("Unsuccessful connection test(s)", () => {
    test("401: will give an error if username does not match", () => {
      const badUserLogin1 = {
        username: "Tofu123",
        password: "test",
      };
      return request(app)
        .post("/api/login")
        .send(badUserLogin1)
        .expect(401)
        .then(({ body }) => {
          expect(body).toMatchObject({
            message: "Error 401: Username or Password is incorrect",
          });
        });
    }),
      test("401: will give an error if username does not match", () => {
        const badUserLogin2 = {
          username: "Goku123",
          password: "incorrectpassword",
        };
        return request(app)
          .post("/api/login")
          .send(badUserLogin2)
          .expect(401)
          .then(({ body }) => {
            expect(body).toMatchObject({
              message: "Error 401: Username or Password is incorrect",
            });
          });
      });
  });
});

// This test currently commented out due to risk of exceeding MailTraps limit
// Not required currently as user Bulma123 has credentials saved in seed

// describe("POST /api/forgot-password", () => {
//   describe("Successful connection test(s)", () => {
//     test("201: Password reset email sent successfully", () => {
//       const userEmail = { email: "vegeta@saiyanprince.com" };
//       const userName = { username: "Vegeta123" };

//       return request(app)
//         .post("/api/forgot-password")
//         .send(userEmail)
//         .expect(201)
//         .then(({ body }) => {
//           expect(body).toEqual({
//             message: "Password reset email sent successfully",
//           });
//         });
//     });
//   });
//   describe("Unsuccessful connection test(s)", () => {
//     test("401: Will give an error if email does not match records", () => {
//       const userEmail = { email: "ash@pallettowngym.com" };
//       return request(app)
//         .post("/api/forgot-password")
//         .send(userEmail)
//         .expect(401)
//         .then(({ body }) => {
//           expect(body).toEqual({
//             message: "Error 401: Email does not match our records",
//           });
//         });
//     });
//   });
// });

describe("PATCH /api/reset-password/:token", () => {
  describe("Successful connection test(s)", () => {
    test("200: Password updated successfully", () => {
      const newPassword = "newPass123";
      const token =
        "e603f9f3ce342368cba6009be557878640631cc635ca9f8eb40d4754008fcaac";

      return request(app)
        .patch(`/api/reset-password/${token}`)
        .send({ password: newPassword })
        .expect(200)
        .then(({ body }) => {
          expect(body.message).toBe("Password changed successfully!");
        });
    });
    test("201: User able to log in with new password", async () => {
      const newPassword = "newPass123";
      const token =
        "e603f9f3ce342368cba6009be557878640631cc635ca9f8eb40d4754008fcaac";

      await request(app)
        .patch(`/api/reset-password/${token}`)
        .send({ password: newPassword })
        .expect(200)
        .then(({ body }) => {
          expect(body.message).toBe("Password changed successfully!");
        });

      const userLogin1 = {
        username: "Bulma123",
        password: newPassword,
      };
      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession
        .get(redirectedUrl)
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject({
            message: "Login successful",
          });
        });

      return testSession
        .post("/api/logout")
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject({
            message: "Logout successful",
          });
        });
    });
  });
  describe("Unsuccessful connection test(s)", () => {
    test("408: Error should be produced if password reset token expired", () => {
      const newPassword = "newPass123";
      const token =
        "e3c978be171cd3ab7c861351dcc6ef3db2ce6bd13be2560817f3b3697c2008a7";

      return request(app)
        .patch(`/api/reset-password/${token}`)
        .send({ password: newPassword })
        .expect(408)
        .then(({ body }) => {
          expect(body.message).toBe("Error 408: Password reset token expired");
        });
    });

    test("404: Unable to find user with reset token", () => {
      const newPassword = "newPass123";
      const token = "InvalidToken123";

      return request(app)
        .patch(`/api/reset-password/${token}`)
        .send({ password: newPassword })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Error 404: User ID not found");
        });
    });

    test("404: Unable to find user with reset token", async () => {
      const newPassword = "newPass123";
      const token =
        "e603f9f3ce342368cba6009be557878640631cc635ca9f8eb40d4754008fcaac";

      await request(app)
        .patch(`/api/reset-password/${token}`)
        .send({ password: newPassword })
        .expect(200)
        .then(({ body }) => {
          expect(body.message).toBe("Password changed successfully!");
        });

      const badUserLogin = {
        username: "Bulma123",
        password: "test",
      };

      return request(app)
        .post("/api/login")
        .send(badUserLogin)
        .expect(401)
        .then(({ body }) => {
          expect(body).toMatchObject({
            message: "Error 401: Username or Password is incorrect",
          });
        });
    });
  });
});

describe("GET /api/transactions/:user", () => {
  describe("Successful connection test(s)", () => {
    test("200: Receives all of users transactions when they are logged in", async () => {
      const userId = "655b5158c6965d869180e906";

      const userLogin1 = {
        username: "Vegeta123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      return testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          body.forEach((txn) => {
            expect(txn.user_id).toBe(userId);
            expect(txn).toHaveProperty("_id", expect.any(String));
            expect(txn).toHaveProperty("name", expect.any(String));
            expect(txn.type).toBeOneOf([
              "Direct Debit",
              "Standing Order",
              "Recurring Payment",
            ]);
            expect(txn).toHaveProperty("frequency", expect.any(Object));
            expect(txn.frequency).toHaveProperty("period", expect.any(String));
            expect(txn.frequency).toHaveProperty(
              "custom_days",
              expect.any(Number)
            );
            expect(txn).toHaveProperty("created_at", expect.any(Number));
            expect(txn).toHaveProperty("amount", expect.any(Number));
          });
        });
    });
  });
  describe("Unsuccessful connection test(s)", () => {
    test("401: User can not view transactions if not logged in", () => {
      const userId = "655b5158c6965d869180e906";

      return testSession
        .get(`/api/transactions/${userId}`)
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("Error 401: User Authorization invalid");
        });
    });
    test("401: User can not view transactions of another user", async () => {
      const otherUserId = "655b50b42e2bcd090b435230";

      const userLogin1 = {
        username: "Vegeta123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      return testSession
        .get(`/api/transactions/${otherUserId}`)
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe(
            "Error 401: User is not authorized to view information"
          );
        });
    });
  });
});

describe("GET /api/transactions/:user_id/:txn_id", () => {
  const userId = "655b5158c6965d869180e906";

  let testTxn;

  describe("Successful connection test(s)", () => {
    test("200: Receives transaction matching info for txn_id", async () => {
      const userLogin1 = {
        username: "Vegeta123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      await testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          testTxn = body[0];
        });

      return testSession
        .get(`/api/transactions/${userId}/${testTxn._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(testTxn);
        });
    });
  });
  describe("Unsuccessful connection test(s)", () => {
    test("401: User can not view transaction if not logged in", () => {
      //this test needs to be done with successful test to get valid transaction id

      return testSession
        .get(`/api/transactions/${userId}/${testTxn._id}`)
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("Error 401: User Authorization invalid");
        });
    });
    test("401: User can not view transaction if transaction is not theirs to view", async () => {
      //this test needs to be done with successful test to get valid transaction id

      const userId2 = "655b50b42e2bcd090b435230";

      const userLogin2 = {
        username: "Goku123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin2)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      return testSession
        .get(`/api/transactions/${userId2}/${testTxn._id}`)
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe(
            "Error 401: User is not authorized to view information"
          );
        });
    });
  });
});

describe("GET /api/transactions/history/:user_id", () => {
  describe("Successful connection test(s)", () => {
    test("200: Receives all of users deleted transactions when they are logged in", async () => {
      const userId = "655b5158c6965d869180e906";

      const userLogin1 = {
        username: "Vegeta123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      return testSession
        .get(`/api/transactions/history/${userId}`)
        .expect(200)
        .then(({ body }) => {
          body.forEach((txn) => {
            expect(txn.user_id).toBe(userId);
            expect(txn).toHaveProperty("_id", expect.any(String));
            expect(txn).toHaveProperty("name", expect.any(String));
            expect(txn.type).toBeOneOf([
              "Direct Debit",
              "Standing Order",
              "Recurring Payment",
            ]);
            expect(txn).toHaveProperty("frequency", expect.any(Object));
            expect(txn.frequency).toHaveProperty("period", expect.any(String));
            expect(txn.frequency).toHaveProperty(
              "custom_days",
              expect.any(Number)
            );
            expect(txn).toHaveProperty("created_at", expect.any(Number));
            expect(txn).toHaveProperty("amount", expect.any(Number));
            expect(txn).toHaveProperty("cancelled_at", expect.any(Number));
          });
        });
    });
  });
  describe("Unsuccessful connection test(s)", () => {
    test("401: User can not view deleted transactions if not logged in", () => {
      const userId = "655b5158c6965d869180e906";

      return testSession
        .get(`/api/transactions/history/${userId}`)
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("Error 401: User Authorization invalid");
        });
    });
    test("401: User can not view deleted transactions of another user", async () => {
      const otherUserId = "655b50b42e2bcd090b435230";

      const userLogin1 = {
        username: "Vegeta123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      return testSession
        .get(`/api/transactions/history${otherUserId}`)
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe(
            "Error 401: User is not authorized to view information"
          );
        });
    });
  });
});

describe("POST /api/transactions", () => {
  describe("Successful connection test(s)", () => {
    test("201: User can post transactions with their user id when logged in", async () => {
      const userId = "655b50b42e2bcd090b435230";

      const userLogin1 = {
        username: "Goku123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      const transactionDetails = {
        name: "Sensu Beans",
        type: "Direct Debit",
        frequency: {
          period: "monthly",
          custom_days: 0,
        },
        amount: 10000,
      };

      return testSession
        .post("/api/transactions")
        .send(transactionDetails)
        .expect(201)
        .then(({ body }) => {
          expect(body.user_id).toBe(userId);
          expect(body.name).toBe(transactionDetails.name);
          expect(body.type).toBe(transactionDetails.type);
          expect(body.frequency.period).toBe(
            transactionDetails.frequency.period
          );
          expect(body.frequency.custom_days).toBe(
            transactionDetails.frequency.custom_days
          );
          expect(Date.now()).toBeGreaterThan(body.created_at);
          expect(Date.now()).toBeLessThan(body.created_at + 10000);
          expect(body.amount).toBe(transactionDetails.amount);
        });
    });
  });
  describe("Unsuccessful connection test(s)", () => {
    test("401: User can not view transactions if not logged in", () => {
      const transactionDetails = {
        name: "Sensu Beans",
        type: "Direct Debit",
        frequency: "monthly",
        amount: 10000,
      };
      return testSession
        .post("/api/transactions")
        .send(transactionDetails)
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("Error 401: User Authorization invalid");
        });
    });
    test("400: User can not post transactions without necessary details", async () => {
      const userId = "655b50b42e2bcd090b435230";

      const userLogin1 = {
        username: "Goku123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      const transactionDetails = {
        name: undefined,
        type: "Direct Debit",
        frequency: undefined,
        amount: 10000,
      };

      return testSession
        .post("/api/transactions")
        .send(transactionDetails)
        .expect(400);
    });
  });
});

describe("PATCH /api/transactions/:txn_id", () => {
  //need this here as won't be able to get info if user isn't logged in

  describe("Successful connection test(s)", () => {
    test("201: Changing a transactions amount will reflect when loading the transaction again", async () => {
      const userId = "655b50b42e2bcd090b435230";

      //Login user
      const userLogin1 = {
        username: "Goku123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      //Get transactions (so id can be used for a test)
      let txnInfo;

      await testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          txnInfo = body[0];
        });

      //Patch transaction
      const changedParam = {
        _id: txnInfo._id,
        amount: 135000,
      };

      const expectedResult = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };

      await testSession
        .patch(`/api/transactions/${txnInfo._id}`)
        .send({ txnInfo, changedParam })
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(expectedResult);
        });

      //check that transaction has changed
      return testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          expect(body[0].amount).toBe(135000);
        });
    });
    test("201: Changing a transaction amount will update created_at to the current time", async () => {
      const userId = "655b50b42e2bcd090b435230";

      //Login user
      const userLogin1 = {
        username: "Goku123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      //Get transactions (so id can be used for a test)
      let txnInfo;

      await testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          txnInfo = body[0];
        });

      //Patch transaction
      const changedParam = {
        _id: txnInfo._id,
        amount: 135000,
      };

      const expectedResult = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };

      await testSession
        .patch(`/api/transactions/${txnInfo._id}`)
        .send({ txnInfo, changedParam })
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(expectedResult);
        });

      //check that transaction has changed
      return testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          expect(body[0].created_at).toBeGreaterThan(txnInfo.created_at);
        });
    });
    test("201: details of previous transaction amount should be placed in history folder with the created_at time", async () => {
      const userId = "655b5158c6965d869180e906";

      //Login user
      const userLogin1 = {
        username: "Vegeta123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      //Get transactions (so id can be used for a test)
      let txnInfo;

      await testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          txnInfo = body[0];
        });

      //Patch transaction
      const changedParam = {
        _id: txnInfo._id,
        amount: 135000,
      };

      const expectedResult = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };

      await testSession
        .patch(`/api/transactions/${txnInfo._id}`)
        .send({ txnInfo, changedParam })
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(expectedResult);
        });

      //check that transaction has changed
      return testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          expect(body[0].history[0].created_at).toBe(1609090180000);
          expect(body[0].created_at).toBeGreaterThan(
            body[0].history[0].created_at
          );
          expect(Date.now()).toBeGreaterThan(body[0].created_at);
          expect(Date.now()).toBeLessThan(body[0].created_at + 10000);
        });
    });
  });
  describe("Unsuccessful connection test(s)", () => {
    test("400: User will not be able to update amount if it is not a number ", async () => {
      const userId = "655b5158c6965d869180e906";

      //Login user
      const userLogin1 = {
        username: "Vegeta123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      //Get transactions (so id can be used for a test)
      let txnInfo;

      await testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          txnInfo = body[0];
        });

      //Patch transaction
      const changedParam = {
        _id: txnInfo._id,
        amount: "Over 9000",
      };

      const expectedResult = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };

      await testSession
        .patch(`/api/transactions/${txnInfo._id}`)
        .send({ txnInfo, changedParam })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe(
            "Error 400 - Bad Request: Transaction info should be a number"
          );
        });
    });
    test("400: User will not be able to update amount if info is missing ", async () => {
      const userId = "655b5158c6965d869180e906";

      //Login user
      const userLogin1 = {
        username: "Vegeta123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      //Get transactions (so id can be used for a test)
      let txnInfo;

      await testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          txnInfo = body[0];
        });

      //Patch transaction
      const changedParam = {
        _id: txnInfo._id,
        amount: undefined,
      };

      const expectedResult = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };

      await testSession
        .patch(`/api/transactions/${txnInfo._id}`)
        .send({ txnInfo, changedParam })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe(
            "Error 400 - Bad Request: Transaction info incomplete"
          );
        });
    });
  });
});

describe("DELETE /api/transactions/:txn_id", () => {
  describe("Successful connection test(s)", () => {
    test("204: Transaction has successfully been deleted", async () => {
      const userId = "655b50b42e2bcd090b435230";

      //Login user
      const userLogin1 = {
        username: "Goku123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      //Get transactions (so id can be used for a test)
      let txnInfoToDelete;

      await testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          txnInfoToDelete = body[0];
        });

      //delete transaction
      await testSession
        .delete(`/api/transactions/${txnInfoToDelete._id}`)
        .expect(204);

      //check transactions array to make sure it doesn't exist anymore
      await testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          body.map((txn) => {
            expect(txn._id).not.toBe(txnInfoToDelete._id);
          });
        });
    });
    test("200: Deleted transaction has been moved to the Cancelled_Transaction db with a cancelled time", async () => {
      const userId = "655b50b42e2bcd090b435230";

      //Login user
      const userLogin1 = {
        username: "Goku123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession.get(redirectedUrl).expect(201);

      //Get transactions (so id can be used for a test)
      let txnInfoToDelete;

      await testSession
        .get(`/api/transactions/${userId}`)
        .expect(200)
        .then(({ body }) => {
          txnInfoToDelete = body[0];
        });

      //delete transaction
      await testSession
        .delete(`/api/transactions/${txnInfoToDelete._id}`)
        .expect(204);

      await testSession
        .get(`/api/transactions/history/${userId}`)
        .expect(200)
        .then(({ body }) => {
          expect(body[body.length - 1]._id).toEqual(txnInfoToDelete._id);
          expect(body[body.length - 1].name).toEqual(txnInfoToDelete.name);
          expect(body[body.length - 1].type).toEqual(txnInfoToDelete.type);
          expect(body[body.length - 1].frequency).toEqual(
            txnInfoToDelete.frequency
          );
          expect(body[body.length - 1].created_at).toEqual(
            txnInfoToDelete.created_at
          );
          expect(body[body.length - 1].amount).toEqual(txnInfoToDelete.amount);
          expect(body[body.length - 1].history).toEqual(
            txnInfoToDelete.history
          );
          expect(body[body.length - 1].cancelled_at).toBeLessThan(Date.now());
          expect(body[body.length - 1].cancelled_at).toBeGreaterThan(
            Date.now() - 10000
          );
        });
    });
  });
  describe("Unsuccessful connection test(s)", () => {
    test("400: Invalid Transaction ID produces an error", async () => {
      const userId = "655b50b42e2bcd090b435230";

      //Login user
      const userLogin1 = {
        username: "Goku123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession
        .delete(`/api/transactions/InvalidTxnId1234567890`)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe(
            "Error 400 - Bad Request: Transaction ID not valid"
          );
        });
    });
    test("404: Valid but incorrect Transaction ID produces an error", async () => {
      const userId = "655b50b42e2bcd090b435230";

      //Login user
      const userLogin1 = {
        username: "Goku123",
        password: "test",
      };

      const preRedirect = await testSession
        .post("/api/login")
        .send(userLogin1)
        .expect(302);

      const redirectedUrl = preRedirect.headers.location;
      expect(redirectedUrl).toBe("/api/login-success");

      await testSession
        .delete(`/api/transactions/655b50b42e2bcd090b123456`)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Error 404: Transaction ID not found");
        });
    });
  });
});

const port = 9090;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
