import { Router } from "express";
import { ExpenseController } from "./expense.controller.js";
import { authMiddleware } from "../../core/middlewares/auth.middleware.js";
import { upload } from "../../core/utils/upload.utils.js";

const router = Router();
const controller = new ExpenseController();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management
 */

router.use(authMiddleware);

router.post("/", upload.single("receipt"), controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", upload.single("receipt"), controller.update);
router.delete("/bulk", controller.bulkDelete);
router.delete("/:id", controller.delete);

export default router;
