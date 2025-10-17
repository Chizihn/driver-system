import { Router } from "express";
import authRoutes from "./auth.routes";
import driverRoutes from "./driver.routes";
import documentRoutes from "./document.routes";
import verificationRoutes from "./verification.routes";
import dashboardRoutes from "./dashboard.routes";
import qrCodeRoutes from './qr.routes';

const router = Router();

router.use("/auth", authRoutes);
router.use("/drivers", driverRoutes);
router.use("/documents", documentRoutes);
router.use("/verifications", verificationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/qrcodes", qrCodeRoutes);

export default router;
