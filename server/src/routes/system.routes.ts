import { Router } from "express";
import { getSystemInfo } from "../services/system.service.js";

const router = Router();

router.get("/system", async (_req, res, next) => {
  try {
    res.json(await getSystemInfo());
  } catch (e) {
    next(e);
  }
});

export default router;
