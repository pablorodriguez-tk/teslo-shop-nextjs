import { isValidObjectId } from "mongoose";
import { IOrder } from "../interfaces";
import { db } from ".";
import { Order } from "../models";

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  let order = null;

  if (!isValidObjectId(id)) {
    return null;
  }

  try {
    await db.connect();
    order = await Order.findById(id).lean();
    await db.disconnect();
  } catch (error) {
    console.log(error);
  }

  if (!order) {
    return null;
  }

  return JSON.parse(JSON.stringify(order));
};

export const getOrderByUser = async (userId: string): Promise<IOrder[]> => {
  let orders: IOrder[] = [];

  if (!isValidObjectId(userId)) {
    return [];
  }

  try {
    await db.connect();
    orders = await Order.find({
      user: userId,
    }).lean();
    await db.disconnect();
  } catch (error) {
    console.log(error);
  }

  return JSON.parse(JSON.stringify(orders));
};
