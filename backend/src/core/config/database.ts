import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/expense-tracker";
        console.log(`Attempting to connect to MongoDB...`);
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error: any) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};
