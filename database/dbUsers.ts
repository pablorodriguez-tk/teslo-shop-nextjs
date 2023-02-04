import { User } from "../models";
import { db } from "./";
import bcrypt from "bcryptjs";

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  let user = null;
  try {
    await db.connect();
    user = await User.findOne({ email });
    await db.disconnect();
  } catch (error) {
    console.log(error);
  }
  if (!user) {
    return null;
  }
  if (!bcrypt.compareSync(password, user.password!)) {
    return null;
  }

  const { role, name, _id } = user;

  return {
    _id,
    email: email.toLocaleLowerCase(),
    role,
    name,
  };
};

//Esta funcion crea o verifica el usuario de OAuth

export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  let newUser = null;

  try {
    await db.connect();
    const user = await User.findOne({
      email: oAuthEmail.toLocaleLowerCase(),
    });

    if (user) {
      await db.disconnect();
      const { _id, name, email, role } = user;
      return { _id, name, email, role };
    }

    newUser = new User({
      email: oAuthEmail.toLocaleLowerCase(),
      name: oAuthName,
      password: "@",
      role: "client",
    });

    await newUser.save();
    await db.disconnect();
  } catch (error) {
    console.log(error);
  }

  if (!newUser) return null;

  const { _id, name, email, role } = newUser;

  return { _id, name, email, role };
};
