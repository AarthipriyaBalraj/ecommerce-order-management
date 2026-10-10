import express from "express";
import {
    createPaymentOrder
} from "../controllers/payment.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/payments/create-order:
 *   post:
 *     summary: Create a mock payment order
 *     tags: [Payments]
 *     description: Validates the entered amount against the logged-in user's cart total. No real money is processed.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 85000
 *     responses:
 *       201:
 *         description: Payment successful
 *       400:
 *         description: Invalid amount, empty cart, insufficient stock, or amount mismatch
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Payment failed
 */

router.post(
    "/create-order",
    authenticate,
    createPaymentOrder
);

export default router;

