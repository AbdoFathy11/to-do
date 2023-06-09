//? IMPORT STATEMENTS :-
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import user from './routers/users.r';

const app: express.Application = express();
const port: number = 3002;
app.use(bodyParser())
app.use(cors({
    origin: '*', 
    credentials: true,
  }))

app.get("/", (_req: Request, res: Response) => {
    res.json({msg: "hello"})
})
app.use('/user', user);

app.listen(port, () => {
    console.log(`LISTINING http://localhost:${port}`);
})