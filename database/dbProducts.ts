import { db } from ".";
import { IProduct } from "../interfaces";
import { Product } from "../models";

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  let product = null;
  try {
    await db.connect();
    product = await Product.findOne({ slug }).lean();
    await db.disconnect();
  } catch (error) {
    console.log(error);
  }

  if (!product) return null;

  product.images = product.images.map((image) => {
    return image.includes("http")
      ? image
      : `${process.env.HOST_NAME}products/${image}`;
  });

  return JSON.parse(JSON.stringify(product));
};

interface ProductSlug {
  slug: string;
}

export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
  let slugs: ProductSlug[] = [];

  try {
    await db.connect();
    const slugs = await Product.find().select("slug -_id").lean();
    await db.disconnect();
  } catch (error) {
    console.log(error);
  }

  return slugs;
};

export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
  term = term.toString().toLowerCase();
  let products: IProduct[] = [];

  try {
    await db.connect();
    products = await Product.find({
      $text: { $search: term },
    })
      .select("title images price inStock slug -_id")
      .lean();
    await db.disconnect();
  } catch (error) {
    console.log(error);
  }

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });

  return updatedProducts;
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  let products: IProduct[] = [];

  try {
    await db.connect();
    products = await Product.find().lean();
    await db.disconnect();
  } catch (error) {
    console.log(error);
  }

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });

  return JSON.parse(JSON.stringify(updatedProducts));
};
