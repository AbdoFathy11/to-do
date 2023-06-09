import { Request, Response } from "express";
import User from "../models/users.m";
import bcrypt from "bcrypt";

const user = new User();

export async function createUser(req: Request, res: Response) {
  try {
    const { SALT, PEPER } = process.env;

    const { first_name, last_name, username, email, password, image } =
      req.body;
    const hashedPassword = await bcrypt.hash(password + PEPER, +SALT);

    const createdUser = await user.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      image,
    });
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(400).json({
      msg: `File: ${__filename}, Error: ${error.message}`,
    });
  }
}

export async function findUsers(_req: Request, res: Response) {
  try {
    const allUsers = await user.index();
    res.json(allUsers);
  } catch (error) {
    res.status(404).json({
      msg: `File: ${__filename}, Error: ${error.message}`,
    });
  }
}

export async function findUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const theUser = await user.find(+id);
    if(theUser['msg']) {
        res.status(404).json(theUser)
    } else {
        res.json(theUser);
    }
  } catch (error) {
    res.status(404).json({
      msg: `File: ${__filename}, Error: ${error.message}`,
    });
  }
}