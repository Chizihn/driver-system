import { Router } from "express";
import { DocumentController } from "../controllers/document.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const ctrl = new DocumentController();

router.use(authMiddleware as any);
router.get("/", ctrl.getAllDocuments);
router.post("/", ctrl.createDocument);
router.get("/expiring", ctrl.getExpiringSoon);
router.get("/driver/:driverId", ctrl.getDriverDocuments);
router.get("/number/:documentNumber", ctrl.getDocumentByNumber);
router.get("/:id", ctrl.getDocumentById);
router.put("/:id", ctrl.updateDocument);
router.put("/:id/status", ctrl.updateDocumentStatus);

export default router;
