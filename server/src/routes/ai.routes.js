import { Router } from "express";
import { assistCustomer } from "../controllers/ai.controller.js";

const router = Router();

router.post("/assistant", assistCustomer);

export default router;
