import express from 'express'
import {connection} from '../../config/database.js'
import { error400 } from '../errors.js'

const User = connection.models.User

export const getAllUsersModel = () => {
  return User.find()
}

export const getUserByIdModel = (user_id: string, res: express.Response) => {
  return User.find({_id: user_id})
    .then(user => {
      return user[0]
    })
}