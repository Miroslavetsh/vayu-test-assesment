import { Router } from "express";
import { groupController } from "../controllers/group.controller";

const router = Router();

router.get("/", groupController.getAllPaginated);

export default router;
