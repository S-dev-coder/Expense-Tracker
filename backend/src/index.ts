import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./core/middlewares/error.middleware.js";
import expenseRoutes from "./modules/expense/expense.routes.js";
import { connectDB } from "./core/config/database.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

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
    },
    apis: ["./src/modules/**/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/expenses", expenseRoutes);

// Error Handling
app.use(errorHandler);

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
