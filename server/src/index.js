import "./config/runtime.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("MONGO db connection failed !!! ", err);
  });
