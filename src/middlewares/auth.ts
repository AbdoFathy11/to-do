import nodemailer from "nodemailer";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { userType } from "../models/users.m";
const user = new User();

const { EMAIL, EMAIL_PASSWORD } = process.env;
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});


export async function sentResetPasswordEmail(req: Request, res: Response) {
const { TOKEN_SECRET } = process.env;
const { email } = req.body
  const userData = await user.singIn(email)
  if (userData.user_id) {
    const { user_id, first_name, username, last_name, image, verified } =
    userData;
  const token = jwt.sign(
    { user_id, first_name, username, last_name, image, verified },
    TOKEN_SECRET
  );
    await transporter
    .sendMail({
      from: "LVN",
      to: email,
      subject: "Verification CODE",
      html: `
        <h1>Hello ${userData.first_name} ${userData.last_name}, We are LVN company</h1>
        <h3>You just required to reset your password in our website</h3>
        <p>if you didn't, please just ignore the mail or take care about mf hackers. but if you have a mind like a sieve and realy forgot your password and abslutely you always forget you partener birthday.</p>
        <h5>Click in the link below to change your password</h5>
        <a href="http://localhost:3002/reset-password/${token}" style="background:#1c90f3; color:white; font-size:24px; padding:15px; margin:10px: border-radius:10px ">Change Password</a>
        `,
    })
    res.status(201).json({
      auth: true,
      success: "The Email sent successfully",
    })
  } else {
    res.status(401).json({
      auth: false,
      success: "User is not authenticated",
    })
  }

}
export async function sentEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, first_name, last_name } = req.body;
    let code = Math.floor(Math.random() * 10000);
    res.locals.code  = code
    
    await transporter
      .sendMail({
        from: "LVN",
        to: email,
        subject: "Verification CODE",
        html: `
          <h1>Hello ${first_name} ${last_name}, We are LVN company</h1>
          <h3>thank you for starting using our todo service and we hope you will like it</h3>
          <p>you verfication code id <b style="color:#1c90f3; padding: 5px; border:1px solid black; border-radius:5px;">${code}</b>. Please copy it and past it in our verification page
          in out website to ensure that you didn't put a fake email</p>
          `,
      })
      .then(() => next())
      .catch((error) => {
        res.status(401).json({
          msg: { File: __filename, Error: error.message },
        });
      });
  } catch (error) {
    res.status(401).json({
      msg: { File: __filename, Error: error.message },
    });
  }
}

export async function isVerified(
  req: Request,
  res: Response,
  next: () => void
) {
  const token = req.cookies.token;
  const decodedToken: userType = jwt.decode(token) as userType;
  const isUserVerified = decodedToken.verified;

  if (isUserVerified) {
    next();
  } else {
    res
      .status(401)
      .json({ auth: false, msg: "This user needs to be verified !" });
  }
}
