import express from "express"
import { getAllUsersModel, getUserByIdModel } from "../models/users.model.js"
import { error400, error404} from "../errors.js"


export const getAllUsers = ((req: express.Request, res: express.Response) => {
  getAllUsersModel()
    .then((result: object) => {
      res.status(200).send(result)
    })
})  

export const getUserById = ((req: express.Request, res: express.Response) => {
  const user_id = req.params.user_id
  getUserByIdModel(user_id, res)
    .then((result: object) => {
      if (result) {
        res.status(200).send(result)
      } else {
        error404(res, 'userNotFound')
      }
      
    })
    .catch(() => {
      return error400(res, 'userNotHex')
    })
})  