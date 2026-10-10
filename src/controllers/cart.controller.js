import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Add product to cart
export const addToCart = async (req, res) => {
try {
const { productId, quantity } = req.body;
const userId = req.user.id;
    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
            message: "Valid productId and quantity are required"
        });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    if (product.stock < quantity) {
        return res.status(400).json({
            message: `Not enough stock for ${product.name}`
        });
    }

    const existingCartItem = await Cart.findOne({
        where: { userId, productId }
    });

    if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + quantity;

        if (product.stock < newQuantity) {
            return res.status(400).json({
                message: `Not enough stock for ${product.name}`
            });
        }

        existingCartItem.quantity = newQuantity;
        await existingCartItem.save();

        return res.status(200).json({
            message: "Cart quantity updated",
            cartItem: existingCartItem
        });
    }

    const cartItem = await Cart.create({
        userId,
        productId,
        quantity
    });

    res.status(201).json({
        message: "Product added to cart",
        cartItem
    });
} catch (error) {
    res.status(500).json({
        message: "Failed to add product to cart",
        error: error.message
    });
}

};

// View my cart

export const getMyCart = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Product,
                attributes: ["id", "name", "price", "stock"]
            }]
        });

        const totalAmount = cartItems.reduce((total, item) => {
            return total + Number(item.Product.price) * item.quantity;
        }, 0);

        res.status(200).json({
            cartItems,
            totalAmount: totalAmount.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve cart",
            error: error.message
        });
    }
};


export const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;

        const cartItem = await Cart.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        await cartItem.destroy();

        res.status(200).json({
            message: "Product removed from cart successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to remove product from cart",
            error: error.message
        });
    }
};