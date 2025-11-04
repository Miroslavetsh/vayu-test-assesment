import { Router } from "express";
import { groupController } from "../controllers/group.controller";

const router = Router();

router.get("/", groupController.getAll);

export default router;
