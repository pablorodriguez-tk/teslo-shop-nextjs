import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IPaypal } from "../../../interfaces";
import { Order } from "../../../models";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);

    default:
      res.status(400).json({ message: "Bad request" });
  }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET || "";
  const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL || "";

  const base64Token = Buffer.from(
    PAYPAL_CLIENT + ":" + PAYPAL_SECRET,
    "utf-8"
  ).toString("base64");
  const body = new URLSearchParams("grant_type=client_credentials");

  try {
    const { data } = await axios.post(PAYPAL_OAUTH_URL, body, {
      headers: {
        Authorization: `Basic ${base64Token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
    return null;
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  //TODO: validad sesion del usuario
  //TODO: validar que el mongoID tenga un formato valido

  try {
    const PAYPAL_ORDERS_URL = process.env.PAYPAL_ORDERS_URL || "";

    const paypalBearerToken = await getPaypalBearerToken();

    if (!paypalBearerToken) {
      return res.status(500).json({ message: "Error al obtener el token" });
    }

    const { orderId = "", transactionId = "" } = req.body;

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
      `${PAYPAL_ORDERS_URL}/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${paypalBearerToken}`,
        },
      }
    );

    if (data.status !== "COMPLETED") {
      return res.status(401).json({ message: "Orden no reconocida" });
    }

    await db.connect();
    const dbOrder = await Order.findById(orderId);

    if (!dbOrder) {
      await db.disconnect();
      return res
        .status(400)
        .json({ message: "Orden no existe en nuestra base de datos" });
    }

    if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
      await db.disconnect();
      return res
        .status(400)
        .json({
          message: "Los montos de Paypal y nuestra orden no son iguales",
        });
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();
    await db.disconnect();

    //TODO: enviar email de confirmacion de orden al usuario
    //TODO: enviar email de confirmacion de orden al admin
    //TODO: en caso de venta virtual, enviar email con link de descarga o dar acceso a la descarga

    return res.status(200).json({ message: "Orden pagada" });
  } catch (error) {
    console.log(error);
  }
};
