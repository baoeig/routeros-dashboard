import { Router } from "express";
import { routerClient } from "../router/client.js";
import type { RouterInterface, FirewallFilter } from "../router/types.js";

const router = Router();

router.get("/interfaces", async (_req, res, next) => {
  try {
    const interfaces = await routerClient.get<RouterInterface>("interface");
    res.json(
      interfaces.map((i) => ({
        name: i.name,
        type: i.type,
        running: i.running === "true",
        disabled: i.disabled === "true",
      }))
    );
  } catch (e) {
    next(e);
  }
});

router.get("/fasttrack-status", async (_req, res, next) => {
  try {
    const filters = await routerClient.get<FirewallFilter>(
      "ip/firewall/filter"
    );
    const fasttrack = filters.find(
      (f) => f.action === "fasttrack-connection" && f.disabled !== "true"
    );
    res.json({ enabled: !!fasttrack });
  } catch (e) {
    next(e);
  }
});

export default router;
