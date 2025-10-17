import { Router } from "express";
import { VerificationController } from "../controllers/verification.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const ctrl = new VerificationController();

router.use(authMiddleware as any);
router.post("/verify", ctrl.verifyDriver);
router.post("/verify/qrcode", ctrl.verifyByQRCode);
router.post("/verify/document", ctrl.verifyByDocumentNumber);
router.get("/history", ctrl.getVerificationHistory);
router.get("/driver/:driverId", ctrl.getDriverVerificationHistory);
router.get("/stats/officer", ctrl.getOfficerStats);
router.get("/stats/system", ctrl.getSystemStats);

export default router;
