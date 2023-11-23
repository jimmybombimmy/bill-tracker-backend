import express from 'express'
import { connection } from '../../config/database.js'
const User = connection.models.User

export const registerUserByIdModel = (async (newUser: any, res: express.Response) => {

  const existingUser = await User.findOne({
    $or: [
      { username: newUser.username },
      { email: newUser.email }
    ]
  })

  if (existingUser) {
    if (existingUser.username === newUser.username) {
      return {message: "Username already exists"};
    }
    if (existingUser.email === newUser.email) {
      return {message: "Email already exists"};
    }
  }

  return newUser.save(newUser)
    .then((user: object) => {
      return user
    })

})
