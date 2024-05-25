import crypto from "crypto";
import { Response } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { responseBase } from "shared";

class CustomError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const encryptPassword = async (password: string): Promise<string> => {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return [salt, hash].join("$");
};

const validatePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const [salt, originalHash] = hashedPassword.split("$");

  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return hash === originalHash;
};

const sendError = (res: Response, msg: Object, code: String) => {
  res.send(
    responseBase.parse({
      code: code,
      payload: {},
      error: {
        ...msg,
      },
    }),
  );
};

function handleErrors(error: unknown, res: Response<any, Record<string, any>>) {
  if (error instanceof z.ZodError) {
    sendError(
      res,
      { msg: error.errors.map((e) => e.message).join("; ") },
      "400",
    );
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error.code, error.meta, error.message);
    const err = {
      code: error.code,
      meta: error.meta,
      msg: error.message,
    };
    sendError(res, err, "400");
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    sendError(res, { msg: error.message }, "400");
  } else if (error instanceof CustomError) {
    sendError(res, { msg: error.message }, error.code);
  } else if (error instanceof Error) {
    sendError(res, { msg: error.message }, "500");
  } else {
    console.log(error);
    sendError(res, { msg: String(error) }, "500");
  }
}

export { encryptPassword, validatePassword, handleErrors, CustomError };
