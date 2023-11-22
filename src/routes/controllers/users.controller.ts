import express from "express"
import { getAllUsersModel } from "../models/users.models.js"


export const getAllUsers = ((req: express.Request, res: express.Response) => {
  getAllUsersModel()
    .then(result => {
      res.status(200).send(result)
    })
})  