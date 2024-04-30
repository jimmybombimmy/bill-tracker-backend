import express from 'express'
import databaseUse from './config/session.js'
import passport from 'passport';
import router from './routes/index.js'

import './config/passport.js'
import { connectToDB, disconnectFromDB } from './config/connect.js';


const app: express.Express = express();

app.use(express.json())
app.use(databaseUse)

app.use(passport.initialize())
app.use(passport.session())

export let sessionInfo: any;
export let passportInfo: object | undefined

app.use((req, res, next) => {
  sessionInfo = req.session
  passportInfo = req.user
  next()
})

const port = 9090
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use(router)

export { app }






