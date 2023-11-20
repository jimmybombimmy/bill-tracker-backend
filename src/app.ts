import express from 'express'
import databaseUse from './config/database.js'

const app: express.Express = express();

app.use(express.json())
app.use(databaseUse)


app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Express + TypeScript are running together')
})

const port = 9090  
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 
export {app}