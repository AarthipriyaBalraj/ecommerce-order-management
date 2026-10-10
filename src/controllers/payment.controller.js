
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import OrderItem from "../models/orderItem.js";
import sequelize from "../config/db.js";

export const createPaymentOrder = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const userId = req.user.id;
        const { amount } = req.body;

        const cartItems = await Cart.findAll({
            where: { userId },
            include: [{
                model: Product,
                required: true
            }],
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (cartItems.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                message: "Your cart is empty"
            });
        }

        let totalAmount = 0;

        for (const item of cartItems) {
            if (item.quantity > item.Product.stock) {
                await transaction.rollback();
                return res.status(400).json({
                    message: `Not enough stock for ${item.Product.name}`
                });
            }

            totalAmount +=
                Number(item.Product.price) * item.quantity;
        }

        if (
            amount === undefined ||
            amount === null ||
            amount === "" ||
            !Number.isFinite(Number(amount)) ||
            Number(amount) <= 0
        ) {
            await transaction.rollback();
            return res.status(400).json({
                message: "Enter a valid payment amount"
            });
        }

        if (
            Math.round(Number(amount) * 100) !==
            Math.round(totalAmount * 100)
        ) {
            await transaction.rollback();
            return res.status(400).json({
                message: "Payment failed: amount does not match",
                expectedAmount: Number(totalAmount.toFixed(2)),
                enteredAmount: Number(amount),
                paymentStatus: "failed"
            });
        }

        const order = await Order.create({
            userId,
            totalAmount: totalAmount.toFixed(2),
            status: "confirmed",
            paymentStatus: "paid"
        }, { transaction });

        for (const item of cartItems) {
            await OrderItem.create({
                orderId: order.id,
                productId: item.Product.id,
                quantity: item.quantity,
                price: item.Product.price
            }, { transaction });

            await item.Product.decrement(
                "stock",
                {
                    by: item.quantity,
                    transaction
                }
            );
        }

        await Cart.destroy({
            where: { userId },
            transaction
        });

        await transaction.commit();

        return res.status(201).json({
            message: "Payment successful",
            orderId: order.id,
            amount: Number(totalAmount.toFixed(2)),
            paymentStatus: "paid",
            orderStatus: "confirmed",
            note: "Mock payment only. No real money was processed."
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Payment error:", error.message);

        return res.status(500).json({
            message: "Payment failed"
        });
    }
}
