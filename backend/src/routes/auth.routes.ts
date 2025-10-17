import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const ctrl = new AuthController();

router.post("/login", ctrl.login);
router.post("/register", ctrl.register);
router.post("/refresh", ctrl.refreshToken);

// Protected routes
import { authMiddleware } from "../middleware/auth.middleware";
router.use(authMiddleware);
router.post("/change-password", ctrl.changePassword);
router.get("/profile", ctrl.getProfile);

export default router;
