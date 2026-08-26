# 🫙 Mamta Pickles - Fullstack E-Commerce Store

**Mamta Pickles** is an authentic, fullstack e-commerce web application designed for buying traditional homemade Indian pickles. Built with **Node.js, Express, MongoDB, React, Vite**, and integrated with **Razorpay Online Checkout**.

---

## 📁 Project Architecture & Tree Structure

```text
mamta-pickles-fullstack/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Environment configuration
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/     # API Business Logic Controllers
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   └── paymentController.js
│   │   ├── middleware/      # JWT Auth & Error Handling Middlewares
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/          # Mongoose Data Models
│   │   │   ├── userModel.js
│   │   │   ├── productModel.js
│   │   │   └── orderModel.js
│   │   ├── routes/          # REST Endpoint Route Handlers
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── paymentRoutes.js
│   │   ├── utils/           # Helper Utilities & Seeder
│   │   │   ├── generateToken.js
│   │   │   ├── seedData.js
│   │   │   └── seeder.js
│   │   └── app.js           # Express App Configuration
│   ├── .env.example
│   ├── package.json
│   ├── server.js            # Backend Entry Server
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/      # Modular Component Architecture
│   │   │   ├── auth/        # Login / Register Modals
│   │   │   ├── common/      # Toast Alerts
│   │   │   ├── layout/      # Navbar & Footer
│   │   │   └── store/       # HeroBanner, CategoryFilter, ProductCards, CartDrawer, CheckoutModal
│   │   ├── context/         # Auth & Cart Context Providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── services/        # API Client Layer
│   │   │   └── api.js
│   │   ├── styles/          # Design System & Custom CSS
│   │   │   └── index.css
│   │   ├── App.jsx          # Root Component
│   │   └── main.jsx         # App Mount Point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
├── package.json             # Root Monorepo Management
└── README.md
```

---

## ✨ Features

- **Product Catalog & Search**: Filter by categories (Mango, Chili, Lemon, Garlic, Mixed, Specialty), search by keyword, and sort by price/rating.
- **Dynamic Jar Weights**: Select 250g, 500g, or 1kg jar sizes with dynamic price updating.
- **Interactive Shopping Basket**: Slide-out cart drawer with item quantity modifiers and Free Shipping progress calculator.
- **Razorpay Checkout**: Seamless Razorpay online payment integration with test mode signature verification & Cash on Delivery (COD) fallback.
- **User Authentication**: JWT-secured login and signup modals.
- **Customer Order Tracking**: View order reference, items, payment status, and order history.
- **Resilient Fallback Storage**: Automatically falls back to in-memory store if live MongoDB or Razorpay keys are not configured, ensuring zero downtime out of the box!

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Run Fullstack App (Backend + Frontend Concurrently)
```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

### 3. Seed Catalog Data (Optional)
```bash
npm run seed
```
