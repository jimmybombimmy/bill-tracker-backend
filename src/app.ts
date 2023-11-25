import express from 'express'
import databaseUse from './config/session.js'
import passport from 'passport';
import routes from './routes/index.js'
import session from './config/session.js'

import './config/passport.js'


const app: express.Express = express();

app.use(express.json())
app.use(databaseUse)

app.use(session)

app.use(passport.initialize())
app.use(passport.session())

export let sessionInfo: any;
export let passportInfo: object|undefined

app.use((req, res, next) => {
  sessionInfo = req.session
  passportInfo = req.user
  next()
})

export {app} 

app.use(routes);






/* -----uncomment to see session and passport info----- */


// const port = 9090  
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// }); 

