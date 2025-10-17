"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
const ctrl = new auth_controller_1.AuthController();
router.post("/login", ctrl.login);
router.post("/register", ctrl.register);
router.post("/refresh", ctrl.refreshToken);
// Protected routes
const auth_middleware_1 = require("../middleware/auth.middleware");
router.use(auth_middleware_1.authMiddleware);
router.post("/change-password", ctrl.changePassword);
router.get("/profile", ctrl.getProfile);
exports.default = router;
