import mongoose from "mongoose";

/**
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
const mongoConnection = {
  isConnected: 0,
};

export const connect = async () => {
  if (mongoConnection.isConnected === 1) {
    console.log("Ya estabamos conectados");
    return;
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL || "");
    mongoConnection.isConnected = 1;
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export const disconnect = async () => {
  if (process.env.NODE_ENV === "development") return;

  if (mongoConnection.isConnected === 0) return;
  try {
    await mongoose.disconnect();
    mongoConnection.isConnected = 0;
    console.log("Desconectado de MongoDB");
  } catch (error) {
    console.log(error);
  }
};
