import express from 'express'
import { deleteTransactionModel, getTransactionsByIdModel, getTransactionsHistoryByIdModel, patchTransactionModel, postTransactionModel } from '../models/transactions.model.js'
import { sessionInfo } from '../../app.js'
import { error400, error401 } from '../errors.js'
import { TransactionDataInterface } from '../../interfaces/data.interfaces.js'



export const getTransactionsById = ((req: express.Request, res: express.Response) => {
  const user_id = req.params.user_id
  if (sessionInfo.passport.user !== user_id) {
    return error401(res, 'userNotAuthed')
  }
  getTransactionsByIdModel(user_id)
    .then((result) => {
      res.status(200).send(result)
    })
})

export const getTransactionsHistoryById = ((req: express.Request, res: express.Response) => {
  const user_id = req.params.user_id
  if (sessionInfo.passport.user !== user_id) {
    return error401(res, 'userNotAuthed')
  }
  getTransactionsHistoryByIdModel(user_id)
    .then((result) => {
      res.status(200).send(result)
    })
})

export const postTransaction = ((req: express.Request, res: express.Response) => {
  const txnDetails = req.body
  const created_at = Date.now()
  const user_id = sessionInfo.passport.user
  if (!user_id) {
    return error401(res, 'userNotAuthed')
  }

  const txnInfo: TransactionDataInterface = {
    user_id,
    name: txnDetails.name,
    type: txnDetails.type,
    frequency: txnDetails.frequency,
    created_at,
    amount: txnDetails.amount,
    history: []
  }

  const txnValidCheck = (txn: TransactionDataInterface) => {
    if (txn.name) {
      return true
    } else {
      return false
    }
  }

  if (txnValidCheck(txnInfo) === false) {
    return error400(res, 'txnInfoMissing')
  } else {
    postTransactionModel(txnInfo)
    .then((result: object) => {
      res.status(201).send(result)
    })
  }
})

export const patchTransaction = ((req: express.Request, res: express.Response) => {
  const oldTxnInfo = req.body.txnInfo
  const txnId = req.params.txn_id
  const newAmount = req.body.changedParam.amount
  const userId = sessionInfo.passport.user

  if (!newAmount) {
    return error400(res, 'txnInfoMissing')
  } else if (!parseInt(newAmount)) {
    return error400(res, 'txnInfoIncorrect')
  } else {
    patchTransactionModel(oldTxnInfo, userId, txnId, newAmount)
    .then(result => {
      res.status(200).send(result)
    })
  }
})

export const deleteTransaction = ((req: express.Request, res: express.Response) => {
  const txnIdString = req.params.txn_id
  return deleteTransactionModel(txnIdString)
    .then((result) => {
      res.status(204).send()
    })
})
