import { Router } from "express";
import * as userHandlers from '../handlers/users.h';

const user = Router();

user.get('/', userHandlers.findUsers);
user.get('/:id', userHandlers.findUser);
user.post('/', userHandlers.createUser);

export default user;