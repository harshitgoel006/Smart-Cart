import { Router } from "express";
import {
  initiateDummyPayment,
  completeDummyPayment,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();


// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================


// This route is for initiating a dummy payment for an order
router.route("/initiate").post(
  verifyJWT,
  authorizedRole("customer"),
  initiateDummyPayment
);


// This route is for completing a dummy payment (success / failed)
router.route("/complete").post(
  verifyJWT,
  authorizedRole("customer"),
  completeDummyPayment
);




// ======================================================
// =============== ADMIN PANEL HANDLERS (OPTIONAL) ======
// ======================================================
// For dummy payments  there is no  specific admin routes right now;
// in future if payment list and analytics are needed then we can add here


export default router;
