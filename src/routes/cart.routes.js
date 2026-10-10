import express from "express";
import {
    addToCart,
    getMyCart,
    removeFromCart
} from "../controllers/cart.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();


/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a product to my cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 2
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product added to cart
 *       400:
 *         description: Invalid quantity or insufficient stock
 *       401:
 *         description: Unauthorized
 */

router.post("/", authenticate, addToCart);


/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: View my cart with total amount
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items and total amount retrieved successfully
 *       401:
 *         description: Unauthorized
 */

router.get("/", authenticate, getMyCart);


/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Remove a product from my cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Product removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 */
router.delete("/:id", authenticate, removeFromCart);

export default router;