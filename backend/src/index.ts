import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./core/middlewares/error.middleware.js";
import expenseRoutes from "./modules/expense/expense.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import incomeRoutes from "./modules/income/income.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import budgetRoutes from "./modules/budget/budget.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./core/config/database.js";

/**
 * Main application entry point.
 * Configures global middlewares, API routes, Swagger documentation, and database connection.
 */
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
// Middleware
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5000", "http://127.0.0.1:5173", "http://127.0.0.1:5000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Swagger Config
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Expense Tracker API",
            version: "1.0.0",
            description: "API for tracking expenses with Clean Architecture",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local (localhost)",
            },
            {
                url: "http://127.0.0.1:5000",
                description: "Local (127.0.0.1)",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/modules/**/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/user", userRoutes);

// Error Handling
app.use(errorHandler);

/**
 * Initialize database connection and start listening for requests.
 * Ensures the app doesn't start without a valid database link.
 */
const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();
        console.log("Database initialization complete");

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
            console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
        });
    } catch (error) {
        console.error("Failed to start server due to database connection error:", error);
        process.exit(1);
    }
};

startServer();

export default app;
