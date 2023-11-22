import express from 'express'
import databaseUse from './config/session.js'
import passport from 'passport';
import routes from './routes/index.js'


const app: express.Express = express();

app.use(express.json())
app.use(databaseUse)

app.use(passport.initialize())
app.use(passport.session())

//session and 
app.use((req, res, next) => {
  console.log("session info", req.session) //session info - cookie for user
  console.log("passport info", req.user) //passport info - user logged in
  next()
})

export {app}

app.use(routes);

// const port = 9090  
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// }); 

