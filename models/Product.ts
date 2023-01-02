import mongoose, { Schema, Model, model } from "mongoose";
import { IProduct } from "../interfaces/products";

const productSchema: Schema = new Schema(
  {
    description: { type: String, require: true },
    images: [{ type: String }],
    inStock: { type: Number, require: true, default: 0 },
    price: { type: Number, require: true, default: 0 },
    sizes: [
      {
        type: String,
        enum: {
          values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
          message: "{VALUE} no es un tamaño válido",
        },
        require: true,
      },
    ],
    slug: { type: String, require: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, require: true },
    type: {
      type: String,
      enum: {
        values: ["shirts", "pants", "hoodies", "hats"],
        message: "{VALUE} no es un tipo válido",
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["men", "women", "kid", "unisex"],
        message: "{VALUE} no es un género válido",
      },
    },
  },
  {
    timestamps: true,
  }
);

//TODO: Crear indice de Mongo

const Product: Model<IProduct> =
  mongoose.models.Product || model("Product", productSchema);

export default Product;
