import Order from "../models/order.js";
import OrderItem from "../models/orderItem.js";
import Product from "../models/product.js";
import Cart from "../models/cart.js";
import sequelize from "../config/db.js";

export const createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
        message: "Order must contain at least one item"
    });
}

        let totalAmount = 0;

        // 1. Check products and stock
        for (const item of items) {

            if (!item.productId || !item.quantity || item.quantity <= 0) {
    return res.status(400).json({
        message: "Product ID and valid quantity are required"
    });
}

            const product = await Product.findByPk(item.productId);

            if (!product) {
                return res.status(404).json({
                    message: `Product ${item.productId} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }

            totalAmount += Number(product.price) * item.quantity;
        }

        // 2. Create Order
        const order = await Order.create({
            userId: req.user.id,
            totalAmount
        });

        // 3. Create OrderItems and reduce stock
        for (const item of items) {
            const product = await Product.findByPk(item.productId);

            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });

            product.stock -= item.quantity;
            await product.save();
        }

        res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
        message: "Order creation failed",
        error: error.message
    });
}
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: {
                userId: req.user.id
            },
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product
                        }
                    ]
                }
            ]
        });

        res.json({
            orders
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            where: {
                id,
                userId: req.user.id
            },
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product
                        }
                    ]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch order",
            error: error.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
];

if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
        message: "Invalid order status"
    });
}

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.status = status;

        await order.save();

        res.json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
        message: "Failed to update order status",
        error: error.message
    });
}
};

export const checkoutFromCart = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const userId = req.user.id;
        const cartItems = await Cart.findAll({
        where: { userId },
        include: [{
            model: Product,
            required: true
        }],
        transaction
        });
                if (cartItems.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                message: "Your cart is empty"
            });
        }
                let totalAmount = 0;

        for (const item of cartItems) {
            totalAmount += Number(item.Product.price) * item.quantity;
        }
                for (const item of cartItems) {
            const product = await Product.findByPk(item.productId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!product) {
                await transaction.rollback();
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.stock < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }
        }
                const order = await Order.create({
            userId,
            totalAmount
        }, { transaction });

                for (const item of cartItems) {
            const product = await Product.findByPk(item.productId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            await OrderItem.create({
                orderId: order.id,
                productId: product.id,
                quantity: item.quantity,
                price: product.price
            }, { transaction });

            product.stock -= item.quantity;
            await product.save({ transaction });
        }
                await Cart.destroy({
            where: { userId },
            transaction
        });

                await transaction.commit();

        return res.status(201).json({
            message: "Checkout successful",
            order
        });

            } catch (error) {
        await transaction.rollback();

        console.error("Checkout error:", error.message);

        return res.status(500).json({
            message: "Checkout failed",
            error: error.message
        });
    }
};