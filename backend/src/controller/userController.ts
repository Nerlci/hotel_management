import { Request, Response, NextFunction } from "express";
import { userService } from "../service/userService";
import {
  CustomError,
  encryptPassword,
  handleErrors,
  validatePassword,
} from "../utils/utils";
import { responseBase } from "shared";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    const emailAvailable = await userService.checkEmailAvailability(email);

    if (!emailAvailable) {
      throw new CustomError("400", "Email already taken");
    }

    const hashedPassword = await encryptPassword(password);

    const user = await userService.createUser({
      email,
      username,
      password: hashedPassword,
    });

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {
        email: user.email,
        username: user.username,
        type: user.type,
      },
    });

    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw new CustomError("400", "Invalid email or password");
    }

    const isValid = await validatePassword(password, user.password);

    if (!isValid) {
      throw new CustomError("400", "Invalid email or password");
    }

    function parseUserType(type: number): string {
      switch (type) {
        case 0:
          return "customer";
        case 1:
          return "admin";
        case 2:
          return "reception";
        case 3:
          return "aircon-manager";
        default:
          return "customer";
      }
    }

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {
        userId: user.id,
        username: user.username,
        type: parseUserType(user.type),
      },
    });

    const token = jwt.sign(
      { userId: user.id, username: user.username, type: user.type },
      process.env.JWT_SECRET!,
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {
        message: "Logged out",
      },
    });

    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const authUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      const response = responseBase.parse({
        error: {
          msg: "Not logged in, please login first",
        },
        code: "401",
        payload: {},
      });
      console.log("no token");

      res.json(response);
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      res.locals.user = decoded;
    } catch (err) {
      console.log("token invalid");
      throw new CustomError("401", "Not logged in, please login first");
    }

    next();
  } catch (e) {
    handleErrors(e, res);
  }
};

const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;

    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw new CustomError("400", "User not found");
    }

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {
        userId: user.id,
        username: user.username,
      },
    });

    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const userController = {
  registerUser,
  loginUser,
  logoutUser,
  getUserByEmail,
};

export { userController, authUserMiddleware };
