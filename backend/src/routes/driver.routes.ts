import { Router } from "express";
import { DriverController } from "../controllers/driver.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const ctrl = new DriverController();

router.use(authMiddleware as any);
router.post("/", ctrl.createDriver);
router.get("/search", ctrl.searchDrivers);
router.get("/", ctrl.getAllDrivers);
router.get("/:id", ctrl.getDriverById);
router.put("/:id", ctrl.updateDriver);
router.delete("/:id/deactivate", ctrl.deactivateDriver);

export default router;
