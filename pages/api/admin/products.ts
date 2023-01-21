import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

type Data =
  | {
      message: string;
    }
  | IProduct[]
  | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    case "PUT":
      return updateProduct(req, res);
    case "POST":
      return createProduct(req, res);
    default:
      res.status(400).json({ message: "Bad request" });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const products = await Product.find().sort({ title: "asc" }).lean();
  await db.disconnect();

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });

  res.status(200).json(updatedProducts);
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: "El id del producto no es válido" });
  }

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: "El producto debe tener al menos 2 imágenes" });
  }

  //TODO: posiblemente tendremos un localhost:3000/products/adsads.jpg

  try {
    await db.connect();
    const product = await Product.findById(_id);

    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: "El producto no existe" });
    }

    //TODO: eliminar fotos en cloudinary o minio (s3)

    // https://res.cloudinary.com/drcq2kx3u/image/upload/v1674314097/jymqtqsdgelifi2dm7tr.webp

    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        //Borrar de cloudinary
        const [fileId, extension] = image
          .substring(image.lastIndexOf("/") + 1)
          .split(".");
        if (fileId) {
          await cloudinary.uploader.destroy(fileId);
        }
      }
    });

    await product.updateOne(req.body);
    await db.disconnect();
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = "", images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: "El producto debe tener al menos 2 imágenes" });
  }

  //TODO: posiblemente tendremos un localhost:3000/products/adsads.jpg

  try {
    await db.connect();
    const productInDB = await Product.findOne({ slug: req.body.slug });

    if (productInDB) {
      await db.disconnect();
      return res.status(400).json({ message: "El producto ya existe" });
    }

    //TODO: eliminar fotos en cloudinary o minio (s3)

    const product = new Product(req.body);
    await product.save();

    await db.disconnect();
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};
