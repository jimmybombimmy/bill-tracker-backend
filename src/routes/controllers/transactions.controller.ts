import express from 'express'
import { getTransactionsByIdModel } from '../models/transactions.model.js'


export const getTransactionsById = ((req: express.Request, res: express.Response) => {
  const user_id = req.params.user_id
  getTransactionsByIdModel(user_id)
    .then((result) => {
      res.status(200).send(result)
    })
})