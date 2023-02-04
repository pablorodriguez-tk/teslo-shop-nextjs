import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import { jwt } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        email: string;
        name: string;
        role: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return checkJWT(req, res);

    default:
      res.status(400).json({ message: "Bad request" });
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = "" } = req.cookies;

  let userId = "";
  let user = null;

  try {
    userId = await jwt.isValidToken(token);
  } catch (error) {
    return res.status(401).json({ message: "JWT no es válido" });
  }

  try {
    await db.connect();
    user = await User.findById(userId).lean();
    await db.disconnect();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error General" });
  }

  if (!user) {
    return res.status(400).json({ message: "No existe usuario con ese id" });
  }

  const { _id, email, name, role } = user;

  res.status(200).json({
    token: jwt.signToken(_id, email),
    user: {
      email,
      name,
      role,
    },
  });
};
