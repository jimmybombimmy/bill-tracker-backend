import express from 'express';
import databaseUse from './config/session.js';
import passport from 'passport';
import routes from './routes/index.js';
import session from './config/session.js';
import './config/passport.js';
const app = express();
app.use(express.json());
app.use(databaseUse);
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
export { app };
app.use(routes);
// app.use((req, res, next) => {
//   console.log("session info", req.session) //session info - cookie for user
//   console.log("passport info", req.user) //passport info - user logged in
//   next()
// })
/* -----uncomment to see session and passport info----- */
// const port = 9090  
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// }); 
