import { Router } from "express";
import { getClients } from "../services/clients.service.js";

const router = Router();

router.get("/clients", async (_req, res, next) => {
  try {
    const clients = await getClients();
    res.json({ clients, count: clients.length });
  } catch (e) {
    next(e);
  }
});

export default router;
