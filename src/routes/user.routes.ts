import { Router } from "express";
import { userController } from "@controllers/user.controller";
import { paginationMiddleware } from "@middleware/pagination.middleware";

const router = Router();

router.get("/", paginationMiddleware, userController.getAllPaginated);
router.delete("/:userId/groups/:groupId", userController.removeFromGroup);

export default router;
