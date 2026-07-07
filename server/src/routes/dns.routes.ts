import { Router } from "express";
import { getDnsCache, getClientDomains } from "../services/dns.service.js";

const router = Router();

router.get("/dns/cache", async (_req, res, next) => {
  try {
    const entries = await getDnsCache();
    res.json({ entries });
  } catch (e) {
    next(e);
  }
});

router.get("/dns/client-domains", async (_req, res, next) => {
  try {
    const domains = await getClientDomains();
    res.json({ domains });
  } catch (e) {
    next(e);
  }
});

export default router;
