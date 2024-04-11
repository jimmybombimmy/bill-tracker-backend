import express from 'express'
import {connection} from '../../config/database.js'
import { User } from '../../config/database.js'

export const getAllUsersModel = () => {
  return User.find()
}

export const getUserByIdModel = (user_id: string, res: express.Response) => {
  return User.find({_id: user_id})
    .then(user => {
      return user[0]
    })
}