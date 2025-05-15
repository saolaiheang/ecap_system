import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { TokenPayload } from "../common/types/user";

dotenv.config();
const { JWT_SECRET } = process.env;

export const generateToken = (payload: TokenPayload) => {
    return jwt.sign(payload, JWT_SECRET || "", { expiresIn: "1h" });
  };