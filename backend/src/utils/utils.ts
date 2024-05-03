import crypto from "crypto";

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

export { encryptPassword, validatePassword };
