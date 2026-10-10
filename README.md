# E-Commerce Order Management API

A backend REST API for an e-commerce application built with **Node.js, Express.js, PostgreSQL, and Sequelize**. The application supports user authentication, role-based access control, product management, shopping cart operations, order processing, and mock payments.

## Features

* **User Authentication:** User registration and login using bcrypt password hashing and JWT authentication.
* **Role-Based Access Control (RBAC):** Separate permissions for users, sellers, and administrators.
* **Product Management:** Create, view, update, and delete products with price and stock information.
* **Shopping Cart:** Add products to the cart, view cart items, and remove items.
* **Order Management:** Create orders, retrieve order details, and view purchased products and quantities.
* **Stock Management:** Automatically decrease product stock after successful mock payment.
* **Payment Processing:** Mock payment validation against the shopping cart total.
* **Order Status Management:** Automatically confirm orders after successful mock payment, with authorized status updates.
* **API Documentation:** Interactive Swagger UI documentation for testing API endpoints.

## Tech Stack

* Node.js
* Express.js
* JavaScript (ES Modules)
* PostgreSQL
* Sequelize ORM
* JSON Web Tokens (JWT)
* bcryptjs
* Swagger / OpenAPI
* Postman

## Project Structure

```text
ecommerce-order-management/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── services/
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
├── swagger.js
└── README.md
```

## Prerequisites

Install the following before running the project:

* Node.js
* PostgreSQL
* npm
* Postman (optional, for API testing)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/AarthipriyaBalraj/ecommerce-order-management.git
cd ecommerce-order-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root directory.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_secret_key
```

Replace the example database values with your own PostgreSQL credentials. Never commit your `.env` file to GitHub.

### 4. Start the server

For development:

```bash
npm run dev
```

For normal execution:

```bash
npm start
```

The server runs at:

`http://localhost:5000`

## API Documentation

Open Swagger UI in your browser:

`http://localhost:5000/api-docs`

Use Swagger to view available endpoints, provide a JWT bearer token, and test the API.

## API Endpoints

### User APIs

| Method | Endpoint              | Description                          |
| ------ | --------------------- | ------------------------------------ |
| POST   | `/api/users/register` | Register a user                      |
| POST   | `/api/users/login`    | Log in and receive a JWT             |
| GET    | `/api/users/profile`  | Get the authenticated user's profile |

### Product APIs

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/api/products`     | Get all products    |
| GET    | `/api/products/:id` | Get a product by ID |
| POST   | `/api/products`     | Create a product    |
| PUT    | `/api/products/:id` | Update a product    |
| DELETE | `/api/products/:id` | Delete a product    |

Product write operations require the appropriate seller or administrator role.

### Cart APIs

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| POST   | `/api/cart`     | Add a product to the cart |
| GET    | `/api/cart`     | View cart items           |
| DELETE | `/api/cart/:id` | Remove a cart item        |

### Order APIs

| Method | Endpoint                 | Description                                  |
| ------ | ------------------------ | -------------------------------------------- |
| POST   | `/api/orders`            | Create an order                              |
| GET    | `/api/orders`            | View orders                                  |
| GET    | `/api/orders/:id`        | View an order and its items                  |
| PUT    | `/api/orders/:id/status` | Update order status                          |
| POST   | `/api/orders/checkout`   | Checkout using the implemented checkout flow |

Order status updates require the appropriate authorized role.

### Payment API

| Method | Endpoint                     | Description                                   |
| ------ | ---------------------------- | --------------------------------------------- |
| POST   | `/api/payments/create-order` | Validate mock payment and create a paid order |

**Note:** Payment is currently simulated. No real money is processed.

## Authentication

Protected endpoints require a JWT access token.

In Postman or Swagger:

1. Register a user and log in.
2. Copy the JWT returned by the login endpoint.
3. Open the Authorization settings.
4. Select **Bearer Token** and paste the token.
5. Send the request.

Example header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Mock Payment Workflow

1. Register or log in as a user.
2. Add products to the shopping cart.
3. Check the cart total and product stock.
4. Send a POST request to `/api/payments/create-order` with the cart total.

Example request body:

```json
{
  "amount": 85000
}
```

Use the actual total of your cart instead of the example amount.

After a successful mock payment, the application:

* Creates an order.
* Saves the purchased products and quantities as order items.
* Marks the payment as `paid`.
* Sets the order status to `confirmed`.
* Decreases product stock by the purchased quantity.
* Clears the user's shopping cart.

If the amount does not match the cart total or the available stock is insufficient, the payment request is rejected.

## Database

The application uses PostgreSQL for data persistence and Sequelize ORM for database operations.

The data models include:

* User
* Product
* Cart
* Order
* OrderItem

Associations connect users to carts and orders, orders to order items, and order items to products.

## Testing

The APIs can be tested using:

* Swagger UI: `http://localhost:5000/api-docs`
* Postman: `http://localhost:5000`

Test registration, login, product operations, cart management, order creation, mock payment, order details, and stock updates.

## Security

* Passwords are hashed using bcryptjs.
* JWT authentication protects private endpoints.
* Role-based middleware restricts authorized operations.
* Environment variables store sensitive configuration.
* The `.env` file must not be committed to the repository.

## Future Improvements

* Integrate a real payment gateway.
* Add automated unit and integration tests.
* Add order cancellation and refunds.
* Improve transaction and concurrent stock handling.
* Deploy the API and database to a cloud environment.

## Author

**Aarthipriya Balraj**

Backend Developer

**Technologies:** Node.js | Express.js | PostgreSQL | Sequelize | REST APIs | JWT
