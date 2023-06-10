//? IMPORT STATEMENTS :-
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import user from './routers/users.r';
import cookieParser from 'cookie-parser';

const app: express.Application = express();
const port: number = 3002;
app.use(cookieParser())
app.use(bodyParser.json())
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