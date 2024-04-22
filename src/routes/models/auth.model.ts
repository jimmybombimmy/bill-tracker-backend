import express from 'express'
import { User, connection } from '../../config/database.js'
import { generateRandomHash, getPasswordResetToken } from '../../utils/otherCryptoUtils.js'
import { sendPasswordResetEmail } from '../../utils/email.js'

export const registerUserModel = (async (newUser: any, res: express.Response) => {

  const existingUser = await User.findOne({
    $or: [
      { username: newUser.username },
      { email: newUser.email }
    ]
  })

  if (existingUser) {
    if (existingUser.username === newUser.username) {
      return { message: "Username already exists" };
    }
    if (existingUser.email === newUser.email) {
      return { message: "Email already exists" };
    }
  }

  return newUser.save(newUser)
    .then((user: object) => {
      return user
    })

})

export const forgotPasswordModel = (async (userEmail: string, resetUrl: string) => {
  const existingUser = await User.findOne({
    email: userEmail
  })

  if (!existingUser) {
    //add error return here
    return
  }

  const resetToken = generateRandomHash()
  const passwordResetToken = getPasswordResetToken(resetToken)

  return User.updateOne({ username: existingUser.username }, { $set: { passwordReset: passwordResetToken } })
  .then(({acknowledged, modifiedCount}) => {
    if (acknowledged && modifiedCount > 0) {
      return sendPasswordResetEmail(resetToken, userEmail, resetUrl)
    }
    // else error
  })
  

})
