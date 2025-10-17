import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const ctrl = new DashboardController();

router.use(authMiddleware as any);
router.get("/", ctrl.getDashboard);

export default router;
