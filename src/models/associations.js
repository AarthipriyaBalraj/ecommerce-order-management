import User from "./user.js";
import Product from "./product.js";
import Order from "./order.js";
import OrderItem from "./orderItem.js";
import Cart from "./cart.js";

// User → Cart
User.hasMany(Cart, {
    foreignKey: "userId"
});

Cart.belongsTo(User, {
    foreignKey: "userId"
});

// Product → Cart
Product.hasMany(Cart, {
    foreignKey: "productId"
});

Cart.belongsTo(Product, {
    foreignKey: "productId"
});

// User → Orders
User.hasMany(Order, {
    foreignKey: "userId"
});

Order.belongsTo(User, {
    foreignKey: "userId"
});

// Order → OrderItems
Order.hasMany(OrderItem, {
    foreignKey: "orderId"
});

OrderItem.belongsTo(Order, {
    foreignKey: "orderId"
});

// Product → OrderItems
Product.hasMany(OrderItem, {
    foreignKey: "productId"
});

OrderItem.belongsTo(Product, {
    foreignKey: "productId"
});

export {
    User,
    Product,
    Order,
    OrderItem,
    Cart
};