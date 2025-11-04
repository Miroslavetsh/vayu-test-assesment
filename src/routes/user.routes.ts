import { Router } from "express";
import { userController } from "@controllers/user.controller";
import { paginationMiddleware } from "@middleware/pagination.middleware";

const router = Router();

router.get("/", paginationMiddleware, userController.getAllPaginated);
router.delete("/:userId/groups/:groupId", userController.removeFromGroup);
router.patch("/statuses", userController.updateStatuses);

export default router;
