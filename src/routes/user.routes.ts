import { Router } from "express";
import { userController } from "@controllers/user.controller";
import { paginationMiddleware } from "@middleware/pagination.middleware";
import { validateBody } from "@middleware/validation.middleware";
import { batchStatusUpdateSchema } from "@lib/validators/user.validator";

const router = Router();

router.get("/", paginationMiddleware, userController.getAllPaginated);
router.delete("/:userId/groups/:groupId", userController.removeFromGroup);
router.patch(
  "/statuses",
  validateBody(batchStatusUpdateSchema),
  userController.updateStatuses
);

export default router;
