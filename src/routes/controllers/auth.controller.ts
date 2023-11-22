import express from 'express'
import { genPassword } from '../../lib/passwordUtils.js'
import {connection} from '../../config/database.js'
import { registerUserByIdModel } from '../models/auth.model.js'
const User = connection.models.User

export const registerUserById = ((req: express.Request, res: express.Response) => {
  
  const saltHash = genPassword(req.body.password)

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    hash: saltHash.hash,
    salt: saltHash.salt,
    admin: false
  })

  registerUserByIdModel(newUser)
  .then(() => {
    res.status(201).send({message: 'Registration Successful'});
  })

})