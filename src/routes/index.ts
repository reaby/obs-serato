import { Router } from "express";
import Serato from "./Serato";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/", Serato);

// Export the base-router
export default router;
