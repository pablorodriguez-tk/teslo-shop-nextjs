import mongoose from "mongoose";

// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting

const mongoConnection = {
  isConnected: 0,
};

export const connect = async () => {
  if (mongoConnection.isConnected) {
    console.log("Ya estabamos conectados");
    return;
  }

  if (mongoose.connections.length > 0) {
    mongoConnection.isConnected = mongoose.connections[0].readyState;

    if (mongoConnection.isConnected === 1) {
      console.log("Usando conexión anterior");
      return;
    }
    try {
      await mongoose.disconnect();
      mongoConnection.isConnected = 0;
    } catch (error) {
      console.log(error);
    }
  }
  try {
    await mongoose.connect(process.env.MONGO_URL || "");
    mongoConnection.isConnected = 1;
    console.log("Conectado a MongoDB: ", process.env.MONGO_URL);
  } catch (error) {
    console.log(error);
  }
};

export const disconnect = async () => {
  if (mongoConnection.isConnected === 0) return;
  try {
    await mongoose.disconnect();
    mongoConnection.isConnected = 0;
    console.log("Desconectado de MongoDB");
  } catch (error) {
    console.log(error);
  }
};
