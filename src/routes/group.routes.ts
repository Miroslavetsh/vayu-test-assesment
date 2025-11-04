import { Router } from "express";
import { groupController } from "@controllers/group.controller";
import { paginationMiddleware } from "@middleware/pagination.middleware";

const router = Router();

router.get("/", paginationMiddleware, groupController.getAllPaginated);

export default router;
