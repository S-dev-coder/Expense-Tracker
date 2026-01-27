import { Router } from "express";
import { CategoryController } from "./category.controller.js";
import { authMiddleware } from "../../core/middlewares/auth.middleware.js";

const router = Router();
const controller = new CategoryController();

router.use(authMiddleware);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
