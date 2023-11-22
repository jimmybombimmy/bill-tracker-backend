import {app} from '../dist/app.js'
import request from "supertest";
import seed from '../dist/config/seed.js'
import {connection} from '../dist/config/database.js'


await seed()
// beforeEach(() => seed());
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

describe('POST /api/register' , () => {
  describe('Successful connection test(s)', () => {
    test('201: Registered user returns message saying that login was successful', async () => {
      const userReg = {
        username: "Gohan123",
        email: "gohan@satancity.com",
        password: "test123",
      };
      await request(app)
        .post('/api/register')
        .send(userReg)
        .expect(201)
        .then(({body}) => {
          expect(body.message).toBe('login successful')
        })
    })
  })
  describe('Unsuccessful connection test(s)', () => {
  })
})