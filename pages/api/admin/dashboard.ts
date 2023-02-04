import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order, Product, User } from "../../../models";

interface Dashboard {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number;
}

type Data = Dashboard | { message: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getDashboard(req, res);

    default:
      return res.status(400).json({
        message: "Bad request",
      });
  }
}
const getDashboard = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  let numberOfOrders = 0;
  let paidOrders = 0;
  let numberOfClients = 0;
  let numberOfProducts = 0;
  let productsWithNoInventory = 0;
  let lowInventory = 0;

  try {
    await db.connect();

    [
      numberOfOrders,
      paidOrders,
      numberOfClients,
      numberOfProducts,
      productsWithNoInventory,
      lowInventory,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.find({ isPaid: true }).countDocuments(),
      User.find({ role: "client" }).countDocuments(),
      Product.countDocuments(),
      Product.find({ inStock: 0 }).countDocuments(),
      Product.find({ inStock: { $lte: 10 } }).countDocuments(),
    ]);

    await db.disconnect();
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders: numberOfOrders - paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  });
};
