import { Router } from "express";
import { IncomeController } from "./income.controller.js";
import { authMiddleware } from "../../core/middlewares/auth.middleware.js";

const router = Router();
const controller = new IncomeController();

/**
 * @swagger
 * tags:
 *   name: Income
 *   description: Income management
 */

router.use(authMiddleware);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
