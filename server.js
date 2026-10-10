import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/config/db.js";

import User from "./src/models/user.js";
import Product from "./src/models/product.js";

import userRoutes from "./src/routes/user.routes.js";
import productRoutes from "./src/routes/product.routes.js";

import Order from "./src/models/order.js";
import OrderItem from "./src/models/orderItem.js";

import "./src/models/associations.js";

import orderRoutes from "./src/routes/order.routes.js";

import Cart from "./src/models/cart.js";
import cartRoutes from "./src/routes/cart.routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

import paymentRoutes from "./src/routes/payment.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
    res.send("E-Commerce Order Management API is running");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");

        await sequelize.sync();
        console.log("Tables created successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};

startServer();