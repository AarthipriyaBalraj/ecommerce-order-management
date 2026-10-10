import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Cart = sequelize.define("Cart", {
id: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},
quantity: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 1,
validate: {
min: 1
}
}
});

export default Cart;
