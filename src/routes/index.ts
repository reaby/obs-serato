import { Request, Response, Router } from "express";
import Serato from "./Serato";
import config from "../../config.json";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/api", Serato);
router.get("/now", (req: Request, res: Response) => {
  return res.render("now", { config: config });
});

// Export the base-router
export default router;
