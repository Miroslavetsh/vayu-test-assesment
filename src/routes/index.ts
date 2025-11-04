import { Router } from "express";

import userRoutes from "./user.routes";
import groupRoutes from "./group.routes";
import healthRoutes from "./health.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/groups", groupRoutes);
router.use("/health", healthRoutes);

export default router;
