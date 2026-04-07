// Database connection setup using Mongoose

import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

// This function establishes a connection to the MongoDB database using the connection string from environment variables. It logs a success message on successful connection and exits the process on failure.
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
