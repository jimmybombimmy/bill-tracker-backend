import {app} from '../dist/app.js'
import request from "supertest";



////////Test Template////////
// describe('[REQUEST] [ENDPOINT]' , () => {
//   describe('Successful connection test(s)', () => {
//     test('[STATUS CODE]: [DESCRIPTION]', () => {
//     })
//   })
//   describe('Unsuccessful connection test(s)', () => {
//   })
// })

//////Test Template////////
describe('[REQUEST] [ENDPOINT]' , () => {
  describe('Successful connection test(s)', () => {
    test('[STATUS CODE]: [DESCRIPTION]', () => {
      console.log(app)
      return request(app)
        .get('/')
        .expect(200)
        .then(({body}) => {
          console.log(app)
        })
     

    })
  })
  describe('Unsuccessful connection test(s)', () => {
  })
})