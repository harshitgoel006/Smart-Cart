import mongoose from "mongoose";
import "../src/config/runtime.js";
import { User } from "../src/models/user.model.js";
import { DB_NAME } from "../src/constant.js";

const email = process.env.SMARTCART_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SMARTCART_ADMIN_PASSWORD;
const username = process.env.SMARTCART_ADMIN_USERNAME?.trim().toLowerCase();
const fullname = process.env.SMARTCART_ADMIN_FULLNAME?.trim();
const phone = process.env.SMARTCART_ADMIN_PHONE?.trim();

if (!email || !password || !username || !fullname || !phone) {
  throw new Error("Admin bootstrap requires SMARTCART_ADMIN_EMAIL, SMARTCART_ADMIN_PASSWORD, SMARTCART_ADMIN_USERNAME, SMARTCART_ADMIN_FULLNAME and SMARTCART_ADMIN_PHONE");
}

await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

try {
  let user = await User.findOne({
    $or: [{ email }, { phone }],
  }).select("+password");

  if (user) {
    user.role = "admin";
    user.username = username;
    user.fullname = fullname;
    user.phone = phone;
    user.password = password;
    user.isActive = true;
    user.isDeleted = false;
    user.isEmailVerified = true;
    await user.save();
    console.log("Existing account promoted to admin successfully.");
  } else {
    user = await User.create({
      email,
      password,
      username,
      fullname,
      phone,
      role: "admin",
      isEmailVerified: true,
    });
    console.log("Admin account created successfully.");
  }

  console.log(`Admin email: ${user.email}`);
} finally {
  await mongoose.disconnect();
}
