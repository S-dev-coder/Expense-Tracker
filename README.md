# ExpenseTracker - Personal Finance Manager

A modern, full-stack personal finance application designed to help you track expenses, manage income, and stay on top of your budgets with ease.

## 🚀 Features

### Core Management
- **Expense & Income Tracking**: Comprehensive CRUD operations for all your financial transactions.
- **Receipt Management**: Upload and store digital copies of your receipts using Multer.
- **Category System**: Organize transactions into default or custom categories.
- **Search & Filter**: Find specific transactions quickly with advanced search, date ranges, and category filters.

### Smart Budgeting
- **Monthly Budgets**: Set spending limits for different categories.
- **Real-time Monitoring**: Visual indicators for budget usage and alerts when approaching limits.
- **Budget vs Actual**: Compare your planned budget with actual spending.

### User Experience
- **Secure Authentication**: Robust user management with JWT-based authentication.
- **Dashboard Overview**: At-a-glance summary of your financial health.
- **Profile Customization**: Set your preferred currency and manage account details.
- **Responsive Design**: Clean and modern UI built for various screen sizes.

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite**
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **React Hook Form** + **Zod** for form management
- **Axios** for API communication
- **Sonner** for beautiful toast notifications

### Backend
- **Node.js** & **Express**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** for data persistence
- **JWT** (JSON Web Tokens) for secure sessions
- **Multer** for file handling
- **Swagger** for API documentation
- **Nodemailer** for email-based features (coming soon)

## 📋 Prerequisites
- Node.js (v18 or higher)
- MongoDB installed locally or a MongoDB Atlas connection string
- npm or yarn

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_super_secret_jwt_key
   ```
   Start the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## 📖 API Documentation
Once the backend is running, you can explore the API using Swagger UI:
`http://localhost:5000/api-docs`

## 📝 License
This project is licensed under the ISC License.
