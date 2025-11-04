import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getAllPaginated);

export default router;
