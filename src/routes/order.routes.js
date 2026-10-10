/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

import express from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    checkoutFromCart
} from "../controllers/order.controller.js";

import {
    authenticate,
    authorizeRoles
} from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 example:
 *                   - productId: 2
 *                     quantity: 1
 *                   - productId: 3
 *                     quantity: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid order or insufficient stock
 *       404:
 *         description: Product not found
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Order creation failed
 */

router.post("/", authenticate, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to fetch orders
 */

router.get("/", authenticate, getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to fetch order
 */

router.get("/:id", authenticate, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - processing
 *                   - shipped
 *                   - delivered
 *                   - cancelled
 *                 example: processing
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid order status
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to update order status
 */

router.put(
    "/:id/status",
    authenticate,
    authorizeRoles("seller", "admin"),
    updateOrderStatus
);


/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Checkout using the logged-in user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Checkout successful
 *       400:
 *         description: Cart is empty or insufficient stock
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Checkout failed
 */

router.post("/checkout", authenticate, checkoutFromCart);

export default router;