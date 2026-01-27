import { Router } from "express";
import { BudgetController } from "./budget.controller.js";
import { authMiddleware } from "../../core/middlewares/auth.middleware.js";

const router = Router();
const controller = new BudgetController();

router.use(authMiddleware);

router.post("/", controller.setBudget);
router.get("/stats", controller.getStats);
router.get("/", controller.getBudget);
router.delete("/:id", controller.deleteBudget);

export default router;
