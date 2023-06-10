import { Request, Response } from "express";
import User, { userType } from "../models/users.m";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const user = new User();

export async function createUser(req: Request, res: Response) {
  try {
    const { SALT, PEPER } = process.env;

    const { first_name, last_name, username, email, password, image } =
      req.body;
    const hashedPassword = await bcrypt.hash(password + PEPER, +SALT);

    const createdUser: userType = await user.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      image,
      verification_code: res.locals.code,
    });
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(400).json({
      msg: { File: __filename, Error: error.message },
    });
  }
}

export async function findUsers(_req: Request, res: Response) {
  try {
    const allUsers = await user.index();
    res.json(allUsers);
  } catch (error) {
    res.status(404).json({
      msg: { File: __filename, Error: error.message },
    });
  }
}

export async function findUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const theUser = await user.find(+id);
    if (theUser["msg"]) {
      res.status(404).json(theUser);
    } else {
      res.json(theUser);
    }
  } catch (error) {
    res.status(404).json({
      msg: { File: __filename, Error: error.message },
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const deletingUser = await user.deleteUser(+id);
    res.status(202).json(deletingUser);
  } catch (error) {
    res.status(405).json({
      msg: { File: __filename, Error: error.message },
    });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    const id = req.params.id;
    const theUser = await user.find(+id);
    const { PEPER, SALT } = process.env;
    const auth = await bcrypt.compare(
      currentPassword + PEPER,
      theUser.password
    );
    if (auth) {
      const hash = await bcrypt.hash(newPassword + PEPER, +SALT);
      const changing = await user.changePassword(+id, hash);
      res.status(202).json(changing);
    } else {
      res.status(401).json({
        msg: "Password is not correct",
      });
    }
  } catch (error) {
    res.status(401).json({
      msg: { File: __filename, Error: error.message },
    });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { first_name, last_name, username, email, image } = req.body;

    const id = req.params.id;

    const updating = await user.updateUser({
      first_name,
      last_name,
      username,
      email,
      image,
      id,
    } as unknown as userType);

    res.status(202).json(updating);
  } catch (error) {
    res.status(401).json({
      msg: { File: __filename, Error: error.message },
    });
  }
}

export async function verifying(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { verification_code } = await user.getCode(+id);
    const { code } = req.body;
    if (verification_code == code) {
      const ver = await user.verifying(+id);
      res.status(201).json(ver);
    } else {
      res.status(401).json({ msg: `Code ${code} is not correct.` });
    }
  } catch (error) {
    res.status(401).json({
      msg: { File: __filename, Error: error.message },
    });
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    const { usernameOrEmail, password } = req.body;
    const theUser: userType = await user.singIn(usernameOrEmail);
    if (!theUser) {
      res
        .status(404)
        .json({ msg: `no such user with this username or email`, auth: false });
    } else {
      const { PEPER, TOKEN_SECRET } = process.env;
      const realPassword = theUser.password;
      const auth = bcrypt.compare(password + PEPER, realPassword);
      if (auth) {
        const { user_id, first_name, username, last_name, image, verified } =
          theUser;
        const token = jwt.sign(
          { user_id, first_name, username, last_name, image, verified },
          TOKEN_SECRET
        );
        res.cookie("token", token, { httpOnly: true });
        res
          .status(200)
          .json({
            auth: true,
            success: "The user signed in successfully",
            token,
          });
      } else {
        res.status(404).json({ msg: `Password is not correct`, auth: false });
      }
    }
  } catch (error) {
    res.status(401).json({
      msg: { File: __filename, Error: error.message },
    });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const token = req.params.token;
    const { TOKEN_SECRET, PEPER, SALT } = process.env;
    const isRealToken = jwt.verify(token, TOKEN_SECRET);

    if (!isRealToken) {
      res
        .status(401)
        .json({ auth: false, msg: "Token not verified successfully!" });
    } else {
      const parsedToken = jwt.decode(token) as userType;
      const { newPassword } = req.body;
      const hashing = await bcrypt.hash(newPassword + PEPER, +SALT);
      const changing = await user.changePassword(parsedToken.user_id, hashing);
      res.status(201).json(changing);
    }
  } catch (error) {
    res.status(401).json({
      msg: { File: __filename, Error: error.message },
    });
  }
}
