import express from 'express'

export const error400 = ((res: express.Response, reason: string) => {
  if (reason === 'userNotHex') {
    res.status(400).send({
      message: 'Error 400 - Bad Request: User path must be a number'
    })
  }
})

export const error404 = ((res: express.Response, reason: string) => {
  if (reason === 'pageNotFound') {
    res.status(404).send({
      message: 'Error 404: Page not found'
    })
  } else if (reason === 'userNotFound') {
    res.status(404).send({
      message: 'Error 404: User ID not found'
    })
  }
})

export const pageNotFound = ((req: express.Request, res: express.Response) => {
  return error404(res, 'pageNotFound')
})