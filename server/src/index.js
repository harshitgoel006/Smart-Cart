// This is the entry point of the server application. It imports necessary modules, loads environment variables, connects to the database, and starts the Express server. The dotenv package is used to load environment variables from a .env file, while the connectDB function establishes a connection to the MongoDB database. Once the database connection is successful, the server listens on a specified port (defaulting to 8000 if not provided in the environment variables) and logs a message indicating that the server is running. If there is an error during the database connection, it logs an error message.

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables from the .env file located at the root of the project. This allows the application to access configuration values such as database connection strings, API keys, and other sensitive information without hardcoding them in the source code.
dotenv.config({
  path: "./.env",
});

// Connect to the MongoDB database and start the server. If the connection is successful, the server listens on the specified port. If there is an error during the connection, it logs the error message and does not start the server.
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
